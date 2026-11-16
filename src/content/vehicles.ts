/**
 * The collection.
 *
 * Every figure below comes from the manufacturer or a published source listed
 * in `sources` (checked November 2026). Where a figure could not be verified it
 * is left out rather than estimated. Configuration options are an indicative
 * selection unless `config.verified` is true, and are labelled as such on the site.
 */

export type Option = { name: string; swatch: string; note?: string };

export type Price =
  | { kind: "msrp"; amount: number; currency: "USD"; label: string; note?: string }
  | { kind: "poa"; label: string; note?: string };

export type Vehicle = {
  slug: string;
  make: string;
  model: string;
  name: string;
  variant: string;
  year: string;
  status: "current" | "limited" | "heritage";
  powertrain: "Hybrid" | "Combustion";
  layout: "Mid-engine" | "Front-engine" | "Rear-engine";
  tagline: string;
  intro: string;
  description: string[];
  engine: string;
  specs: {
    powerKw: number;
    powerPs: number;
    powerRpm?: string;
    powerNote?: string;
    torqueNm: number;
    torqueRpm?: string;
    torqueNote?: string;
    zeroTo100: number;
    zeroTo200?: string;
    topSpeedKmh: number;
    topSpeedNote?: "over" | "limited";
    topSpeedExtra?: string;
    transmission: string;
    drive: string;
    weightKg?: number;
    weightNote?: string;
    lengthMm?: number;
    widthMm?: number;
    heightMm?: number;
    wheelbaseMm?: number;
    battery?: string;
    tyres?: string;
    brakes?: string;
    other?: { label: string; value: string }[];
  };
  highlights: { title: string; text: string }[];
  price: Price;
  config: { verified: boolean; note: string; paints: Option[]; wheels: Option[]; interiors: Option[] };
  media: { hero: string; exterior: string[]; interior: string[]; detail: string[] };
  accent: string;
  sources: { label: string; url: string }[];
};

export const vehicles: Vehicle[] = [
  {
    slug: "porsche-911-turbo-s",
    make: "Porsche",
    model: "911 Turbo S",
    name: "Porsche 911 Turbo S",
    variant: "Coupé, 992.2 generation",
    year: "2026",
    status: "current",
    powertrain: "Hybrid",
    layout: "Rear-engine",
    tagline: "The everyday hypercar, electrified.",
    intro:
      "The most powerful production 911 to date pairs a 3.6-litre flat-six with two electric turbochargers and a motor inside the PDK gearbox.",
    description: [
      "For the 992.2 generation Porsche gave the Turbo S the T-Hybrid system first seen in the Carrera GTS. Each exhaust turbocharger carries its own electric motor, so boost arrives before the exhaust has had time to build, and a further motor in the eight-speed PDK fills the gaps in between.",
      "The result is 523 kW and 800 Nm delivered with the composure that made the Turbo S the all-weather supercar of choice. Electro-hydraulic dynamic chassis control is standard, and active aerodynamics trim drag by up to ten per cent against the previous car.",
      "On the Nürburgring Nordschleife the new car lapped in 7:03.92, around fourteen seconds quicker than its predecessor.",
    ],
    engine: "3.6-litre flat-six, twin electric turbochargers (T-Hybrid)",
    specs: {
      powerKw: 523,
      powerPs: 711,
      powerRpm: "6,500–7,000 rpm",
      torqueNm: 800,
      torqueRpm: "2,300–6,000 rpm",
      zeroTo100: 2.5,
      zeroTo200: "8.4 s",
      topSpeedKmh: 322,
      transmission: "8-speed PDK with integrated electric motor",
      drive: "All-wheel drive",
      weightKg: 1737,
      weightNote: "US curb weight (3,829 lb)",
      battery: "1.9 kWh, 400 V",
      tyres: "255/35 ZR20 front, 325/30 ZR21 rear",
      brakes: "Carbon-ceramic, standard",
      other: [{ label: "Nürburgring Nordschleife", value: "7:03.92" }],
    },
    highlights: [
      { title: "Electric turbochargers", text: "A motor on each turbo shaft spins the compressor before exhaust gas arrives, removing lag at any engine speed." },
      { title: "Active aerodynamics", text: "Active front flaps, an extending front spoiler and a reworked rear wing cut drag by up to 10% versus the outgoing Turbo S." },
      { title: "ehPDCC", text: "Electro-hydraulic Porsche Dynamic Chassis Control keeps the body flat in corners and is now standard." },
    ],
    price: {
      kind: "msrp",
      amount: 270300,
      currency: "USD",
      label: "US MSRP, 2026 model year coupé",
      note: "Excludes the $2,350 destination charge, options and local taxes.",
    },
    config: {
      verified: false,
      note: "Indicative selection from the manufacturer's palette. Availability varies by market and model year.",
      paints: [
        { name: "GT Silver Metallic", swatch: "#a7abb0" },
        { name: "Jet Black Metallic", swatch: "#121417" },
        { name: "Carrara White Metallic", swatch: "#e9e8e3" },
        { name: "Gentian Blue Metallic", swatch: "#1c2f5c" },
        { name: "Shade Green Metallic", swatch: "#3b4a3f" },
      ],
      wheels: [
        { name: "Turbo forged wheels, Turbonite", swatch: "#6f6a63" },
        { name: "Forged spoke wheels, satin platinum", swatch: "#b7b9bb" },
        { name: "Forged spoke wheels, gloss black", swatch: "#1a1a1c" },
      ],
      interiors: [
        { name: "Black leather, Turbonite accents", swatch: "#1b1b1d" },
        { name: "Black and Bordeaux Red", swatch: "#5a1622" },
        { name: "Slate Grey and Chalk", swatch: "#8d8a84" },
      ],
    },
    media: {
      hero: "u-911-turbo-s-akabane",
      exterior: ["u-911-turbo-s-akabane"],
      interior: ["p-turbo-s-gauge-aerts"],
      detail: ["p-porsche-wheel-vineeth"],
    },
    accent: "#b7b9bb",
    sources: [
      { label: "Jalopnik — 2026 Porsche 911 Turbo S reveal (specs, US pricing)", url: "https://jalopnik.com/1960268/2026-porsche-911-turbo-s-hybrid-reveal-specs-performance" },
    ],
  },
  {
    slug: "lamborghini-revuelto",
    make: "Lamborghini",
    model: "Revuelto",
    name: "Lamborghini Revuelto",
    variant: "LB744",
    year: "2026",
    status: "current",
    powertrain: "Hybrid",
    layout: "Mid-engine",
    tagline: "A naturally aspirated V12, with three electric motors for company.",
    intro:
      "Lamborghini's first V12 plug-in hybrid combines a high-revving 6.5-litre engine with three electric motors for 1,015 CV.",
    description: [
      "The Revuelto keeps the thing Lamborghini owners care about most, a naturally aspirated V12, and surrounds it with electrification. Two axial-flux motors drive the front wheels, a third sits above the new eight-speed dual-clutch gearbox, and together they give the car all-wheel drive, electric torque vectoring and a fully electric mode.",
      "The structure is carbon fibre almost everywhere, from the monofuselage to most of the bodywork. Lamborghini quotes a weight-to-power ratio of 1.75 kg per CV, the best in the company's history.",
      "Allocations are made through the manufacturer's network. ONYX sources specified and delivery-mileage examples on request.",
    ],
    engine: "6.5-litre V12, naturally aspirated, plus three electric motors",
    specs: {
      powerKw: 747,
      powerPs: 1015,
      powerNote: "Combined output, V12 and three electric motors",
      torqueNm: 725,
      torqueNote: "V12 alone",
      torqueRpm: "6,750 rpm",
      zeroTo100: 2.5,
      zeroTo200: "under 7.0 s",
      topSpeedKmh: 350,
      topSpeedNote: "over",
      transmission: "8-speed dual-clutch, transverse",
      drive: "All-wheel drive with electric torque vectoring",
      battery: "Lithium-ion, 4,500 W/kg specific power",
      other: [
        { label: "Weight-to-power", value: "1.75 kg/CV" },
        { label: "Structure", value: "Carbon-fibre monofuselage" },
      ],
    },
    highlights: [
      { title: "Three electric motors", text: "Two axial-flux motors on the front axle and one above the gearbox add all-wheel drive and torque vectoring." },
      { title: "New dual-clutch gearbox", text: "The eight-speed unit sits transversely behind the V12, freeing space for the battery in the central tunnel." },
      { title: "Carbon structure", text: "A carbon-fibre monofuselage and frame keep the hybrid's mass in check." },
    ],
    price: {
      kind: "poa",
      label: "Price on application",
      note: "The Revuelto is allocated through Lamborghini's network. We quote on the specification and delivery date you need.",
    },
    config: {
      verified: false,
      note: "Indicative selection from the manufacturer's palette. Ad Personam colours are also available.",
      paints: [
        { name: "Arancio Borealis", swatch: "#e2591b" },
        { name: "Giallo Orion", swatch: "#e6b21a" },
        { name: "Blu Cepheus", swatch: "#1b3f8f" },
        { name: "Grigio Telesto", swatch: "#5e6166" },
        { name: "Nero Noctis", swatch: "#0d0d0f" },
      ],
      wheels: [
        { name: "Forged wheels, gloss black", swatch: "#141416" },
        { name: "Forged wheels, titanium", swatch: "#7d7f82" },
        { name: "Forged wheels, diamond cut", swatch: "#c9cbcd" },
      ],
      interiors: [
        { name: "Nero Ade with contrast stitching", swatch: "#151517" },
        { name: "Rosso Alala and Nero Ade", swatch: "#8c1a1f" },
        { name: "Bianco Leda", swatch: "#e8e4dc" },
      ],
    },
    media: {
      hero: "p-revuelto-yellow-hambiria",
      exterior: ["p-revuelto-red-lokhande", "p-revuelto-yellow-indoor-hambiria"],
      interior: ["p-seat-orange-rzgar"],
      detail: ["p-lambo-badge-rzgar", "p-engine-orange-martinez"],
    },
    accent: "#e6b21a",
    sources: [
      { label: "Ultimatecarpage — Lamborghini Revuelto (LB744) specifications", url: "https://www.ultimatecarpage.com/car/8455/Lamborghini-LB744.html" },
    ],
  },
  {
    slug: "ferrari-296-gtb",
    make: "Ferrari",
    model: "296 GTB",
    name: "Ferrari 296 GTB",
    variant: "Berlinetta",
    year: "2026",
    status: "current",
    powertrain: "Hybrid",
    layout: "Mid-engine",
    tagline: "Six cylinders, 830 cv, and a 25 km electric range.",
    intro:
      "Ferrari's plug-in hybrid berlinetta pairs a 120-degree twin-turbo V6 with an electric motor between engine and gearbox.",
    description: [
      "The 296 GTB put a V6 back in a road-going Ferrari for the first time since the Dino. The 2,992 cc engine has its turbochargers inside the 120-degree vee, which keeps it compact and low, and on its own it produces 663 cv.",
      "An electric motor between the engine and the eight-speed F1 gearbox adds 167 cv for a combined 830 cv, and a 7.45 kWh battery lets the car cover short distances in silence in eDrive mode.",
      "At 4,565 mm long and on a 2,600 mm wheelbase, it is a compact car by modern supercar standards, and drives like one.",
    ],
    engine: "3.0-litre 120° V6, twin-turbo, plug-in hybrid",
    specs: {
      powerKw: 610,
      powerPs: 830,
      powerRpm: "8,000 rpm",
      powerNote: "Combined. V6 663 cv, electric motor 167 cv",
      torqueNm: 740,
      torqueRpm: "6,250 rpm",
      zeroTo100: 2.9,
      zeroTo200: "7.3 s",
      topSpeedKmh: 330,
      topSpeedNote: "over",
      transmission: "8-speed F1 dual-clutch",
      drive: "Rear-wheel drive",
      weightKg: 1470,
      weightNote: "Dry, with lightweight options",
      lengthMm: 4565,
      widthMm: 1958,
      heightMm: 1187,
      wheelbaseMm: 2600,
      battery: "7.45 kWh, plug-in",
      tyres: "245/35 ZR20 front, 305/35 ZR20 rear",
      other: [{ label: "Electric-only range", value: "25 km (manufacturer)" }],
    },
    highlights: [
      { title: "120° V6", text: "Turbochargers sit inside the wide vee, lowering the centre of gravity and shortening the exhaust path." },
      { title: "Plug-in hybrid", text: "A motor between engine and gearbox adds 167 cv and allows electric-only running in eDrive mode." },
      { title: "Compact proportions", text: "A 2,600 mm wheelbase makes the 296 GTB one of the most agile cars in the current Ferrari range." },
    ],
    price: {
      kind: "msrp",
      amount: 338250,
      currency: "USD",
      label: "US starting price, 2026 model year",
      note: "Before options, destination and local taxes.",
    },
    config: {
      verified: false,
      note: "Indicative selection from the manufacturer's palette. Tailor Made colours are also available.",
      paints: [
        { name: "Rosso Imola", swatch: "#b3121d" },
        { name: "Giallo Modena", swatch: "#f0c419" },
        { name: "Blu Corsa", swatch: "#1d3a8a" },
        { name: "Argento Nürburgring", swatch: "#9fa3a8" },
        { name: "Nero Daytona", swatch: "#0e0f12" },
      ],
      wheels: [
        { name: "20-inch forged, diamond finish", swatch: "#c8cacc" },
        { name: "20-inch forged, Grigio Corsa", swatch: "#4c4e52" },
        { name: "20-inch forged, matte black", swatch: "#18181a" },
      ],
      interiors: [
        { name: "Nero leather", swatch: "#121214" },
        { name: "Cuoio leather", swatch: "#7a4a2a" },
        { name: "Rosso leather", swatch: "#8e1b1f" },
      ],
    },
    media: {
      hero: "p-296-red-brick",
      exterior: ["p-296-blue", "p-296-red-show-shalimova"],
      interior: [],
      detail: [],
    },
    accent: "#b3121d",
    sources: [
      { label: "Autocar India — Ferrari 296 GTB specifications", url: "https://www.autocarindia.com/cars/ferrari/296-gtb/specifications" },
      { label: "Wikipedia — Ferrari 296", url: "https://en.wikipedia.org/wiki/Ferrari_296" },
      { label: "Kelley Blue Book — 2026 Ferrari 296 GTB (US price)", url: "https://www.kbb.com/ferrari/296-gtb/2026/" },
    ],
  },
  {
    slug: "aston-martin-db12",
    make: "Aston Martin",
    model: "DB12",
    name: "Aston Martin DB12",
    variant: "Coupé",
    year: "2026",
    status: "current",
    powertrain: "Combustion",
    layout: "Front-engine",
    tagline: "The super tourer, with 800 Nm under the bonnet.",
    intro:
      "A 4.0-litre twin-turbo V8 sits behind the front axle of Aston Martin's grand tourer, sending 680 PS to the rear wheels.",
    description: [
      "The DB12 is Aston Martin's answer to the question of how fast a genuine grand tourer should be. Its 4.0-litre twin-turbo V8 makes 680 PS and 800 Nm, enough for 325 km/h, and drives the rear wheels through an eight-speed ZF automatic.",
      "It is a long-distance car first. A 2,805 mm wheelbase, a cabin finished in leather and real metal, and a ride tuned for a continent rather than a lap make it the most complete DB to date.",
    ],
    engine: "4.0-litre V8, twin-turbo",
    specs: {
      powerKw: 500,
      powerPs: 680,
      powerRpm: "6,000 rpm",
      torqueNm: 800,
      torqueRpm: "from 2,750 rpm",
      zeroTo100: 3.6,
      topSpeedKmh: 325,
      transmission: "8-speed ZF automatic (8HP75)",
      drive: "Rear-wheel drive",
      weightKg: 1685,
      weightNote: "Kerb",
      lengthMm: 4725,
      widthMm: 1980,
      heightMm: 1295,
      wheelbaseMm: 2805,
    },
    highlights: [
      { title: "Twin-turbo V8", text: "680 PS and 800 Nm from 4.0 litres, sent to the rear wheels through an eight-speed automatic." },
      { title: "Grand touring", text: "A long wheelbase and an automatic gearbox put comfort over distance first." },
      { title: "DB12 S", text: "From October 2025 a DB12 S joined the range with 700 PS. Ask us about availability." },
    ],
    price: {
      kind: "msrp",
      amount: 262000,
      currency: "USD",
      label: "US starting MSRP, 2026 model year coupé",
      note: "Before options, destination and local taxes.",
    },
    config: {
      verified: false,
      note: "Indicative selection. Q by Aston Martin offers bespoke colours and trims.",
      paints: [
        { name: "Iridescent Emerald", swatch: "#2f5a46" },
        { name: "Magnetic Silver", swatch: "#8f949a" },
        { name: "Onyx Black", swatch: "#0c0c0e" },
        { name: "Ultramarine Black", swatch: "#151a2b" },
        { name: "Lunar White", swatch: "#e7e6e1" },
      ],
      wheels: [
        { name: "21-inch forged, satin black", swatch: "#1b1b1d" },
        { name: "21-inch forged, satin silver", swatch: "#aeb1b4" },
        { name: "21-inch forged, gloss bronze", swatch: "#7a5a37" },
      ],
      interiors: [
        { name: "Obsidian Black", swatch: "#111113" },
        { name: "Obsidian Black and Chancellor Red", swatch: "#6e1b1e" },
        { name: "Ivory and Obsidian Black", swatch: "#d9d0c0" },
      ],
    },
    media: {
      hero: "c-db12-1921",
      exterior: ["c-db12-1922"],
      interior: ["p-seat-red-stitch-spencer"],
      detail: [],
    },
    accent: "#2f5a46",
    sources: [
      { label: "Wikipedia — Aston Martin DB12", url: "https://en.wikipedia.org/wiki/Aston_Martin_DB12" },
      { label: "Cars.com — 2026 Aston Martin DB12 specifications (US price)", url: "https://www.cars.com/research/aston_martin-db12-2026/specs" },
      { label: "Cars-data — DB12 4.0 V8 Coupé", url: "https://cars-data.com/en/aston-martin/db12/2024-coupe/4-0-v8-coupe--110023" },
    ],
  },
  {
    slug: "mercedes-amg-gt-63",
    make: "Mercedes-AMG",
    model: "GT 63 4MATIC+ Coupé",
    name: "Mercedes-AMG GT 63",
    variant: "4MATIC+ Coupé, C192 generation",
    year: "2026",
    status: "current",
    powertrain: "Combustion",
    layout: "Front-engine",
    tagline: "A hand-built V8, now with all-wheel drive and room for two more.",
    intro:
      "The second-generation AMG GT gains all-wheel drive, rear-axle steering and an optional 2+2 cabin around its hand-built 4.0-litre V8.",
    description: [
      "Every AMG V8 is assembled by one technician in Affalterbach, and the GT 63's 4.0-litre biturbo produces 430 kW and 800 Nm. For this generation the power reaches the road through AMG Performance 4MATIC+ all-wheel drive and a nine-speed MCT gearbox.",
      "Active rear-axle steering of up to 2.5 degrees, AMG ACTIVE RIDE CONTROL with active roll stabilisation and active aerodynamics, including an AIRPANEL in the front apron and a multi-stage rear spoiler, make it both a cross-country car and a track car.",
    ],
    engine: "4.0-litre V8 biturbo, hand-built",
    specs: {
      powerKw: 430,
      powerPs: 585,
      powerRpm: "5,500–6,500 rpm",
      torqueNm: 800,
      torqueRpm: "2,500–5,000 rpm",
      zeroTo100: 3.2,
      topSpeedKmh: 315,
      transmission: "AMG SPEEDSHIFT MCT 9-speed",
      drive: "AMG Performance 4MATIC+ all-wheel drive",
      other: [
        { label: "Rear-axle steering", value: "Up to 2.5°" },
        { label: "Seating", value: "2 seats, 2+2 optional" },
      ],
    },
    highlights: [
      { title: "One man, one engine", text: "Each 4.0-litre V8 is built by a single technician, whose signature is on the engine plate." },
      { title: "Active chassis", text: "AMG ACTIVE RIDE CONTROL with active roll stabilisation and rear-axle steering of up to 2.5°." },
      { title: "Active aero", text: "An AIRPANEL in the front apron and a multi-stage rear spoiler adjust with speed and drive mode." },
    ],
    price: {
      kind: "msrp",
      amount: 184000,
      currency: "USD",
      label: "US starting MSRP, AMG GT 63 Coupé",
      note: "Before options, destination and local taxes.",
    },
    config: {
      verified: false,
      note: "Indicative selection from the manufacturer's palette, including MANUFAKTUR finishes.",
      paints: [
        { name: "MANUFAKTUR Alpine Grey solid", swatch: "#8e9294" },
        { name: "Obsidian Black metallic", swatch: "#0f1012" },
        { name: "High-Tech Silver metallic", swatch: "#a4a8ad" },
        { name: "Spectral Blue metallic", swatch: "#20325a" },
        { name: "Jupiter Red", swatch: "#9e1a1c" },
      ],
      wheels: [
        { name: "AMG forged cross-spoke, matte black", swatch: "#161618" },
        { name: "AMG forged 10-spoke, titanium grey", swatch: "#5d5f62" },
        { name: "AMG 5-twin-spoke, high-sheen", swatch: "#c4c6c8" },
      ],
      interiors: [
        { name: "Black Nappa", swatch: "#121214" },
        { name: "Red Pepper and Black Nappa", swatch: "#7b1f1d" },
        { name: "Macchiato Beige and Black Nappa", swatch: "#c9b79b" },
      ],
    },
    media: {
      hero: "c-amg-c192",
      exterior: [],
      interior: [],
      detail: [],
    },
    accent: "#8e9294",
    sources: [{ label: "Mercedes-Benz USA — AMG GT 63 Coupe", url: "https://mbusa.com/en/vehicles/model/gt/coupe/amggt63" }],
  },
  {
    slug: "bmw-m5-cs",
    make: "BMW",
    model: "M5 CS",
    name: "BMW M5 CS",
    variant: "F90 generation, limited series",
    year: "2021–2022",
    status: "limited",
    powertrain: "Combustion",
    layout: "Front-engine",
    tagline: "The most powerful BMW M car of its day, in a four-door suit.",
    intro:
      "A lighter, sharper and more powerful M5 with four carbon bucket seats, built in limited numbers for 2021 and 2022.",
    description: [
      "When BMW M launched the M5 CS in January 2021 it was the most powerful production M car the company had built. The 4.4-litre twin-turbo V8 makes 635 hp and 750 Nm, and M xDrive sends it to all four wheels through an eight-speed M Steptronic gearbox.",
      "BMW took close to 70 kg out of the M5 Competition with carbon fibre for the bonnet, mirror caps, diffuser and engine cover, and fitted four individual M Carbon bucket seats. Gold Bronze accents mark it out from any other M5.",
      "Production has ended. ONYX sources low-mileage examples with documented history.",
    ],
    engine: "4.4-litre V8, M TwinPower Turbo",
    specs: {
      powerKw: 467,
      powerPs: 635,
      powerRpm: "6,000 rpm",
      torqueNm: 750,
      torqueRpm: "1,800–5,950 rpm",
      zeroTo100: 3.0,
      zeroTo200: "10.4 s",
      topSpeedKmh: 305,
      topSpeedNote: "limited",
      transmission: "8-speed M Steptronic with Drivelogic",
      drive: "M xDrive all-wheel drive",
      weightNote: "About 70 kg lighter than the M5 Competition",
      other: [
        { label: "Seats", value: "Four M Carbon bucket seats" },
        { label: "Redline", value: "7,200 rpm" },
      ],
    },
    highlights: [
      { title: "635 hp V8", text: "The most powerful engine in an M car at launch, with peak torque from 1,800 rpm." },
      { title: "Carbon diet", text: "Carbon bonnet, mirror caps, rear diffuser and engine cover save close to 70 kg." },
      { title: "Four bucket seats", text: "Individual M Carbon seats front and rear, trimmed in Merino leather with Mugello Red." },
    ],
    price: {
      kind: "poa",
      label: "Price on application",
      note: "No longer built. Original list price €241,415 on the road (Ireland, 2021).",
    },
    config: {
      verified: true,
      note: "Original factory specification, as listed in BMW's launch press release.",
      paints: [
        { name: "Brands Hatch Grey metallic", swatch: "#4f5357" },
        { name: "Frozen Deep Green metallic", swatch: "#2f3d33", note: "BMW Individual matte" },
        { name: "Frozen Brands Hatch Grey metallic", swatch: "#5b5f62", note: "BMW Individual matte" },
      ],
      wheels: [{ name: "20-inch M forged Y-spoke, Gold Bronze", swatch: "#8a6a3c" }],
      interiors: [{ name: "Black Merino leather with Mugello Red", swatch: "#7c1c1c" }],
    },
    media: {
      hero: "c-m5cs-fos22",
      exterior: [],
      interior: [],
      detail: [],
    },
    accent: "#8a6a3c",
    sources: [
      { label: "BMW Group PressClub — The new BMW M5 CS (27 January 2021)", url: "https://www.press.bmwgroup.com/ireland/article/detail/T0324973EN/the-new-bmw-m5-cs:-the-most-powerful-bmw-m-car-ever" },
    ],
  },
  {
    slug: "bmw-m4-competition",
    make: "BMW",
    model: "M4 Competition",
    name: "BMW M4 Competition",
    variant: "Coupé with M xDrive",
    year: "2026",
    status: "current",
    powertrain: "Combustion",
    layout: "Front-engine",
    tagline: "Six cylinders, 530 PS and a rear-biased M xDrive.",
    intro:
      "The updated M4 Competition Coupé with M xDrive gets 390 kW from its 3.0-litre straight six and reaches 100 km/h in 3.5 seconds.",
    description: [
      "BMW's 2024 update raised the output of the M xDrive versions of the M4 Competition to 390 kW, with 650 Nm available across a wide band from 2,750 to 5,730 rpm.",
      "M xDrive is rear-biased by design and works with the Active M Differential, so the car can be driven as a four-wheel-drive grand tourer or, in 2WD mode, as a traditional rear-drive M car.",
      "New LED headlights, laser-technology tail lights and a new range of forged wheels complete the update.",
    ],
    engine: "3.0-litre inline-six, M TwinPower Turbo",
    specs: {
      powerKw: 390,
      powerPs: 530,
      powerRpm: "6,250 rpm",
      torqueNm: 650,
      torqueRpm: "2,750–5,730 rpm",
      zeroTo100: 3.5,
      topSpeedKmh: 250,
      topSpeedNote: "limited",
      topSpeedExtra: "290 km/h with M Driver's Package",
      transmission: "8-speed M Steptronic with Drivelogic",
      drive: "M xDrive, rear-biased, Active M Differential",
      other: [{ label: "Wheels", value: "Forged, 19-inch front, 20-inch rear" }],
    },
    highlights: [
      { title: "390 kW update", text: "The 2024 revision lifted the M xDrive Competition models to 530 PS." },
      { title: "M xDrive", text: "Rear-biased all-wheel drive with a 2WD mode for drivers who want the classic M feel." },
      { title: "Laser tail lights", text: "Laser-technology rear lights and redesigned LED headlights arrived with the update." },
    ],
    price: {
      kind: "msrp",
      amount: 86400,
      currency: "USD",
      label: "US MSRP, 2026 M4 Competition Coupé",
      note: "Starting price of the rear-wheel-drive Competition Coupé. M xDrive costs more; ask us for current pricing.",
    },
    config: {
      verified: false,
      note: "Indicative selection from the manufacturer's palette, including BMW Individual colours.",
      paints: [
        { name: "Isle of Man Green metallic", swatch: "#1f4b3a" },
        { name: "São Paulo Yellow", swatch: "#e9c628" },
        { name: "Brooklyn Grey metallic", swatch: "#7d8287" },
        { name: "Black Sapphire metallic", swatch: "#0f1013" },
        { name: "Portimao Blue metallic", swatch: "#21407a" },
      ],
      wheels: [
        { name: "M forged double-spoke, jet black", swatch: "#151517" },
        { name: "M forged double-spoke, silver", swatch: "#bfc2c5" },
        { name: "M forged star-spoke, Frozen Gold", swatch: "#8c7448" },
      ],
      interiors: [
        { name: "Full Merino, Kyalami Orange and Black", swatch: "#b5561e" },
        { name: "Full Merino, Silverstone and Black", swatch: "#b9b4aa" },
        { name: "Full Merino, Black", swatch: "#121214" },
      ],
    },
    media: {
      hero: "u-m4-showroom-katler",
      exterior: ["u-m4-pair-thinh"],
      interior: [],
      detail: [],
    },
    accent: "#1f4b3a",
    sources: [
      { label: "BMW press release — The new BMW M4 Coupé and Convertible (2024)", url: "https://in.marketscreener.com/quote/stock/BMW-AG-56358353/news/The-new-BMW-M4-Coupe-the-new-BMW-M4-Convertible-45850476" },
      { label: "Cars.com — 2026 BMW M4 Competition Coupe (US price)", url: "https://www.cars.com/research/bmw-m4-2026/specs/470266" },
    ],
  },
  {
    slug: "ferrari-458-spider",
    make: "Ferrari",
    model: "458 Spider",
    name: "Ferrari 458 Spider",
    variant: "Heritage collection",
    year: "2011–2015",
    status: "heritage",
    powertrain: "Combustion",
    layout: "Mid-engine",
    tagline: "The last naturally aspirated mid-engined V8 Ferrari, with the roof down.",
    intro:
      "A 4.5-litre V8 that revs to 9,000 rpm, an aluminium folding hardtop and seven gears. The car our 3D studio is built around.",
    description: [
      "The 458 Spider arrived at the 2011 Frankfurt Motor Show with a first for a mid-engined Ferrari: an aluminium hardtop that folds away in 14 seconds. Underneath it is the same car as the 458 Italia, which means the F136 V8.",
      "That engine is the reason collectors keep these cars. It makes 570 PS at 9,000 rpm without turbochargers, and it was the last naturally aspirated V8 Ferrari put in a mid-engined car before the 488 moved to turbocharging.",
      "Carbon-ceramic brakes, magnetorheological dampers, an E-Diff and F1-Trac were standard. Front grille winglets flex at speed to reduce drag.",
    ],
    engine: "4.5-litre V8 (F136), naturally aspirated",
    specs: {
      powerKw: 419,
      powerPs: 570,
      powerRpm: "9,000 rpm",
      torqueNm: 540,
      torqueRpm: "6,000 rpm",
      zeroTo100: 3.4,
      topSpeedKmh: 320,
      transmission: "7-speed dual-clutch (Getrag)",
      drive: "Rear-wheel drive, E-Diff",
      brakes: "Carbon-ceramic, standard",
      other: [
        { label: "Roof", value: "Aluminium retractable hardtop, 14 s" },
        { label: "Dampers", value: "Magnetorheological, adaptive" },
      ],
    },
    highlights: [
      { title: "9,000 rpm V8", text: "570 PS from 4.5 litres without turbochargers, the last of its kind in a mid-engined Ferrari V8." },
      { title: "Folding hardtop", text: "An aluminium roof that stows in 14 seconds, a first for a mid-engined Ferrari." },
      { title: "Flexing aero", text: "Winglets in the front grille deform at speed to cut drag." },
    ],
    price: {
      kind: "poa",
      label: "Price on application",
      note: "Heritage examples are offered individually with full service history.",
    },
    config: {
      verified: false,
      note: "Classic Ferrari colours offered on the 458. Try them on the car in the 3D studio.",
      paints: [
        { name: "Rosso Corsa", swatch: "#a5111a" },
        { name: "Giallo Modena", swatch: "#efc21a" },
        { name: "Grigio Silverstone", swatch: "#4d5155" },
        { name: "Nero Daytona", swatch: "#0d0e10" },
        { name: "Bianco Avus", swatch: "#ecebe6" },
      ],
      wheels: [
        { name: "20-inch forged, silver", swatch: "#c3c5c8" },
        { name: "20-inch forged, bronze", swatch: "#8b6a3e" },
        { name: "20-inch forged, black", swatch: "#151517" },
      ],
      interiors: [
        { name: "Nero leather", swatch: "#141416" },
        { name: "Cuoio leather", swatch: "#7a4a2a" },
        { name: "Sabbia leather", swatch: "#cdb895" },
      ],
    },
    media: {
      hero: "studio-front",
      exterior: ["studio-side", "studio-rearlow", "studio-rear", "studio-face"],
      interior: ["studio-cockpit", "studio-high"],
      detail: ["studio-wheel", "studio-headlight", "studio-exhaust", "studio-intake"],
    },
    accent: "#a5111a",
    sources: [{ label: "Wikipedia — Ferrari 458", url: "https://en.wikipedia.org/wiki/Ferrari_458" }],
  },
];

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export const collectionStats = {
  count: vehicles.length,
  maxPowerPs: Math.max(...vehicles.map((v) => v.specs.powerPs)),
  quickest: Math.min(...vehicles.map((v) => v.specs.zeroTo100)),
  fastest: Math.max(...vehicles.map((v) => v.specs.topSpeedKmh)),
  maxTorque: Math.max(...vehicles.map((v) => v.specs.torqueNm)),
};
