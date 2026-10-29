import Link from "next/link";
import { ScarletRule } from "@/components/ui/ScarletRule";
import { Card } from "@/components/ui/Card";
import { ExecBoardGrid } from "@/components/public/ExecBoardGrid";
import { mockExecBoard, mockCommittees, mockConstitutionUrl } from "@/lib/mock-data";

export const metadata = {
  title: "About | Chi Chapter",
};

function Section({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-12">
      <ScarletRule />
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="text-subheading mt-2 text-ink">{heading}</h2>
      <div className="text-body mt-4 max-w-2xl text-ink-soft">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">About</p>
        <h1 className="text-display mt-2 text-ink">The Chi Chapter</h1>
      </div>

      <div className="mx-auto max-w-6xl divide-y divide-border-light px-6">
        <Section eyebrow="Our History" heading="Our History">
          <p>
            The Chi Chapter of Omega Delta Phi Fraternity, Inc. was chartered
            at the University of Texas at Austin in 1998. Since then, the
            chapter has grown into one of the most active multicultural
            fraternities on campus, rooted in the founding pillars of
            unity, honesty, integrity, and leadership.
          </p>
          <Link
            href="/about/history"
            className="mt-4 inline-block text-sm font-medium text-scarlet hover:text-scarlet-dark"
          >
            Read the full history →
          </Link>
        </Section>

        <Section eyebrow="Our Chapter" heading="Our Chapter">
          <p>
            Today, the Chi Chapter is made up of brothers from every
            background, major, and walk of life across UT Austin. We host
            weekly chapter meetings, social events, and philanthropy drives
            throughout the year.
          </p>
        </Section>

        <Section eyebrow="Our Academics" heading="Our Academics">
          <p>
            Academic excellence is a requirement of membership, not an
            afterthought. The chapter maintains a minimum GPA standard and
            runs a peer tutoring and study hall program every semester.
          </p>
        </Section>

        <Section eyebrow="Our Service" heading="Our Service">
          <p>
            Brothers log hundreds of community service hours each year
            through partnerships with local Austin nonprofits, mentorship
            programs, and chapter-organized philanthropy events.
          </p>
        </Section>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <ScarletRule />
        <p className="text-eyebrow">Leadership</p>
        <h2 className="text-subheading mt-2 text-ink">Executive Board</h2>
        <div className="mt-8">
          <ExecBoardGrid members={mockExecBoard} variant="light" />
        </div>
      </div>

      <div id="committees" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
        <ScarletRule />
        <p className="text-eyebrow">Committees</p>
        <h2 className="text-subheading mt-2 text-ink">Our Committees</h2>
        <p className="text-body mt-4 max-w-2xl text-muted-light">
          Most of the chapter&apos;s work happens in committees, each led by a
          semester chairman.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {mockCommittees.map((committee) => (
            <Card key={committee.id} variant="pillar" className="p-6">
              <p className="font-serif text-[22px] text-ink">{committee.name}</p>
              <p className="text-label mt-1 text-muted-light">
                Chair · {committee.chair}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {committee.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <ScarletRule />
        <p className="text-eyebrow">Governance</p>
        <h2 className="text-subheading mt-2 text-ink">Constitution</h2>
        <p className="text-body mt-4 max-w-2xl text-muted-light">
          Read the chapter&apos;s governing constitution and bylaws.
        </p>
        <a
          href={mockConstitutionUrl}
          className="mt-4 inline-block text-sm font-medium text-scarlet hover:text-scarlet-dark"
        >
          View the Constitution →
        </a>
      </div>
    </div>
  );
}
