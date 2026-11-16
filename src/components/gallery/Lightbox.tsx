"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SmartImage } from "@/components/media/SmartImage";
import { bestUrl, creditFor, type MediaImage } from "@/lib/media";
import { lockScroll } from "@/lib/motion";

type Props = { items: MediaImage[]; index: number | null; onClose: () => void; onIndex: (i: number) => void };

export function Lightbox({ items, index, onClose, onIndex }: Props) {
  const open = index !== null;
  const [dir, setDir] = useState(1);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setDir(step);
      onIndex((index + step + items.length) % items.length);
    },
    [index, items.length, onIndex]
  );

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const returnTo = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("button, a[href]");
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      returnTo?.focus?.();
    };
  }, [open, onClose, go]);

  // warm the neighbours
  useEffect(() => {
    if (index === null || items.length < 2) return;
    [1, -1].forEach((s) => {
      const it = items[(index + s + items.length) % items.length];
      const img = new Image();
      img.src = bestUrl(it, 1600);
    });
  }, [index, items]);

  const item = index !== null ? items[index] : null;
  const credit = item ? creditFor(item) : null;

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[80] flex flex-col bg-black/95 backdrop-blur-sm"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          data-lenis-prevent
        >
          <div className="flex items-center justify-between px-[max(1.25rem,env(safe-area-inset-left))] py-4 md:px-8">
            <p className="tabular text-sm text-silver" aria-live="polite">
              {index! + 1} <span className="text-steel">/ {items.length}</span>
            </p>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              className="flex h-11 items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-platinum"
            >
              Close
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <div
            className="relative flex-1 overflow-hidden"
            onPointerDown={(e) => (touchX.current = e.clientX)}
            onPointerUp={(e) => {
              if (touchX.current === null) return;
              const dx = e.clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
          >
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={item.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 mx-auto max-w-[1800px] px-2 md:px-20"
              >
                <div className="relative h-full w-full">
                  <SmartImage image={item} sizes="100vw" fit="contain" grade={false} className="!bg-transparent" priority />
                </div>
              </motion.div>
            </AnimatePresence>

            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/20 bg-black/50 text-platinum transition-colors hover:border-platinum md:left-6"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M10.5 2.5L5 8l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/20 bg-black/50 text-platinum transition-colors hover:border-platinum md:right-6"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5.5 2.5L11 8l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>

          <div className="flex flex-col gap-1 px-[max(1.25rem,env(safe-area-inset-left))] py-4 md:flex-row md:items-baseline md:justify-between md:px-8">
            <p className="text-sm text-platinum">{item.alt}</p>
            {credit ? (
              <p className="text-xs text-steel">
                {credit.author}
                {credit.license ? `, ${credit.license}` : ""}
                {credit.page && credit.page.startsWith("http") ? (
                  <>
                    {" "}
                    <a href={credit.page} target="_blank" rel="noopener noreferrer" className="link-line text-silver hover:text-platinum">
                      Source
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
