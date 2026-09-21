import { ScarletRule } from "@/components/ui/ScarletRule";
import { Accordion } from "@/components/ui/Accordion";
import { NewsletterEmbed } from "@/components/public/NewsletterEmbed";

export const metadata = {
  title: "Membership | Chi Chapter",
};

const requirements = [
  "Minimum 2.5 cumulative GPA at time of intake",
  "Full-time enrollment at UT Austin",
  "Completion of the new member education program",
  "Attendance at all mandatory chapter and rush events",
];

const faqs = [
  {
    question: "Is hazing part of the new member process?",
    answer:
      "No. Omega Delta Phi Fraternity, Inc. has a zero-tolerance anti-hazing policy at the national and chapter level. Any violation is reported and investigated immediately.",
  },
  {
    question: "Does my son need to be a certain race or background to join?",
    answer:
      "No. Our founding principle is “one culture, any race.” We welcome members from every background.",
  },
  {
    question: "How much time does membership require?",
    answer:
      "Most brothers spend a few hours a week on chapter meetings, events, and committee work, on top of their own coursework and activities.",
  },
  {
    question: "Who can I contact with concerns?",
    answer:
      "Parents and guardians can reach out to our chapter advisor or any exec board member listed on the About page.",
  },
];

export default function MembershipPage() {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">Membership</p>
        <h1 className="text-display mt-2 text-ink">Join the Brotherhood</h1>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <ScarletRule />
        <p className="text-eyebrow">Requirements</p>
        <h2 className="text-subheading mt-2 text-ink">
          Undergraduate Requirements
        </h2>
        <ul className="text-body mt-4 max-w-2xl list-disc space-y-2 pl-5 text-muted-light">
          {requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-6xl border-t border-border-light px-6 py-12">
        <ScarletRule />
        <p className="text-eyebrow">Our Commitment</p>
        <h2 className="text-subheading mt-2 text-ink">Anti-Hazing Policy</h2>
        <p className="text-body mt-4 max-w-2xl text-muted-light">
          Omega Delta Phi Fraternity, Inc. maintains a strict zero-tolerance
          policy against hazing in any form. All new members go through a
          transparent, educational intake process.
        </p>
        <a
          href="#"
          className="mt-4 inline-block text-sm font-medium text-scarlet hover:text-scarlet-dark"
        >
          Read the full policy →
        </a>
      </div>

      <div className="mx-auto max-w-6xl border-t border-border-light px-6 py-12">
        <ScarletRule />
        <p className="text-eyebrow">Our Values</p>
        <h2 className="text-subheading mt-2 text-ink">Belonging and Inclusion</h2>
        <p className="text-body mt-4 max-w-2xl text-muted-light">
          Founded on the principle of one culture, any race, the Chi Chapter
          is committed to building a brotherhood where every member feels
          seen, supported, and challenged to grow.
        </p>
      </div>

      <div className="mx-auto max-w-6xl border-t border-border-light px-6 py-12">
        <ScarletRule />
        <p className="text-eyebrow">FAQ</p>
        <h2 className="text-subheading mt-2 text-ink">Parents FAQ</h2>
        <div className="mt-6 max-w-2xl">
          <Accordion items={faqs} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-border-light px-6 py-12 pb-20">
        <ScarletRule />
        <p className="text-eyebrow">Stay Connected</p>
        <h2 className="text-subheading mt-2 text-ink">Subscribe to our Newsletter</h2>
        <div className="mt-6 max-w-2xl">
          <NewsletterEmbed />
        </div>
      </div>
    </div>
  );
}
