/**
 * Brand and business details.
 *
 * ONYX Motor House is a demonstration brand. Everything marked PLACEHOLDER
 * must be replaced with the real business details before the site goes live
 * (see README → "Replace before launch").
 */
export const site = {
  name: "ONYX",
  fullName: "ONYX Motor House",
  descriptor: "Motor House",
  tagline: "Beyond the drive.",
  description:
    "ONYX Motor House sources, prepares and delivers the world's most exacting performance cars, from the Porsche 911 Turbo S to the Lamborghini Revuelto. Private viewings, test drives and delivery by appointment.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  /**
   * True while ONYX is a demonstration brand: the footer says so, and form
   * confirmations say nobody will call. Set to false for a real business.
   */
  concept: true,

  contact: {
    // PLACEHOLDER — showroom address, phone and email
    showroom: "ONYX Atelier",
    street: "Berkeley Square, Mayfair",
    city: "London",
    postcode: "W1J",
    country: "United Kingdom",
    // Map pin (Berkeley Square, London). Used for the contact-page map and "Open in Maps" links.
    lat: 51.5097,
    lng: -0.1459,
    // 020 7946 0xxx is a range Ofcom reserves for fiction, so this number reaches nobody.
    phone: "+44 20 7946 0958",
    phoneHref: "tel:+442079460958",
    // .example is a reserved domain, so mail sent here reaches nobody.
    email: "concierge@onyx-motorhouse.example",
    hours: [
      { days: "Monday to Friday", time: "09:00–19:00" },
      { days: "Saturday", time: "10:00–17:00" },
      { days: "Sunday", time: "By appointment" },
    ],
  },

  // PLACEHOLDER — replace the handles with the brand's real accounts
  social: [
    { label: "Instagram", href: "https://www.instagram.com/onyxmotorhouse" },
    { label: "YouTube", href: "https://www.youtube.com/@onyxmotorhouse" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/onyxmotorhouse" },
    { label: "X", href: "https://x.com/onyxmotorhouse" },
  ],

  legal: {
    company: "ONYX Motor House",
    trademarkNotice:
      "ONYX Motor House is an independent automotive house and is not affiliated with, endorsed by or sponsored by BMW AG, Mercedes-Benz Group AG, Dr. Ing. h.c. F. Porsche AG, Automobili Lamborghini S.p.A., Ferrari S.p.A. or Aston Martin Lagonda Global Holdings plc. Vehicle names and marks belong to their respective owners and are used only to identify the vehicles described.",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  {
    label: "Performance",
    href: "/performance",
    children: [
      { label: "Engineering", href: "/performance", description: "Engines, aero, chassis and braking, explained" },
      { label: "Compare cars", href: "/performance#compare", description: "Put up to three cars side by side" },
    ],
  },
  {
    label: "Technology",
    href: "/technology",
    children: [
      { label: "3D studio", href: "/technology#studio", description: "Inspect the Ferrari 458 Spider in three dimensions" },
      { label: "Hybrid systems", href: "/technology#hybrid", description: "How the electrified cars combine power sources" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "The house", href: "/about", description: "How we source, prepare and deliver" },
      { label: "Gallery", href: "/gallery", description: "Photography and studio renders" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
