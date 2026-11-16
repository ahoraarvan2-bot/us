/** Preview stand-in for next/navigation, backed by the hash router. */
import { useMemo, useSyncExternalStore } from "react";
import { getLocation, navigate, subscribe } from "../router";

function useLoc() {
  return useSyncExternalStore(subscribe, getLocation, getLocation);
}

export function usePathname() {
  return useLoc().path;
}

export function useSearchParams() {
  const search = useLoc().search;
  return useMemo(() => new URLSearchParams(search), [search]) as unknown as URLSearchParams;
}

export function useRouter() {
  return useMemo(
    () => ({
      push: (href: string) => navigate(href),
      replace: (href: string) => navigate(href, { replace: true }),
      back: () => window.history.back(),
      forward: () => window.history.forward(),
      refresh: () => {},
      prefetch: () => {},
    }),
    []
  );
}

export function useParams() {
  return {};
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}

export function redirect(href: string): never {
  navigate(href, { replace: true });
  throw new Error("NEXT_REDIRECT");
}
