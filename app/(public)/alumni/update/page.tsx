import { ScarletRule } from "@/components/ui/ScarletRule";
import { InquiryForm, Field, FormSection, Select, TextArea } from "@/components/public/InquiryForm";
import { submitAlumniUpdate } from "@/lib/inquiry-actions";

export const metadata = {
  title: "Update Your Information | Chi Chapter",
};

export default function AlumniUpdatePage() {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">Alumni</p>
        <h1 className="text-display mt-2 text-ink">Update Your Information</h1>
        <p className="text-body mt-4 max-w-2xl text-ink-soft">
          Help us keep the alumni directory current so you get invitations to
          reunions, Founders Week, and chapter events. Fill in only what has
          changed — everything except your name and email is optional.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14 pb-24">
        <ScarletRule />
        <div className="mt-2 max-w-3xl border border-border-light bg-card-bg p-6 sm:p-8">
          <InquiryForm action={submitAlumniUpdate} submitLabel="Submit update">
            <FormSection>About You</FormSection>
            <Field name="name" label="Full name" required autoComplete="name" wide />
            <Field name="initiation_year" label="Initiation year" inputMode="numeric" placeholder="2015" maxLength={4} />
            <Field name="graduation_year" label="Graduation year" inputMode="numeric" placeholder="2018" maxLength={4} />

            <FormSection>Contact</FormSection>
            <Field name="email" label="Email" type="email" required autoComplete="email" />
            <Field name="phone" label="Mobile phone" type="tel" autoComplete="tel" />

            <FormSection>Mailing Address</FormSection>
            <Select name="address_type" label="Address type" options={["Home", "Business", "Seasonal"]} wide />
            <Field name="address" label="Street address" autoComplete="street-address" wide />
            <Field name="city" label="City" autoComplete="address-level2" />
            <div className="grid grid-cols-2 gap-5">
              <Field name="state" label="State" autoComplete="address-level1" maxLength={20} />
              <Field name="zip" label="ZIP" autoComplete="postal-code" inputMode="numeric" maxLength={10} />
            </div>

            <FormSection>Career</FormSection>
            <Field name="employer" label="Employer" autoComplete="organization" />
            <Field name="job_title" label="Job title" autoComplete="organization-title" />
            <Field name="linkedin" label="LinkedIn URL" type="url" placeholder="https://linkedin.com/in/…" wide />

            <TextArea
              name="notes"
              label="Anything else?"
              rows={4}
              placeholder="Spouse or kids' names, a business email, an old number to remove, news you'd like shared…"
            />
          </InquiryForm>
        </div>
      </div>
    </div>
  );
}
