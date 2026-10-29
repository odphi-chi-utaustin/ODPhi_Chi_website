import Link from "next/link";
import { navItems, chapterEmail, mailingAddress } from "@/lib/site";

const socials = [
  { href: "https://www.instagram.com/texasodphi/", label: "Instagram" },
  { href: "https://www.linkedin.com/company/omega-delta-phi-fraternity-inc-/", label: "LinkedIn" },
];

// One column per nav section that has sub-pages; the rest share a "Chapter" column.
const sections = navItems.filter((item) => item.children);
const chapterLinks = [
  ...navItems.filter((item) => !item.children),
  { href: "/login", label: "Member Login" },
];

const linkClass = "text-sm text-silver transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.3fr_3fr]">
        <div className="max-w-sm">
          <p className="font-serif text-[26px] font-semibold tracking-[0.04em]">
            ΩΔΦ
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Omega Delta Phi Fraternity, Inc. — Chi Chapter
            <br />
            Austin, Texas · Est. 1998
          </p>
          {(chapterEmail || mailingAddress.length > 0) && (
            <div className="mt-5 text-sm leading-relaxed text-silver">
              {mailingAddress.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {chapterEmail && (
                <a href={`mailto:${chapterEmail}`} className="mt-1 block hover:text-white">
                  {chapterEmail}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-5">
          {sections.map((section) => (
            <div key={section.label} className="flex flex-col gap-3">
              <p className="text-label text-rose">{section.label}</p>
              {section.children!.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-3">
            <p className="text-label text-rose">Chapter</p>
            {chapterLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
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
                className={linkClass}
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
