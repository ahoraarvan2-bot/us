/**
 * Hero film scenes. Each scene is rendered by ONYX from the Ferrari 458 Spider
 * 3D model and ships with the project (public/films), so the hero never depends
 * on a third-party video host. To add licensed live-action footage, drop the
 * files into public/films and add a scene here.
 */
import { asset } from "@/lib/asset";

export type FilmScene = {
  id: string;
  title: string;
  caption: string;
  mp4: { hd: string; sd: string };
  poster: string;
};

export const heroScenes: FilmScene[] = [
  {
    id: "tunnel",
    title: "Tunnel run",
    caption: "Ferrari 458 Spider in graphite, bronze forged wheels",
    mp4: { hd: asset("/films/tunnel-1080.mp4"), sd: asset("/films/tunnel-720.mp4") },
    poster: asset("/films/tunnel-poster.jpg"),
  },
  {
    id: "studio",
    title: "Light sweep",
    caption: "Ferrari 458 Spider in argento under a moving softbox",
    mp4: { hd: asset("/films/studio-1080.mp4"), sd: asset("/films/studio-720.mp4") },
    poster: asset("/films/studio-poster.jpg"),
  },
  {
    id: "detail",
    title: "Front wheel",
    caption: "Ferrari 458 Spider, the front wheel at speed",
    mp4: { hd: asset("/films/detail-1080.mp4"), sd: asset("/films/detail-720.mp4") },
    poster: asset("/films/detail-poster.jpg"),
  },
];
