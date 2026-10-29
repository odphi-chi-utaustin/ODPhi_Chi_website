import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Submissions from the public forms, read in /portal/inbox.
export type InquiryKind = "contact" | "alumni_update" | "referral";

export const INQUIRY_LABELS: Record<InquiryKind, string> = {
  contact: "Contact",
  alumni_update: "Alumni update",
  referral: "Recruitment referral",
};

export type Inquiry = {
  id: string;
  kind: InquiryKind;
  name: string;
  email: string;
  phone: string;
  fields: { label: string; value: string }[];
  handled_at: string | null;
  created_at: string;
};

// Every form field beyond name/email/phone, as [form name, label shown to exec].
// Order here is the order exec sees them in.
export const INQUIRY_FIELDS: Record<InquiryKind, [string, string][]> = {
  contact: [
    ["topic", "Topic"],
    ["message", "Message"],
  ],
  alumni_update: [
    ["initiation_year", "Initiation year"],
    ["graduation_year", "Graduation year"],
    ["address_type", "Address type"],
    ["address", "Street address"],
    ["city", "City"],
    ["state", "State"],
    ["zip", "ZIP"],
    ["employer", "Employer"],
    ["job_title", "Job title"],
    ["linkedin", "LinkedIn"],
    ["notes", "Other updates"],
  ],
  referral: [
    ["relationship", "Referrer is"],
    ["candidate_name", "Candidate name"],
    ["candidate_email", "Candidate email"],
    ["candidate_phone", "Candidate phone"],
    ["candidate_school", "High school / current school"],
    ["candidate_year", "Starting at UT"],
    ["notes", "Why he'd be a good fit"],
  ],
};

export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("inquiries")
    .select("id, kind, name, email, phone, fields, handled_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data as Inquiry[];
}
