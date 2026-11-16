/**
 * Preview stand-in for next/link: renders a real link to the hash address
 * (so new tabs and copied links work) and routes in-page on click.
 */
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { navigate, toHash } from "../router";

type Href = string | { pathname?: string; query?: Record<string, string>; hash?: string };
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: Href;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
};

function toPath(href: Href): string {
  if (typeof href === "string") return href;
  const q = href.query ? `?${new URLSearchParams(href.query)}` : "";
  return `${href.pathname ?? "/"}${q}${href.hash ? `#${href.hash.replace(/^#/, "")}` : ""}`;
}

const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, onClick, prefetch: _p, replace, scroll: _s, shallow: _sh, passHref: _ph, legacyBehavior: _l, ...rest },
  ref
) {
  void _p;
  void _s;
  void _sh;
  void _ph;
  void _l;
  const path = toPath(href);
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("//")) {
    return <a ref={ref} href={path} onClick={onClick} {...rest} />;
  }
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    e.preventDefault();
    navigate(path, { replace });
  };
  return <a ref={ref} href={toHash(path)} data-route={path} onClick={handle} {...rest} />;
});

export default Link;
