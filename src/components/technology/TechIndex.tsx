import Link from "next/link";
import { getVehicle } from "@/content/vehicles";

/**
 * Which cars in the collection use which technology. Only what appears in each
 * car's published specification here is listed; options are not.
 */
const index: { title: string; text: string; cars: string[] }[] = [
  {
    title: "Electrified powertrains",
    text: "Electric motors fill the gaps in an engine's delivery and recover energy under braking.",
    cars: ["porsche-911-turbo-s", "lamborghini-revuelto", "ferrari-296-gtb"],
  },
  {
    title: "All-wheel drive",
    text: "Power shared between both axles for traction off the line and in the wet.",
    cars: ["porsche-911-turbo-s", "lamborghini-revuelto", "mercedes-amg-gt-63", "bmw-m5-cs", "bmw-m4-competition"],
  },
  {
    title: "Carbon-ceramic brakes, standard",
    text: "Discs that resist fade and weigh less than iron.",
    cars: ["porsche-911-turbo-s", "ferrari-458-spider"],
  },
  {
    title: "Active aerodynamics",
    text: "Flaps and spoilers that move with speed and drive mode.",
    cars: ["porsche-911-turbo-s", "mercedes-amg-gt-63"],
  },
  {
    title: "Active anti-roll",
    text: "Hydraulics that hold the body flat, so the springs can stay softer.",
    cars: ["porsche-911-turbo-s", "mercedes-amg-gt-63"],
  },
  {
    title: "Rear-axle steering",
    text: "Rear wheels that steer a few degrees, for agility at low speed and stability at high speed.",
    cars: ["mercedes-amg-gt-63"],
  },
  {
    title: "Carbon-fibre construction",
    text: "From a full carbon monofuselage to carbon body panels that take weight out.",
    cars: ["lamborghini-revuelto", "bmw-m5-cs"],
  },
  {
    title: "Adaptive dampers",
    text: "Magnetorheological fluid that changes stiffness in milliseconds.",
    cars: ["ferrari-458-spider"],
  },
];

export function TechIndex() {
  return (
    <ul className="grid gap-px bg-gunmetal sm:grid-cols-2 lg:grid-cols-4">
      {index.map((t) => (
        <li key={t.title} className="flex flex-col bg-graphite p-6">
          <h3 className="wd-wide text-sm font-semibold text-platinum">{t.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-silver">{t.text}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5 pt-1">
            {t.cars.map((slug) => {
              const v = getVehicle(slug)!;
              return (
                <li key={slug}>
                  <Link href={`/collection/${slug}`} className="inline-block border border-gunmetal px-2.5 py-1 text-[0.6875rem] text-silver transition-colors hover:border-bronze hover:text-platinum">
                    {v.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
