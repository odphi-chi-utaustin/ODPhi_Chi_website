import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScarletRule } from "@/components/ui/ScarletRule";
import { NewsletterSignup } from "@/components/public/NewsletterSignup";

export const metadata = {
  title: "Alumni | Chi Chapter",
};

const ways = [
  {
    href: "/alumni/update",
    title: "Update Your Information",
    text: "New city, new job, new number? Keep your contact info current so you hear about reunions, Founders Week, and chapter news.",
    cta: "Update your info",
  },
  {
    href: "/alumni/recommend",
    title: "Recommend a Recruit",
    text: "Know a young man headed to UT who would make a great brother? Send him our way and our rush chair will reach out.",
    cta: "Make a recommendation",
  },
  {
    href: "/give",
    title: "Give Back",
    text: "Gifts fund recruitment, Young Knights mentorship, service projects, and scholarships for brothers who need a hand.",
    cta: "Make a gift",
  },
];

export default function AlumniPage() {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">Alumni</p>
        <h1 className="text-display mt-2 text-ink">Once an Omega, Always an Omega</h1>
        <p className="text-body mt-4 max-w-2xl text-ink-soft">
          Since 1998, generations of brothers have come through the Chi Chapter. Our
          alumni are the reason the chapter is still growing — they mentor
          actives, open doors after graduation, and come home every year to
          celebrate the brotherhood they built.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {ways.map((way) => (
            <Card key={way.href} variant="pillar" className="flex flex-col p-7">
              <h2 className="font-serif text-[26px] leading-tight text-ink">{way.title}</h2>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{way.text}</p>
              <Button href={way.href} variant="ghost" className="mt-6 self-start">
                {way.cta} <span aria-hidden="true">→</span>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 border-t border-border-light px-6 py-14 md:grid-cols-2">
        <div>
          <ScarletRule />
          <p className="text-eyebrow">Stay Close</p>
          <h2 className="text-subheading mt-2 text-ink">News &amp; Events</h2>
          <p className="text-body mt-4 text-ink-soft">
            Brother spotlights, chapter updates, and newsletters are posted on
            our{" "}
            <Link href="/news" className="text-scarlet hover:text-scarlet-dark">
              news page
            </Link>
            . Founders Week, reunions, and alumni events go on the{" "}
            <Link href="/events" className="text-scarlet hover:text-scarlet-dark">
              chapter calendar
            </Link>
            .
          </p>
          <p className="text-body mt-4 text-ink-soft">
            Looking for brothers beyond Austin? The national Omega Delta Phi
            alumni association, founded in 2000, has chapters across the
            country.
          </p>
        </div>
        <div>
          <ScarletRule />
          <p className="text-eyebrow">Newsletter</p>
          <h2 className="text-subheading mt-2 text-ink">Get It in Your Inbox</h2>
          <div className="mt-6">
            <NewsletterSignup source="alumni" />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-6 text-center">
        <ScarletRule className="mb-6" />
        <h2 className="text-heading max-w-2xl text-ink">
          Lost touch with the chapter? We&apos;d love to hear from you.
        </h2>
        <Button href="/contact" variant="primary" className="mt-8">
          Contact the Chapter
        </Button>
      </div>
    </div>
  );
}
