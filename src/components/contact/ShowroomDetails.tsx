import { site } from "@/content/site";
import { CopyButton } from "@/components/ui/CopyButton";

/** An illustrated street plan around a square, with the showroom marked. Not to scale. */
function MapIllustration() {
  const trees = Array.from({ length: 18 }, (_, i) => ({ x: 128 + (i % 6) * 26, y: 92 + Math.floor(i / 6) * 30 }));
  return (
    <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Illustrated map: the showroom on the west side of a garden square. Not to scale.">
      <rect width="400" height="260" fill="var(--color-carbon)" />
      {/* streets */}
      <g stroke="var(--color-gunmetal)" strokeWidth="14" fill="none">
        <path d="M0 60 H400" />
        <path d="M0 210 H400" />
        <path d="M95 0 V260" />
        <path d="M305 0 V260" />
        <path d="M20 0 L95 60" />
        <path d="M305 210 L380 260" />
      </g>
      <g stroke="var(--color-void)" strokeWidth="1" strokeDasharray="6 6" fill="none" opacity="0.6">
        <path d="M0 60 H400" />
        <path d="M0 210 H400" />
        <path d="M95 0 V260" />
        <path d="M305 0 V260" />
      </g>
      {/* the square */}
      <rect x="112" y="76" width="176" height="118" fill="#10140f" stroke="var(--color-gunmetal)" />
      {trees.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r="7" fill="#1b2419" />
      ))}
      {/* pin */}
      <g transform="translate(74 132)">
        <circle r="20" fill="var(--color-bronze)" opacity="0.15" />
        <circle r="9" fill="var(--color-bronze)" />
        <circle r="3.5" fill="var(--color-void)" />
      </g>
      <text x="16" y="168" fontSize="11" fill="var(--color-platinum)">ONYX</text>
      <text x="150" y="146" fontSize="10" fill="var(--color-steel)">Garden square</text>
      <text x="320" y="250" fontSize="9" fill="var(--color-steel)">Not to scale</text>
    </svg>
  );
}

export function ShowroomDetails() {
  const c = site.contact;
  const q = `${c.lat},${c.lng}`;
  const maps = [
    { label: "Google Maps", href: `https://www.google.com/maps/search/?api=1&query=${q}` },
    { label: "Apple Maps", href: `https://maps.apple.com/?ll=${q}&q=ONYX` },
    { label: "OpenStreetMap", href: `https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=17/${c.lat}/${c.lng}` },
  ];
  return (
    <div className="space-y-10">
      <div className="border border-gunmetal">
        <MapIllustration />
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-gunmetal p-4">
          {maps.map((m) => (
            <a key={m.label} href={m.href} target="_blank" rel="noopener noreferrer" className="link-line text-xs font-semibold uppercase tracking-[0.14em] text-silver hover:text-platinum">
              {m.label}
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="label mb-3">Showroom</p>
        <address className="not-italic leading-relaxed text-silver">
          {c.showroom}
          <br />
          {c.street}
          <br />
          {c.city} {c.postcode}, {c.country}
        </address>
      </div>

      <dl className="space-y-4">
        <div>
          <dt className="label mb-1">Phone</dt>
          <dd className="flex flex-wrap items-center gap-3">
            <a href={c.phoneHref} className="tabular text-lg text-platinum hover:text-bronze-hi">
              {c.phone}
            </a>
            <CopyButton value={c.phone} label="phone number" />
          </dd>
        </div>
        <div>
          <dt className="label mb-1">Email</dt>
          <dd className="flex flex-wrap items-center gap-3">
            <a href={`mailto:${c.email}`} className="break-all text-lg text-platinum hover:text-bronze-hi">
              {c.email}
            </a>
            <CopyButton value={c.email} label="email address" />
          </dd>
        </div>
      </dl>

      <div>
        <p className="label mb-3">Opening hours</p>
        <dl className="max-w-sm space-y-1 text-sm">
          {c.hours.map((h) => (
            <div key={h.days} className="flex justify-between gap-4">
              <dt className="text-steel">{h.days}</dt>
              <dd className="tabular text-silver">{h.time}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <p className="label mb-3">Follow</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {site.social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-line text-sm text-silver hover:text-platinum">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
