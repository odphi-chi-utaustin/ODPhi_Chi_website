import Link from "next/link";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Membership" },
  { href: "/news", label: "News" },
];

export function Nav() {
  return (
    <header className="bg-black border-b border-elevated sticky top-0 z-50">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-medium tracking-tight">
          <span className="text-white">ΩΔΦ</span>{" "}
          <span className="text-scarlet">Chi</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button href="/login" variant="primary" className="text-xs md:text-sm">
          Member Login
        </Button>
      </nav>
    </header>
  );
}
