/** Data for the interactive 3D study of the Ferrari 458 Spider. Car coordinates: front of the car faces −z. */

export type Vec3 = [number, number, number];

export type Hotspot = {
  id: string;
  title: string;
  text: string;
  spec: string;
  /** Fixed position in car space, or the name of a node to read the position from. */
  position: Vec3;
  node?: string;
  offset?: Vec3;
  /** Direction the hotspot faces; it hides when the camera is behind it. */
  normal: Vec3;
  view: { pos: Vec3; target: Vec3 };
};

export const hotspots: Hotspot[] = [
  {
    id: "engine",
    title: "4.5-litre V8",
    text: "The naturally aspirated F136 V8 sits behind the cabin and revs to 9,000 rpm, where it makes its 570 PS.",
    spec: "570 PS at 9,000 rpm",
    position: [0, 1.0, 1.4],
    normal: [0, 1, 0.35],
    view: { pos: [3.1, 3.2, 5.0], target: [0, 0.8, 1.2] },
  },
  {
    id: "brakes",
    title: "Carbon-ceramic brakes",
    text: "Fitted as standard. They shrug off heat on track and weigh less than iron discs, which the suspension feels as less unsprung mass.",
    spec: "Standard fitment",
    position: [0.95, 0.36, -1.155],
    node: "wheel_fr",
    offset: [0.12, 0, 0],
    normal: [1, 0, -0.2],
    view: { pos: [3.4, 0.75, -2.6], target: [0.8, 0.38, -1.15] },
  },
  {
    id: "aero",
    title: "Flexing front winglets",
    text: "Small winglets in the front grille deform at speed. They lower drag without a single motor or hinge.",
    spec: "Passive aerodynamics",
    position: [0.42, 0.3, -2.52],
    normal: [0, 0, -1],
    view: { pos: [1.7, 0.8, -5.6], target: [0.15, 0.4, -2.3] },
  },
  {
    id: "roof",
    title: "Folding aluminium hardtop",
    text: "The roof stows above the engine in 14 seconds. It was a first for a mid-engined Ferrari.",
    spec: "14 seconds",
    position: [0.42, 1.12, 0.3],
    normal: [0.2, 1, 0.1],
    view: { pos: [-3.6, 3.4, 3.3], target: [0, 0.9, 0.3] },
  },
  {
    id: "gearbox",
    title: "Seven-speed dual-clutch",
    text: "A Getrag dual-clutch gearbox behind the engine changes gear without interrupting drive to the rear wheels.",
    spec: "7 speeds, rear-wheel drive",
    position: [0, 0.48, 2.45],
    normal: [0, 0, 1],
    view: { pos: [-2.4, 1.3, 6.0], target: [0, 0.55, 1.9] },
  },
  {
    id: "cabin",
    title: "Steering-wheel controls",
    text: "Indicators, wipers, lights and the manettino drive-mode switch all live on the steering wheel.",
    spec: "Manettino",
    position: [-0.37, 0.95, -0.3],
    node: "steering_wheel",
    offset: [0, 0.12, 0],
    normal: [0, 1, 0.2],
    view: { pos: [-1.8, 3.0, 1.6], target: [-0.3, 0.8, -0.3] },
  },
];

export type Paint = { name: string; color: string; finish: "solid" | "metallic" };

export const studioPaints: Paint[] = [
  { name: "ONYX Graphite", color: "#363b42", finish: "metallic" },
  { name: "Rosso Corsa", color: "#a5111a", finish: "solid" },
  { name: "Giallo Modena", color: "#efc21a", finish: "solid" },
  { name: "Grigio Silverstone", color: "#4d5155", finish: "metallic" },
  { name: "Nero Daytona", color: "#0d0e10", finish: "metallic" },
  { name: "Bianco Avus", color: "#ecebe6", finish: "solid" },
];

export const studioWheels = [
  { name: "Bronze", color: "#9c7a4a" },
  { name: "Silver", color: "#c3c5c8" },
  { name: "Black", color: "#1b1c1e" },
];

export const studioViews: Record<string, { label: string; pos: Vec3; target: Vec3 }> = {
  front: { label: "Front", pos: [4.6, 1.5, -6.4], target: [0, 0.55, -0.2] },
  side: { label: "Side", pos: [8.2, 1.1, 0], target: [0, 0.55, 0] },
  rear: { label: "Rear", pos: [-4.4, 1.6, 6.4], target: [0, 0.6, 0.3] },
  above: { label: "Above", pos: [0.01, 9.5, 0.6], target: [0, 0.4, 0] },
};
