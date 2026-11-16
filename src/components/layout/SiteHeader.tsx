"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { primaryNav, type NavItem } from "@/content/site";
import { vehicles } from "@/content/vehicles";
import { cx, fmtInt } from "@/lib/format";
import { Logo } from "@/components/ui/Logo";
import { SmartImage } from "@/components/media/SmartImage";
import MobileMenu from "./MobileMenu";

const ease = [0.16, 1, 0.3, 1] as const;

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preview, setPreview] = useState(vehicles[0].slug);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 260 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y < 260) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const label = openMenu;
        setOpenMenu(null);
        document.getElementById(`nav-trigger-${label}`)?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  const openNow = useCallback((label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }, []);
  const closeSoon = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  }, []);

  const showSolid = scrolled || openMenu !== null;
  const items: NavItem[] = primaryNav.map((item) =>
    item.label === "Collection"
      ? { ...item, children: vehicles.map((v) => ({ label: v.name, href: `/collection/${v.slug}` })) }
      : item
  );

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
          showSolid ? "border-b border-white/[0.07] bg-black/75 backdrop-blur-xl" : "border-b border-transparent bg-transparent",
          hidden && !openMenu && !mobileOpen ? "-translate-y-full" : "translate-y-0"
        )}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {!showSolid ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        ) : null}
        <div className="shell relative flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label="ONYX Motor House, home" className="relative z-10">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 xl:block">
            <ul className="flex items-center gap-1">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                const hasMenu = Boolean(item.children?.length);
                const open = openMenu === item.label;
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={hasMenu ? () => openNow(item.label) : undefined}
                    onMouseLeave={hasMenu ? closeSoon : undefined}
                    onBlur={(e) => {
                      if (hasMenu && !e.currentTarget.contains(e.relatedTarget as Node)) closeSoon();
                    }}
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cx(
                          "relative px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] transition-colors wd-wide",
                          active ? "text-platinum" : "text-silver hover:text-platinum"
                        )}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={cx(
                            "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-bronze transition-transform duration-500",
                            active ? "scale-x-100" : "scale-x-0"
                          )}
                        />
                      </Link>
                      {hasMenu ? (
                        <button
                          id={`nav-trigger-${item.label}`}
                          type="button"
                          aria-expanded={open}
                          aria-controls={`nav-panel-${item.label}`}
                          aria-label={`${open ? "Close" : "Open"} ${item.label} menu`}
                          onClick={() => (open ? setOpenMenu(null) : openNow(item.label))}
                          className="-ml-2 grid h-8 w-6 place-items-center text-steel hover:text-platinum"
                        >
                          <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true" className={cx("transition-transform duration-300", open && "rotate-180")}>
                            <path d="M1 1l3.5 3.5L8 1" fill="none" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                        </button>
                      ) : null}
                    </div>

                    {hasMenu && item.label !== "Collection" ? (
                      <AnimatePresence>
                        {open ? (
                          <motion.div
                            id={`nav-panel-${item.label}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.35, ease }}
                            className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-4"
                          >
                            <ul className="border border-white/[0.08] bg-black/90 p-2 backdrop-blur-xl">
                              {item.children!.map((c) => (
                                <li key={c.href}>
                                  <Link href={c.href} className="group block px-4 py-3 transition-colors hover:bg-white/[0.04]">
                                    <span className="block text-sm font-semibold text-platinum wd-wide">{c.label}</span>
                                    {c.description ? <span className="mt-0.5 block text-xs leading-snug text-steel group-hover:text-silver">{c.description}</span> : null}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3">
            <Link href="/test-drive" className="btn btn-bronze btn-sm hidden md:inline-flex">
              Book a test drive
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="flex h-11 items-center gap-3 px-1 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-platinum xl:hidden"
            >
              <span className="hidden xs:inline">Menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 self-end bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Collection mega panel */}
        <AnimatePresence>
          {openMenu === "Collection" ? (
            <motion.div
              id="nav-panel-Collection"
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.5, ease }}
              onMouseEnter={() => openNow("Collection")}
              onMouseLeave={closeSoon}
              className="absolute inset-x-0 top-full hidden border-b border-white/[0.07] bg-[#050506] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] xl:block"
            >
              <div className="shell grid grid-cols-12 gap-10 py-10">
                <div className="col-span-5">
                  <p className="label mb-4">The collection</p>
                  <ul className="spec-rows">
                    {vehicles.map((v) => (
                      <li key={v.slug}>
                        <Link
                          href={`/collection/${v.slug}`}
                          onMouseEnter={() => setPreview(v.slug)}
                          onFocus={() => setPreview(v.slug)}
                          className="group flex items-baseline justify-between gap-6 py-3"
                        >
                          <span className={cx("wd-wide text-base font-semibold transition-colors", preview === v.slug ? "text-platinum" : "text-silver")}>
                            {v.name}
                          </span>
                          <span className="tabular wd-condensed shrink-0 text-sm text-steel group-hover:text-bronze-hi">
                            {fmtInt(v.specs.powerPs)} PS
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/collection" className="link-line mt-6 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-bronze-hi">
                    View the full collection
                  </Link>
                </div>
                <div className="col-span-7">
                  {(() => {
                    const v = vehicles.find((x) => x.slug === preview) ?? vehicles[0];
                    return (
                      <Link href={`/collection/${v.slug}`} className="group relative block aspect-[16/8] overflow-hidden" tabIndex={-1}>
                        <SmartImage
                          image={v.media.hero}
                          sizes="(min-width: 1280px) 55vw, 0px"
                          fallbackLabel={v.name}
                          bare
                          imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 flex w-full items-end justify-between gap-6 p-6">
                          <div>
                            <p className="text-xs text-silver">{v.make}</p>
                            <p className="wd-expanded text-2xl font-bold uppercase text-platinum">{v.model}</p>
                          </div>
                          <p className="tabular wd-condensed text-right text-sm text-silver">
                            0–100 km/h <span className="text-xl font-semibold text-platinum">{v.specs.zeroTo100.toFixed(1)}</span> s
                          </p>
                        </div>
                      </Link>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} items={primaryNav} />
    </>
  );
}
