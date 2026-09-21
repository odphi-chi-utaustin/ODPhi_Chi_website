import Link from "next/link";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Rush" },
  { href: "/news", label: "News" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-page-bg/95 backdrop-blur">
      <nav className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-serif text-[26px] font-semibold tracking-[0.04em] text-ink">
            ΩΔΦ
          </span>
          <span className="hidden text-[13px] uppercase tracking-[0.18em] text-muted-light sm:inline">
            Chi Chapter · Austin
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-[0.12em] text-ink transition-colors hover:text-scarlet"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button
          href="/login"
          variant="secondary-light"
          className="h-11 px-5 text-xs"
        >
          Member Login
        </Button>
      </nav>
    </header>
  );
}
