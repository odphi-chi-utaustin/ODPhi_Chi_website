import Link from "next/link";
import { ScarletRule } from "@/components/ui/ScarletRule";
import { InquiryForm, Field, Select, TextArea } from "@/components/public/InquiryForm";
import { submitContact } from "@/lib/inquiry-actions";
import { mockExecBoard } from "@/lib/mock-data";
import { chapterEmail, mailingAddress } from "@/lib/site";

export const metadata = {
  title: "Contact | Chi Chapter",
};

const topics = [
  "General question",
  "Rush / joining",
  "Parents & families",
  "Alumni",
  "Events & partnerships",
  "Service & Young Knights",
];

// Who to ask for what. Names come from the exec board so they change in one place.
const contacts = [
  { title: "President", topic: "Chapter business, partnerships, and anything else" },
  { title: "Rush Chair", topic: "Rush, joining, and recruitment referrals" },
  { title: "Treasurer", topic: "Donations, dues, and payments" },
].map((c) => ({ ...c, name: mockExecBoard.find((m) => m.title === c.title)?.name }));

export default function ContactPage() {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">Contact</p>
        <h1 className="text-display mt-2 text-ink">Get in Touch</h1>
        <p className="text-body mt-4 max-w-2xl text-ink-soft">
          Questions about rush, a parent with a concern, an alum reconnecting,
          or an organization looking to partner — send us a note and the right
          brother will get back to you.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-14 pb-24 md:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-10">
          <div>
            <ScarletRule />
            <p className="text-eyebrow">Who to Ask</p>
            <ul className="mt-4 divide-y divide-border-light">
              {contacts.map((c) => (
                <li key={c.title} className="py-4">
                  <p className="text-label text-muted-light">{c.title}</p>
                  {c.name && <p className="mt-1 font-serif text-xl text-ink">{c.name}</p>}
                  <p className="mt-1 text-sm text-ink-soft">{c.topic}</p>
                </li>
              ))}
            </ul>
          </div>

          {(chapterEmail || mailingAddress.length > 0) && (
            <div>
              <ScarletRule />
              <p className="text-eyebrow">Chapter</p>
              <div className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {mailingAddress.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {chapterEmail && (
                  <a href={`mailto:${chapterEmail}`} className="mt-2 block text-scarlet hover:text-scarlet-dark">
                    {chapterEmail}
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <ScarletRule />
            <p className="text-eyebrow">Alumni</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Moved or changed jobs?{" "}
              <Link href="/alumni/update" className="text-scarlet hover:text-scarlet-dark">
                Update your information
              </Link>{" "}
              so we can keep you in the loop.
            </p>
          </div>
        </div>

        <div className="border border-border-light bg-card-bg p-6 sm:p-8">
          <h2 className="text-subheading text-ink">Send a Message</h2>
          <div className="mt-6">
            <InquiryForm action={submitContact} submitLabel="Send message">
              <Field name="name" label="Name" required autoComplete="name" />
              <Field name="email" label="Email" type="email" required autoComplete="email" />
              <Field name="phone" label="Phone" type="tel" autoComplete="tel" />
              <Select name="topic" label="Topic" options={topics} />
              <TextArea name="message" label="Message" required rows={6} />
            </InquiryForm>
          </div>
        </div>
      </div>
    </div>
  );
}
