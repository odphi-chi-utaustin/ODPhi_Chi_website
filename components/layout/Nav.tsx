import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DesktopNav, MobileNav } from "@/components/layout/NavMenu";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-page-bg/95 backdrop-blur">
      <nav className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-serif text-[26px] font-semibold tracking-[0.04em] text-ink">
            ΩΔΦ
          </span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-light sm:text-[13px] sm:tracking-[0.18em]">
            Chi Chapter<span className="hidden sm:inline"> · Austin</span>
          </span>
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Button href="/login" variant="secondary-light" className="h-11 px-5 text-xs">
              Member Login
            </Button>
          </span>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
