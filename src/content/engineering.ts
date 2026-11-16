/**
 * Copy for the Performance page. Engineering explanations are general; every
 * claim about a specific car comes from src/content/vehicles.ts or from the
 * sources listed with it.
 */

export type CarFact = { slug: string; text: string };
export type Topic = {
  id: string;
  title: string;
  lead: string;
  body: string[];
  facts: CarFact[];
  sources?: { label: string; url: string }[];
};

export const topics: Topic[] = [
  {
    id: "engines",
    title: "Engine technology",
    lead: "Four routes to 500–1,000 PS: revs, turbocharging, electric assistance, or all three at once.",
    body: [
      "A naturally aspirated engine makes its power from displacement and revs. It answers the throttle instantly and sounds the part, but it has to spin fast to make big numbers.",
      "A turbocharger uses exhaust gas to force more air into the cylinders, so a smaller engine makes more power and far more torque low down. The cost has always been lag while the turbine spools up. Electric motors now close that gap.",
    ],
    facts: [
      { slug: "ferrari-458-spider", text: "4.5-litre F136 V8 without turbochargers: 570 PS at 9,000 rpm." },
      { slug: "lamborghini-revuelto", text: "A naturally aspirated 6.5-litre V12 with three electric motors, 1,015 CV combined." },
      { slug: "porsche-911-turbo-s", text: "A motor on each turbocharger shaft spins the compressor before exhaust gas arrives." },
      { slug: "ferrari-296-gtb", text: "120° V6 with the turbochargers inside the vee: 663 cv from 2,992 cc." },
      { slug: "mercedes-amg-gt-63", text: "4.0-litre biturbo V8, each one assembled by a single technician." },
    ],
  },
  {
    id: "power",
    title: "Horsepower",
    lead: "Power is the rate at which an engine does work. It decides top speed and how hard a car keeps pulling at high revs.",
    body: [
      "The SI unit is the kilowatt. European makers quote metric horsepower, written PS in Germany and CV in Italy, where 1 PS is 735.5 W. American figures use mechanical horsepower, 745.7 W, which is why the same engine reads slightly lower in hp than in PS.",
      "1 kW = 1.360 PS = 1.341 hp. Switch units below; hp figures are calculated from the manufacturer's kW.",
    ],
    facts: [],
  },
  {
    id: "torque",
    title: "Torque",
    lead: "Torque is twisting force at the crankshaft. Where it arrives in the rev range decides how a car feels on the road.",
    body: [
      "Turbocharged engines reach peak torque low down and hold it across a wide plateau, so the car surges from almost any speed. Naturally aspirated engines build towards a peak high in the rev range and reward being worked hard. Electric motors deliver their torque from standstill.",
      "The chart shows where each manufacturer quotes peak torque. A bar is a plateau; a single point is a peak at one engine speed.",
    ],
    facts: [],
  },
  {
    id: "acceleration",
    title: "Acceleration",
    lead: "0–100 km/h is a test of traction as much as power.",
    body: [
      "Below about 100 km/h most of these cars have more power than their tyres can use, so the quickest launches come from putting it down through four wheels and from electric torque that arrives before the engine is on boost.",
      "Press Launch to run all eight cars to 100 km/h in real time, using each manufacturer's figure.",
    ],
    facts: [
      { slug: "porsche-911-turbo-s", text: "2.5 s, with all-wheel drive and a hybrid gearbox." },
      { slug: "lamborghini-revuelto", text: "2.5 s, with two electric motors driving the front axle." },
    ],
  },
  {
    id: "aerodynamics",
    title: "Aerodynamics",
    lead: "At motorway speeds and above, air is the largest force on the car. Aerodynamic work trades drag, which slows it, against downforce, which presses it onto the road.",
    body: [
      "Fixed wings and diffusers make downforce all the time and pay for it in drag. Active elements change shape with speed and drive mode: closed and flat for efficiency on a motorway, deployed for grip under braking and in fast corners.",
    ],
    facts: [
      { slug: "porsche-911-turbo-s", text: "Active front flaps, an extending front spoiler and a reworked rear wing cut drag by up to 10% against the outgoing car." },
      { slug: "mercedes-amg-gt-63", text: "An AIRPANEL in the front apron and a multi-stage rear spoiler adjust with speed and drive mode." },
      { slug: "ferrari-458-spider", text: "Winglets in the front grille deform at speed, lowering drag without a motor or a hinge." },
    ],
  },
  {
    id: "suspension",
    title: "Suspension",
    lead: "A fast car has to stay flat, keep its tyres loaded and still ride a broken road.",
    body: [
      "Adaptive dampers change their stiffness in milliseconds. Active anti-roll systems push back against body roll, so the springs can stay softer for comfort. Rear-axle steering turns the rear wheels against the fronts at low speed, which feels like a shorter wheelbase, and with them at high speed, which feels like a longer, more stable one.",
    ],
    facts: [
      { slug: "porsche-911-turbo-s", text: "Electro-hydraulic Porsche Dynamic Chassis Control keeps the body flat in corners and is now standard." },
      { slug: "mercedes-amg-gt-63", text: "AMG ACTIVE RIDE CONTROL with active roll stabilisation, and rear-axle steering of up to 2.5°." },
      { slug: "ferrari-458-spider", text: "Magnetorheological adaptive dampers." },
    ],
  },
  {
    id: "braking",
    title: "Braking",
    lead: "Stopping from 300 km/h turns a car's speed into heat. Brakes that overheat lose that fight, which drivers feel as fade.",
    body: [
      "Carbon-ceramic discs keep working at temperatures that make iron discs fade, last longer and weigh less. Less weight at the wheel, unsprung mass, also lets the suspension follow the road more closely.",
      "Hybrids add a second brake: their electric motors can slow the car while recovering energy into the battery.",
    ],
    facts: [
      { slug: "porsche-911-turbo-s", text: "Carbon-ceramic brakes are standard." },
      { slug: "ferrari-458-spider", text: "Carbon-ceramic brakes are standard." },
      { slug: "ferrari-296-gtb", text: "The Qualify setting of the eManettino keeps energy recovery to a minimum for one flat-out lap." },
    ],
    sources: [{ label: "CarExpert — What makes the Ferrari 296 GTB so good", url: "https://www.carexpert.com.au/car-news/what-makes-the-ferrari-296-gtb-so-good" }],
  },
  {
    id: "modes",
    title: "Driving modes",
    lead: "One car, several characters. A drive mode retunes throttle, gearbox, steering, dampers and stability control together.",
    body: [
      "Hybrids add a second choice: how to use the battery. Some cars give each its own switch on the steering wheel.",
    ],
    facts: [],
    sources: [
      { label: "SlashGear — Lamborghini Revuelto: the best features", url: "https://www.slashgear.com/1260337/lamborghini-revuelto-best-features-2024-supercar-hybrid" },
      { label: "CarExpert — What makes the Ferrari 296 GTB so good", url: "https://www.carexpert.com.au/car-news/what-makes-the-ferrari-296-gtb-so-good" },
    ],
  },
];

export type ModeSet = {
  slug: string;
  control: string;
  groups: { label: string; modes: { name: string; text: string }[] }[];
};

/** Mode names as published; descriptions follow the cited sources. */
export const modeSets: ModeSet[] = [
  {
    slug: "lamborghini-revuelto",
    control: "Two rotary switches on the steering wheel, which can be combined freely",
    groups: [
      {
        label: "Handling",
        modes: [
          { name: "Città", text: "City driving" },
          { name: "Strada", text: "Road" },
          { name: "Sport", text: "Sharper responses" },
          { name: "Corsa", text: "Track" },
        ],
      },
      {
        label: "Powertrain",
        modes: [
          { name: "Recharge", text: "Charges the battery; supports electric town driving" },
          { name: "Hybrid", text: "Blends V12 and electric power" },
          { name: "Performance", text: "Blends both for maximum output" },
        ],
      },
    ],
  },
  {
    slug: "ferrari-296-gtb",
    control: "The eManettino selects how the hybrid system is used",
    groups: [
      {
        label: "eManettino",
        modes: [
          { name: "eDrive", text: "Electric only, engine off" },
          { name: "Hybrid", text: "Electric and combustion power blended for efficiency" },
          { name: "Performance", text: "Sustained performance, lap after lap" },
          { name: "Qualify", text: "Maximum output for one lap, minimal energy recovery" },
        ],
      },
    ],
  },
];
