"use client";

import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  CameraControls,
  CameraControlsImpl,
  Environment,
  Html,
  Lightformer,
  MeshReflectorMaterial,
  PerformanceMonitor,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DRACOLoader, GLTFLoader, type GLTF } from "three-stdlib";
import { hotspots, studioViews, type Paint, type Vec3 } from "@/content/studio";
import { asset } from "@/lib/asset";

/** De-badged Ferrari 458 Spider (see scripts/model/debadge.mjs and the Credits page). */
const MODEL = asset(process.env.NEXT_PUBLIC_MODEL_FILE || "/models/458-spider.glb");
/** The preview build ships the same .glb wrapped in JSON (see scripts/model/glb-to-json.mjs). */
const WRAPPED = MODEL.endsWith(".json");
const SHADOW = asset("/models/458-spider-shadow.png");

/**
 * Draco geometry decoder. WebAssembly by default; the pure-JS decoder where a host's
 * content-security policy blocks WebAssembly (the preview build sets this).
 */
let draco: DRACOLoader | null = null;
function withDraco(loader: GLTFLoader) {
  if (!draco) {
    draco = new DRACOLoader();
    draco.setDecoderPath(asset("/draco/"));
    if (process.env.NEXT_PUBLIC_DRACO_DECODER === "js") draco.setDecoderConfig({ type: "js" });
  }
  loader.setDRACOLoader(draco);
}

/** Loads a .glb that was wrapped in JSON as base64, parsing it in memory. */
class WrappedGlbLoader extends GLTFLoader {
  load(url: string, onLoad: (gltf: GLTF) => void, _onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void) {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        return res.json() as Promise<{ glb?: string }>;
      })
      .then(({ glb }) => {
        if (!glb) throw new Error(`${url} holds no model`);
        const bin = atob(glb);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        this.parse(bytes.buffer, "", onLoad, onError);
      })
      .catch((e: unknown) => {
        if (onError) onError(e as ErrorEvent);
        else console.error(e);
      });
  }
}

/** The car model; which loader is used is fixed per build, so the hook order never changes. */
function useCarModel() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return WRAPPED ? useLoader(WrappedGlbLoader, MODEL, withDraco) : useGLTF(MODEL, false, false, withDraco);
}

export type StudioCommand = { type: "view"; name: string; n: number } | { type: "zoom"; dir: 1 | -1; n: number };
/** A command before it is numbered (distributes Omit over the union). */
export type StudioCommandInput = StudioCommand extends infer C ? (C extends StudioCommand ? Omit<C, "n"> : never) : never;

type Props = {
  paint: Paint;
  wheel: string;
  active: string | null;
  onSelect: (id: string | null) => void;
  command: StudioCommand | null;
  interactive: boolean;
  running: boolean;
  onReady: () => void;
};

function Car({ paint, wheel, onPositions }: { paint: Paint; wheel: string; onPositions: (p: THREE.Vector3[]) => void }) {
  const { scene } = useCarModel();
  const ao = useTexture(SHADOW);
  const target = useMemo(() => new THREE.Color(paint.color), [paint.color]);
  const rimTarget = useMemo(() => new THREE.Color(wheel), [wheel]);

  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({ color: paint.color, metalness: 0.9, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.03 }),
      rim: new THREE.MeshStandardMaterial({ color: wheel, metalness: 1, roughness: 0.3 }),
      disc: new THREE.MeshStandardMaterial({ color: "#262729", metalness: 0.75, roughness: 0.55 }),
      trim: new THREE.MeshStandardMaterial({ color: "#18191b", metalness: 1, roughness: 0.22 }),
      glass: new THREE.MeshPhysicalMaterial({ color: "#040506", roughness: 0.02, clearcoat: 1, transparent: true, opacity: 0.72 }),
      // cabin: cuoio leather seats, dark dashboard and carpets
      leather: new THREE.MeshStandardMaterial({ color: "#7a4b2b", roughness: 0.58, metalness: 0 }),
      dash: new THREE.MeshStandardMaterial({ color: "#1b1b1d", roughness: 0.7, metalness: 0 }),
      dashLow: new THREE.MeshStandardMaterial({ color: "#111113", roughness: 0.75, metalness: 0 }),
      carpet: new THREE.MeshStandardMaterial({ color: "#0b0b0c", roughness: 0.95, metalness: 0 }),
    }),
    // materials are created once and then animated towards the selection
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Work on a copy: the loader caches one scene, and a second studio on another
  // page would otherwise take the meshes away from the first.
  const root = useMemo(() => scene.clone(true).children[0], [scene]);

  useEffect(() => {
    const set = (name: string, m: THREE.Material) => {
      const o = root.getObjectByName(name) as THREE.Mesh | undefined;
      if (o) o.material = m;
    };
    set("body", mats.body);
    set("trim", mats.trim);
    set("glass", mats.glass);
    set("leather", mats.leather);
    set("interior_dark", mats.dash);
    set("interior_light", mats.dashLow);
    set("carpet", mats.carpet);
    set("steering_leather", mats.dash);
    // The loader makes repeated node names unique ("wheel", "wheel_1", ...), so match by prefix.
    ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"].forEach((group) =>
      root.getObjectByName(group)?.traverse((o) => {
        if (!(o as THREE.Mesh).isMesh) return;
        if (o.name.startsWith("rim") || o.name.startsWith("wheel")) (o as THREE.Mesh).material = mats.rim;
        else if (o.name.startsWith("brake")) (o as THREE.Mesh).material = mats.disc;
      })
    );
    root.updateMatrixWorld(true);
    const positions = hotspots.map((h) => {
      const p = new THREE.Vector3(...h.position);
      if (h.node) {
        const node = root.getObjectByName(h.node);
        if (node) node.getWorldPosition(p);
        if (h.offset) p.add(new THREE.Vector3(...h.offset));
      }
      return p;
    });
    onPositions(positions);
  }, [root, mats, onPositions]);

  useEffect(() => {
    mats.body.metalness = paint.finish === "metallic" ? 0.9 : 0.2;
    mats.body.roughness = paint.finish === "metallic" ? 0.3 : 0.22;
  }, [paint.finish, mats]);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 5);
    mats.body.color.lerp(target, k);
    mats.rim.color.lerp(rimTarget, k);
  });

  return (
    <group>
      <primitive object={root} />
      <mesh rotation-x={-Math.PI / 2} position-y={0.002} renderOrder={2}>
        <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
        <meshBasicMaterial map={ao} blending={THREE.MultiplyBlending} toneMapped={false} transparent premultipliedAlpha />
      </mesh>
    </group>
  );
}

function Markers({ positions, active, onSelect }: { positions: THREE.Vector3[]; active: string | null; onSelect: (id: string) => void }) {
  const camera = useThree((s) => s.camera);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const normals = useMemo(() => hotspots.map((h) => new THREE.Vector3(...h.normal).normalize()), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    hotspots.forEach((_, i) => {
      const el = refs.current[i];
      const p = positions[i];
      if (!el || !p) return;
      tmp.copy(camera.position).sub(p).normalize();
      const visible = tmp.dot(normals[i]) > 0.06;
      el.style.opacity = visible ? "1" : "0";
      el.style.pointerEvents = visible ? "auto" : "none";
    });
  });

  if (!positions.length) return null;
  return (
    <>
      {hotspots.map((h, i) => (
        <Html key={h.id} position={positions[i]} center zIndexRange={[30, 0]}>
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="transition-opacity duration-300"
          >
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => onSelect(h.id)}
              className="group relative grid h-9 w-9 place-items-center"
              title={h.title}
            >
              <span
                className={`absolute inset-0 rounded-full border ${active === h.id ? "border-bronze-hi" : "border-white/50"} animate-[ping_2.4s_ease-out_infinite]`}
              />
              <span className={`h-3 w-3 rounded-full ${active === h.id ? "bg-bronze-hi" : "bg-white"} shadow-[0_0_14px_rgba(255,255,255,.7)]`} />
            </button>
          </div>
        </Html>
      ))}
    </>
  );
}

function Rig({ command, active, interactive }: { command: StudioCommand | null; active: string | null; interactive: boolean }) {
  const controls = useRef<CameraControlsImpl>(null);
  const lastInteraction = useRef(0);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const A = CameraControlsImpl.ACTION;
    c.mouseButtons.wheel = A.NONE;
    c.mouseButtons.right = A.NONE;
    c.mouseButtons.middle = A.NONE;
    c.touches.one = interactive ? A.TOUCH_ROTATE : A.NONE;
    c.touches.two = interactive ? A.TOUCH_DOLLY : A.NONE;
    c.touches.three = A.NONE;
    c.minDistance = 2.6;
    c.maxDistance = 13;
    c.minPolarAngle = 0.12;
    c.maxPolarAngle = Math.PI / 2 - 0.05;
    c.smoothTime = 0.55;
    c.draggingSmoothTime = 0.18;
    c.setBoundary(new THREE.Box3(new THREE.Vector3(-2.2, 0, -3), new THREE.Vector3(2.2, 1.6, 3)));
    const onStart = () => (lastInteraction.current = performance.now());
    c.addEventListener("controlstart", onStart);
    c.addEventListener("control", onStart);
    return () => {
      c.removeEventListener("controlstart", onStart);
      c.removeEventListener("control", onStart);
    };
  }, [interactive]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const v = studioViews.front;
    c.setLookAt(...v.pos, ...v.target, false);
  }, []);

  useEffect(() => {
    const c = controls.current;
    if (!c || !command) return;
    lastInteraction.current = performance.now();
    if (command.type === "view") {
      const v = studioViews[command.name] ?? studioViews.front;
      c.setLookAt(...v.pos, ...v.target, true);
    } else {
      c.dolly(command.dir * 1.4, true);
    }
  }, [command]);

  useEffect(() => {
    const c = controls.current;
    if (!c || !active) return;
    lastInteraction.current = performance.now();
    const h = hotspots.find((x) => x.id === active);
    if (h) c.setLookAt(...(h.view.pos as Vec3), ...(h.view.target as Vec3), true);
  }, [active]);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c || active) return;
    if (performance.now() - lastInteraction.current > 6000) c.rotate(dt * 0.07, 0, false);
  });

  return <CameraControls ref={controls} makeDefault />;
}

function StudioLights() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <Lightformer form="rect" intensity={4} position={[0, 6, 0]} scale={[2.2, 12, 1]} />
      <Lightformer form="rect" intensity={1.3} position={[-4, 5, 0]} scale={[3, 9, 1]} />
      <Lightformer form="rect" intensity={1.3} position={[4, 5, 0]} scale={[3, 9, 1]} />
      <Lightformer form="rect" intensity={3} color="#dfe8ff" position={[-7, 2.2, -5]} scale={[1, 5, 1]} />
      <Lightformer form="rect" intensity={3} color="#dfe8ff" position={[7, 2.2, -5]} scale={[1, 5, 1]} />
      <Lightformer form="rect" intensity={2} position={[0, 2.6, 9]} scale={[14, 0.7, 1]} />
      <Lightformer form="rect" intensity={1.4} color="#ffb26b" position={[0, 0.8, -9]} scale={[10, 0.6, 1]} />
      <Lightformer form="ring" intensity={1.2} position={[-6, 3, 6]} scale={2.5} />
    </Environment>
  );
}

export default function StudioCanvas({ paint, wheel, active, onSelect, command, interactive, running, onReady }: Props) {
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  const handlePositions = useCallback((p: THREE.Vector3[]) => {
    setPositions(p);
    readyRef.current();
  }, []);
  const [quality, setQuality] = useState<"high" | "low">(() =>
    typeof window !== "undefined" && window.innerWidth >= 1024 ? "high" : "low"
  );

  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      camera={{ fov: 28, near: 0.1, far: 80, position: [4.6, 1.5, -6.4] }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ touchAction: interactive ? "none" : "pan-y" }}
      aria-hidden="true"
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 11, 26]} />
      <PerformanceMonitor onDecline={() => setQuality("low")} />
      <Suspense fallback={null}>
        <StudioLights />
        <Car paint={paint} wheel={wheel} onPositions={handlePositions} />
        <Markers positions={positions} active={active} onSelect={(id) => onSelect(id)} />
        <mesh rotation-x={-Math.PI / 2} position-y={-0.001}>
          <planeGeometry args={[60, 60]} />
          {quality === "high" ? (
            <MeshReflectorMaterial
              blur={[400, 120]}
              resolution={1024}
              mixBlur={1}
              mixStrength={14}
              roughness={0.85}
              depthScale={1.1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.3}
              color="#07080a"
              metalness={0.6}
              mirror={0.5}
            />
          ) : (
            <meshStandardMaterial color="#060708" roughness={0.45} metalness={0.3} />
          )}
        </mesh>
      </Suspense>
      <Rig command={command} active={active} interactive={interactive} />
    </Canvas>
  );
}

if (WRAPPED) useLoader.preload(WrappedGlbLoader, MODEL, withDraco);
else useGLTF.preload(MODEL, false, false, withDraco);
