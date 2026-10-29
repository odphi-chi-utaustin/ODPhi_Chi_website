import { ScarletRule } from "@/components/ui/ScarletRule";
import { InquiryForm, Field, FormSection, Select, TextArea } from "@/components/public/InquiryForm";
import { submitReferral } from "@/lib/inquiry-actions";
import { mockExecBoard } from "@/lib/mock-data";

export const metadata = {
  title: "Recruitment Recommendations | Chi Chapter",
};

// Rebuild daily so the semester list below rolls forward without a deploy.
export const revalidate = 86400;

const rushChair = mockExecBoard.find((m) => m.title === "Rush Chair")?.name;

// Rolls forward each year so the form never offers a semester that's already passed.
function startTerms() {
  const year = new Date().getFullYear();
  return [
    `Fall ${year}`,
    `Spring ${year + 1}`,
    `Fall ${year + 1}`,
    `Spring ${year + 2}`,
    `Fall ${year + 2}`,
    "Already at UT",
    "Not sure",
  ];
}

const steps = [
  "Tell us who he is and how to reach him.",
  "Our rush chair reaches out personally before the next rush.",
  "He gets invited to meet the brothers at rush events — no pressure, no obligation.",
];

export default function RecommendPage() {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">Alumni</p>
        <h1 className="text-display mt-2 text-ink">Recruitment Recommendations</h1>
        <p className="text-body mt-4 max-w-2xl text-ink-soft">
          The best brothers often come to us through someone who already knows
          the chapter. If you know a young man headed to UT Austin who would
          live our pillars of unity, honesty, integrity, and leadership, we
          want to meet him.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-14 pb-24 md:grid-cols-[1fr_1.6fr]">
        <div>
          <ScarletRule />
          <p className="text-eyebrow">How It Works</p>
          <ol className="mt-4 flex flex-col gap-5">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-serif text-3xl leading-none text-scarlet">{i + 1}</span>
                <span className="text-[15px] leading-relaxed text-ink-soft">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm leading-relaxed text-muted-light">
            Anyone can recommend — alumni, actives, parents, teachers, and
            counselors.
            {rushChair && ` Recommendations go to our rush chair, ${rushChair}.`}
          </p>
        </div>

        <div className="border border-border-light bg-card-bg p-6 sm:p-8">
          <InquiryForm action={submitReferral} submitLabel="Send recommendation">
            <FormSection>About You</FormSection>
            <Field name="name" label="Your name" required autoComplete="name" />
            <Select
              name="relationship"
              label="You are"
              options={["An alumnus", "An active brother", "A parent or family member", "A teacher or counselor", "Other"]}
            />
            <Field name="email" label="Your email" type="email" required autoComplete="email" />
            <Field name="phone" label="Your phone" type="tel" autoComplete="tel" />

            <FormSection>About Him</FormSection>
            <Field name="candidate_name" label="His name" required wide />
            <Field name="candidate_email" label="His email" type="email" />
            <Field name="candidate_phone" label="His phone" type="tel" />
            <Field name="candidate_school" label="High school or current school" />
            <Select name="candidate_year" label="Starting at UT" options={startTerms()} />
            <TextArea
              name="notes"
              label="Why he'd be a good fit"
              rows={4}
              placeholder="Activities, leadership, how you know him…"
            />
          </InquiryForm>
        </div>
      </div>
    </div>
  );
}
