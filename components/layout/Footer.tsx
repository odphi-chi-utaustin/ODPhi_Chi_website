import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Membership" },
  { href: "/news", label: "News" },
  { href: "/login", label: "Member Login" },
];

const socials = [
  { href: "https://www.instagram.com", label: "Instagram" },
  { href: "https://www.linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-black border-t border-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-medium tracking-tight">
            <span className="text-white">ΩΔΦ</span>{" "}
            <span className="text-scarlet">Chi</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            Chi Chapter of Omega Delta Phi Fraternity, Inc.
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-elevated px-6 py-4">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Chi Chapter of Omega Delta Phi
          Fraternity, Inc.
        </p>
      </div>
    </footer>
  );
}
