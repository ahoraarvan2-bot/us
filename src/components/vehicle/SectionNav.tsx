"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cx } from "@/lib/format";
import { scrollToTarget } from "@/lib/motion";
import { IS_PREVIEW } from "@/lib/env";

/** Sticky in-page navigation for a vehicle; highlights the section in view. */
export function SectionNav({ sections, slug }: { sections: { id: string; label: string }[]; slug: string }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-0 z-30 border-b border-gunmetal bg-graphite/90 backdrop-blur-xl" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="shell flex items-center justify-between gap-6">
        <ul className="-mx-3 flex gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(`#${s.id}`);
                  // the preview build routes on the hash, so it keeps the address as it is
                  if (!IS_PREVIEW) history.replaceState(null, "", `#${s.id}`);
                }}
                aria-current={active === s.id ? "true" : undefined}
                className={cx(
                  "relative block px-3 py-4 text-sm transition-colors",
                  active === s.id ? "text-platinum" : "text-steel hover:text-silver"
                )}
              >
                {s.label}
                <span aria-hidden="true" className={cx("absolute inset-x-3 bottom-0 h-px bg-bronze transition-transform duration-500", active === s.id ? "scale-x-100" : "scale-x-0")} />
              </a>
            </li>
          ))}
        </ul>
        <Link href={`/test-drive?vehicle=${slug}`} className="btn btn-bronze btn-sm hidden shrink-0 md:inline-flex">
          Test drive
        </Link>
      </div>
    </nav>
  );
}
