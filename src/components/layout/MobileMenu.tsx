"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site, type NavItem } from "@/content/site";
import { vehicles } from "@/content/vehicles";
import { lockScroll } from "@/lib/motion";
import { Logo } from "@/components/ui/Logo";

const ease = [0.16, 1, 0.3, 1] as const;

export default function MobileMenu({ open, onClose, items }: { open: boolean; onClose: () => void; items: NavItem[] }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const returnFocus = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeBtn.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      returnFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-void"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          data-lenis-prevent
        >
          <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href="/" onClick={onClose} aria-label="ONYX Motor House, home">
              <Logo />
            </Link>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              className="flex h-11 items-center gap-3 px-1 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-platinum"
            >
              Close
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="shell flex-1 pb-10 pt-6">
            <ul className="space-y-1">
              {items.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease }}
                >
                  <Link href={item.href} onClick={onClose} className="wd-expanded block py-2 text-[clamp(1.9rem,8vw,3.2rem)] font-bold uppercase leading-none text-platinum">
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <ul className="mb-3 mt-1 flex flex-wrap gap-x-5 gap-y-1">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={onClose} className="text-sm text-silver hover:text-platinum">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 grid gap-10 border-t border-gunmetal pt-8 sm:grid-cols-2"
            >
              <div>
                <p className="label mb-3">The collection</p>
                <ul className="space-y-2">
                  {vehicles.map((v) => (
                    <li key={v.slug}>
                      <Link href={`/collection/${v.slug}`} onClick={onClose} className="text-sm text-silver hover:text-platinum">
                        {v.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label mb-3">Visit</p>
                <p className="text-sm text-silver">
                  {site.contact.showroom}, {site.contact.street}
                  <br />
                  {site.contact.city} {site.contact.postcode}
                </p>
                <p className="mt-3 text-sm text-silver">
                  <a href={site.contact.phoneHref} className="hover:text-platinum">
                    {site.contact.phone}
                  </a>
                </p>
                <Link href="/test-drive" onClick={onClose} className="btn btn-bronze mt-6 w-full sm:w-auto">
                  Book a test drive
                </Link>
              </div>
            </motion.div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
