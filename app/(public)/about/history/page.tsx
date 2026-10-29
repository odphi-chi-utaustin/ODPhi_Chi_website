import { Button } from "@/components/ui/Button";
import { ScarletRule } from "@/components/ui/ScarletRule";

export const metadata = {
  title: "History | Chi Chapter",
};

type Milestone = { when: string; title: string; text: string };

const national: Milestone[] = [
  {
    when: "November 25, 1987",
    title: "Founded at Texas Tech",
    text: "Seven students in Lubbock, led by Joe Cereceres, found Omega Delta Phi as a service fraternity for the Hispanic community. Kappa Delta Chi Sorority helps them get started, and the two still share the same four pillars.",
  },
  {
    when: "Spring 1988",
    title: "The Charter Class",
    text: "The founders initiate their first class of twelve men, now known as the Charter Class. The fraternity soon opens membership to any qualified man, regardless of background.",
  },
  {
    when: "1989 – 1991",
    title: "Growing Beyond Lubbock",
    text: "Beta Chapter is chartered at UTEP in 1989. In 1991 the first national conference at Texas Tech brings four chapters and a colony together to form a national organization.",
  },
  {
    when: "1996 – 2000",
    title: "Building a National Fraternity",
    text: "Alumni form a Board of Directors in 1996. In 1998 Omega Delta Phi is a founding member of the National Association of Latino Fraternal Organizations, and in 2000 it launches a national alumni association.",
  },
  {
    when: "2003 – 2005",
    title: "Fraternity of the Year",
    text: "NALFO names Omega Delta Phi its Fraternity of the Year three years in a row.",
  },
  {
    when: "Today",
    title: "One Culture, Any Race",
    text: "Headquartered in San Antonio and a member of the North American Interfraternity Conference, Omega Delta Phi has chartered more than seventy chapters. Since 2023 its national philanthropy has been the Wounded Warrior Project.",
  },
];

const chi: Milestone[] = [
  {
    when: "Summer 1998",
    title: "Chi Chapter Is Chartered",
    text: "Eleven years after the fraternity's founding, seven Men of Vision bring Omega Delta Phi to The University of Texas at Austin. The chapter is chartered on June 26, 1998.",
  },
  {
    when: "2000s",
    title: "Young Knights",
    text: "The chapter starts Young Knights, a mentorship program for middle school boys near campus — many from low-income families — with lessons on leadership and the road to college. Brothers have run it for more than two decades, with partners like Kealing Middle School and the Gus Garcia Young Men's Leadership Academy.",
  },
  {
    when: "2011",
    title: "Service at Scale",
    text: "Chi raises money for CASA of Travis County, the national philanthropy at the time, and begins earning the President's Volunteer Service Award year after year for more than 2,000 community service hours.",
  },
  {
    when: "2013",
    title: "Fifteen Years in Austin",
    text: "Brothers and alumni celebrate the chapter's fifteenth anniversary.",
  },
  {
    when: "2018",
    title: "Twenty Years and the Pillar Award",
    text: "Chi marks two decades on campus and wins the Pillar Award of Leadership, the first Greek-lettered organization to receive the campus honor.",
  },
];

const nationalFounders = [
  "Joe Cereceres",
  "Eugene Dominguez",
  "Elliott Bazan",
  "Christopher Dwight Forbes",
  "Arturo Barraza",
  "Juan Barraza",
  "Tommy Hurtado",
];

const chiFounders = [
  "Adrian Alvarez",
  "Francisco Garza",
  "Juan Arreola",
  "Robert Femat",
  "Antonio Rios",
  "Pedro Salazar",
  "Eloy Vela",
];

const symbols = [
  { label: "Motto", value: "Crescit Eundo", note: "“It grows as it goes”" },
  { label: "Philosophy", value: "One Culture, Any Race" },
  { label: "Colors", value: "Scarlet, Silver & Black" },
  { label: "Symbol", value: "The Silver Knight" },
  { label: "Flower", value: "The Silver Rose" },
  { label: "Pillars", value: "Unity · Honesty · Integrity · Leadership" },
];

function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="relative mt-8 border-l border-border-light">
      {items.map((m) => (
        <li key={m.title} className="relative pb-10 pl-8 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rotate-45 bg-scarlet"
          />
          <p className="text-label text-scarlet">{m.when}</p>
          <h3 className="mt-1 font-serif text-[24px] leading-tight text-ink">{m.title}</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{m.text}</p>
        </li>
      ))}
    </ol>
  );
}

function Founders({ heading, sub, names }: { heading: string; sub: string; names: string[] }) {
  return (
    <div>
      <p className="font-serif text-[26px] text-white">{heading}</p>
      <p className="text-label mt-1 text-rose">{sub}</p>
      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {names.map((name) => (
          <li key={name} className="text-[15px] text-silver">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">About</p>
        <h1 className="text-display mt-2 text-ink">Our History</h1>
        <p className="text-body mt-4 max-w-2xl text-ink-soft">
          Omega Delta Phi began with seven men and a vision in Lubbock. Eleven
          years later, seven more brought that vision to Austin. This is the
          story of the fraternity and of the Chi Chapter.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-14 md:grid-cols-2">
        <section>
          <ScarletRule />
          <p className="text-eyebrow">The Fraternity</p>
          <h2 className="text-subheading mt-2 text-ink">Omega Delta Phi</h2>
          <Timeline items={national} />
        </section>
        <section>
          <ScarletRule />
          <p className="text-eyebrow">The Chapter</p>
          <h2 className="text-subheading mt-2 text-ink">Chi Chapter at UT Austin</h2>
          <Timeline items={chi} />
        </section>
      </div>

      <section className="bg-black">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-eyebrow text-rose">Men of Vision</p>
          <h2 className="text-heading mt-3 text-white">Our Founders</h2>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            <Founders heading="National Founders" sub="Texas Tech · 1987" names={nationalFounders} />
            <Founders heading="Chi Chapter Founders" sub="UT Austin · 1998" names={chiFounders} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <ScarletRule />
        <p className="text-eyebrow">Traditions</p>
        <h2 className="text-subheading mt-2 text-ink">What We Carry Forward</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
          {symbols.map((s) => (
            <div key={s.label} className="border-t border-border-light pt-4">
              <dt className="text-label text-muted-light">{s.label}</dt>
              <dd className="mt-1 font-serif text-[22px] leading-snug text-ink">{s.value}</dd>
              {s.note && <dd className="text-sm text-ink-soft">{s.note}</dd>}
            </div>
          ))}
        </dl>
        <p className="text-body mt-10 max-w-2xl text-ink-soft">
          Every spring, Chi celebrates Founders Week with events across campus —
          over the years, a comedy night gift-card drive, a kickball tournament,
          and outreach on the Main Mall, all raising support for the
          chapter&apos;s philanthropy.
        </p>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 text-center">
        <ScarletRule className="mb-6" />
        <h2 className="text-heading max-w-2xl text-ink">Write the next chapter with us.</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/membership">Rush Information</Button>
          <Button href="/alumni" variant="secondary-light">
            Alumni
          </Button>
        </div>
      </div>
    </div>
  );
}
