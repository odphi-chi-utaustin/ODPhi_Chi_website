"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

function isCurrent(item: NavItem, pathname: string) {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 6"
      className={cn("h-1.5 w-2.5 transition-transform", open && "rotate-180")}
    >
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const topLinkClass =
  "text-[13px] uppercase tracking-[0.12em] transition-colors hover:text-scarlet";

// Desktop: hover or focus opens a section's dropdown; picking a link closes it.
export function DesktopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="hidden items-center gap-6 lg:flex">
      {navItems.map((item) => {
        const current = isCurrent(item, pathname);
        if (!item.children) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(topLinkClass, current ? "text-scarlet" : "text-ink")}
            >
              {item.label}
            </Link>
          );
        }
        const isOpen = open === item.label;
        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setOpen(item.label)}
            onMouseLeave={() => setOpen(null)}
            onFocus={() => setOpen(item.label)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(null);
            }}
          >
            <Link
              href={item.href}
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => setOpen(null)}
              className={cn(
                topLinkClass,
                "inline-flex items-center gap-1.5 py-6",
                current ? "text-scarlet" : "text-ink",
              )}
            >
              {item.label}
              <Chevron open={isOpen} />
            </Link>
            <div
              className={cn(
                "absolute left-1/2 top-full -translate-x-1/2 transition-opacity",
                isOpen ? "visible opacity-100" : "invisible opacity-0",
              )}
            >
              <div className="min-w-60 border border-border-light border-t-2 border-t-scarlet bg-page-bg py-2 shadow-lg">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpen(null)}
                    className={cn(
                      "block px-5 py-2.5 text-sm transition-colors hover:bg-surface-light hover:text-scarlet",
                      pathname === child.href ? "text-scarlet" : "text-ink",
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Below lg: a full-width panel under the header, every section expanded.
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center text-ink"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-76px)] overflow-y-auto border-b border-border-light bg-page-bg shadow-lg"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-border-light py-3 last:border-b-0">
                <Link
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "text-sm uppercase tracking-[0.12em]",
                    isCurrent(item, pathname) ? "text-scarlet" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="mt-2 flex flex-col">
                    {item.children.filter((c) => c.href !== item.href).map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={close}
                        className="py-1.5 pl-3 text-[15px] text-ink-soft hover:text-scarlet"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/login"
              onClick={close}
              className="mt-3 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-scarlet sm:hidden"
            >
              Member Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
