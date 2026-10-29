import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ScarletRule } from "@/components/ui/ScarletRule";
import { DonateForm } from "@/components/public/DonateForm";

export const metadata = {
  title: "Give | Chi Chapter",
};

const uses = [
  {
    name: "Recruitment",
    text: "Rush events, materials, and outreach that bring the next class of brothers to the chapter.",
  },
  {
    name: "Young Knights",
    text: "Our long-running mentorship program for middle school boys in Austin — supplies, outings, and lesson materials.",
  },
  {
    name: "Service",
    text: "Philanthropy drives and community projects, including our national partnership with the Wounded Warrior Project.",
  },
  {
    name: "Scholarships",
    text: "Help for brothers facing dues, conference costs, or financial hardship, so no one has to step away for money.",
  },
];

export default async function GivePage({
  searchParams,
}: {
  searchParams: Promise<{ thanks?: string }>;
}) {
  const { thanks } = await searchParams;
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">Giving Back</p>
        <h1 className="text-display mt-2 text-ink">Support the Chi Chapter</h1>
        <p className="text-body mt-4 max-w-2xl text-ink-soft">
          Every gift — from an alum, a parent, or a friend of the chapter —
          goes straight to the brothers and the Austin community we serve.
        </p>
      </div>

      {thanks && (
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <Card variant="featured" className="text-[15px]">
            Thank you for your gift. A receipt is on its way to your email.
            Crescit Eundo.
          </Card>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-14 pb-24 md:grid-cols-[1.2fr_1fr]">
        <div>
          <ScarletRule />
          <p className="text-eyebrow">Where It Goes</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {uses.map((use) => (
              <Card key={use.name} variant="pillar" className="p-6">
                <p className="font-serif text-[22px] text-ink">{use.name}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{use.text}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 max-w-xl text-xs leading-relaxed text-muted-light">
            The Chi Chapter is a registered student organization, not a
            501(c)(3) charity, so gifts are generally not tax-deductible. For a
            large gift or a gift in kind,{" "}
            <Link href="/contact" className="text-scarlet hover:text-scarlet-dark">
              contact the chapter
            </Link>
            .
          </p>
        </div>

        <div className="order-first self-start border border-border-light bg-card-bg p-6 sm:p-8 md:order-none">
          <h2 className="text-subheading text-ink">Make a Gift</h2>
          <div className="mt-6">
            {stripeEnabled ? (
              <DonateForm />
            ) : (
              <p className="text-[15px] leading-relaxed text-ink-soft">
                Online giving is coming soon. In the meantime,{" "}
                <Link href="/contact" className="text-scarlet hover:text-scarlet-dark">
                  reach out to the chapter
                </Link>{" "}
                and our treasurer will help you give.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
