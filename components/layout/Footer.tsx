import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Rush" },
  { href: "/news", label: "News" },
  { href: "/login", label: "Member Login" },
];

const socials = [
  { href: "https://www.instagram.com/texasodphi/", label: "Instagram" },
  { href: "https://www.linkedin.com/company/omega-delta-phi-fraternity-inc-/", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-serif text-[26px] font-semibold tracking-[0.04em]">
            ΩΔΦ
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Omega Delta Phi Fraternity, Inc. — Chi Chapter
            <br />
            Austin, Texas · Est. 1998
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <p className="text-label text-rose">Chapter</p>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-silver transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-label text-rose">Follow</p>
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-silver transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-elevated px-6 py-5">
        <p className="mx-auto max-w-6xl text-xs text-muted">
          © {new Date().getFullYear()} Omega Delta Phi Fraternity, Inc. — Chi
          Chapter. A registered student organization at The University of Texas
          at Austin.
        </p>
      </div>
    </footer>
  );
}
