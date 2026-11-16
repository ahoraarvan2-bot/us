import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { vehicles, getVehicle } from "@/content/vehicles";
import VehicleView, { vehicleMeta } from "@/views/VehicleView";
import { toMetadata } from "@/views/meta";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const v = getVehicle((await params).slug);
  return v ? toMetadata(vehicleMeta(v)) : { title: "Car not found" };
}

export default async function VehiclePage({ params }: Params) {
  const v = getVehicle((await params).slug);
  if (!v) notFound();
  return <VehicleView v={v} />;
}
