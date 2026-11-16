// Removes manufacturer badges from the Ferrari 458 Spider model and writes a
// de-badged copy. Usage: node debadge.mjs in.glb out.glb [--draco]
//
// Badge geometry was located by connected-component analysis (analyze.mjs).
// Coordinates below are in each mesh node's local space.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from "@gltf-transform/extensions";
import { dedup, prune, quantize, weld } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";

const [, , input, output, ...flags] = process.argv;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule(),
});
const doc = await io.read(input);
const root = doc.getRoot();

function components(prim) {
  const pos = prim.getAttribute("POSITION");
  const idx = prim.getIndices();
  const nV = pos.getCount();
  const parent = Int32Array.from({ length: nV }, (_, i) => i);
  const find = (a) => {
    while (parent[a] !== a) {
      parent[a] = parent[parent[a]];
      a = parent[a];
    }
    return a;
  };
  const union = (a, b) => {
    a = find(a);
    b = find(b);
    if (a !== b) parent[a] = b;
  };
  const seen = new Map();
  const p = [0, 0, 0];
  for (let i = 0; i < nV; i++) {
    pos.getElement(i, p);
    const k = p.map((v) => Math.round(v * 2000)).join(",");
    if (seen.has(k)) union(i, seen.get(k));
    else seen.set(k, i);
  }
  const triCount = idx.getCount() / 3;
  for (let t = 0; t < triCount; t++) {
    union(idx.getScalar(t * 3), idx.getScalar(t * 3 + 1));
    union(idx.getScalar(t * 3 + 1), idx.getScalar(t * 3 + 2));
  }
  const comps = new Map();
  for (let t = 0; t < triCount; t++) {
    const r = find(idx.getScalar(t * 3));
    let c = comps.get(r);
    if (!c) comps.set(r, (c = { tris: [], min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9] }));
    c.tris.push(t);
    for (let j = 0; j < 3; j++) {
      pos.getElement(idx.getScalar(t * 3 + j), p);
      for (let k = 0; k < 3; k++) {
        c.min[k] = Math.min(c.min[k], p[k]);
        c.max[k] = Math.max(c.max[k], p[k]);
      }
    }
  }
  return [...comps.values()].map((c) => ({ ...c, ctr: c.min.map((v, k) => (v + c.max[k]) / 2) }));
}

function dropTriangles(prim, predicate, label) {
  const idx = prim.getIndices();
  const comps = components(prim);
  const drop = new Set();
  let n = 0;
  for (const c of comps) {
    if (predicate(c)) {
      c.tris.forEach((t) => drop.add(t));
      n++;
    }
  }
  const keep = [];
  const triCount = idx.getCount() / 3;
  for (let t = 0; t < triCount; t++) if (!drop.has(t)) keep.push(idx.getScalar(t * 3), idx.getScalar(t * 3 + 1), idx.getScalar(t * 3 + 2));
  const Arr = idx.getArray().constructor;
  idx.setArray(new Arr(keep));
  console.log(`${label}: removed ${n} components, ${drop.size} triangles (kept ${keep.length / 3})`);
}

function dropSingleTriangles(prim, centre, radius, label) {
  const pos = prim.getAttribute("POSITION");
  const idx = prim.getIndices();
  const p = [0, 0, 0];
  const keep = [];
  let removed = 0;
  for (let t = 0; t < idx.getCount() / 3; t++) {
    const tri = [idx.getScalar(t * 3), idx.getScalar(t * 3 + 1), idx.getScalar(t * 3 + 2)];
    const c = [0, 0, 0];
    for (const v of tri) {
      pos.getElement(v, p);
      for (let k = 0; k < 3; k++) c[k] += p[k] / 3;
    }
    if (Math.hypot(c[0] - centre[0], c[1] - centre[1], c[2] - centre[2]) < radius) removed++;
    else keep.push(...tri);
  }
  const Arr = idx.getArray().constructor;
  idx.setArray(new Arr(keep));
  console.log(`${label}: removed ${removed} triangles`);
}

const near = (c, p, tol = 0.02) => c.ctr.every((v, k) => Math.abs(v - p[k]) < tol);
const within = (c, [x0, x1], [ay0, ay1], [z0, z1]) =>
  c.ctr[0] >= x0 && c.ctr[0] <= x1 && Math.abs(c.ctr[1]) >= ay0 && Math.abs(c.ctr[1]) <= ay1 && c.ctr[2] >= z0 && c.ctr[2] <= z1;

const darkCap = doc
  .createMaterial("Cap_Graphite")
  .setBaseColorFactor([0.045, 0.047, 0.052, 1])
  .setMetallicFactor(0.85)
  .setRoughnessFactor(0.38);

for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const name = node.getName();
  for (const prim of mesh.listPrimitives()) {
    if (name === "chrome") {
      dropTriangles(
        prim,
        (c) =>
          near(c, [-2.231, -0.001, -0.394]) || // prancing horse, front grille
          near(c, [2.155, 0.002, 0.157]) || // prancing horse, rear
          near(c, [-2.128, -0.004, -0.097]) || // bonnet badge surround
          within(c, [1.84, 1.91], [0, 0.12], [0.18, 0.28]) || // rear script lettering
          within(c, [0.83, 0.94], [0.9, 0.95], [-0.32, -0.29]), // side script badges
        "chrome badges"
      );
    } else if (name === "yellow_trim") {
      // keep only the rev-counter face (largest piece); drop wing shields and bonnet shield
      const comps = components(prim).sort((a, b) => b.tris.length - a.tris.length);
      const keepRoot = comps[0];
      dropTriangles(prim, (c) => c.tris.length !== keepRoot.tris.length || c.ctr[0] !== keepRoot.ctr[0], "yellow shields");
    } else if (name === "interior_dark") {
      // mount of the grille badge
      dropTriangles(prim, (c) => near(c, [-2.176, -0.005, -0.394]), "grille badge mount");
      // flat backing plate of the bonnet badge (shares vertices with other parts, so match single triangles)
      dropSingleTriangles(prim, [-2.098, -0.004, -0.127], 0.035, "bonnet badge plate");
    } else if (name === "centre" || name === "steering_centre") {
      prim.setMaterial(darkCap);
    }
  }
}

await doc.transform(prune(), dedup());
if (flags.includes("--draco")) {
  doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
    method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
    encodeSpeed: 5,
    decodeSpeed: 5,
  });
} else {
  // Plain glTF with KHR_mesh_quantization: no decoder (and no WebAssembly) needed to load it.
  doc.createExtension(KHRDracoMeshCompression).dispose();
  for (const ext of root.listExtensionsUsed()) if (ext.extensionName === "KHR_draco_mesh_compression") ext.dispose();
  await doc.transform(weld(), quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
}
await io.write(output, doc);
console.log("wrote", output);
