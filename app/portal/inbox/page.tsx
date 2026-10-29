import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConfirmForm } from "@/components/portal/ConfirmForm";
import { requireExec } from "@/lib/portal/auth";
import { formatDate } from "@/lib/portal/format";
import { getInquiries, INQUIRY_LABELS, type Inquiry } from "@/lib/inquiries";
import { setInquiryHandled, deleteInquiry } from "@/lib/inquiry-actions";

export const metadata = { title: "Inbox | Chi Chapter" };

function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const handled = !!inquiry.handled_at;
  return (
    <Card className={handled ? "opacity-70" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-medium">{inquiry.name}</p>
            <Badge variant={inquiry.kind === "referral" ? "active-light" : "alumni"}>
              {INQUIRY_LABELS[inquiry.kind]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-light">
            {inquiry.email && (
              <a href={`mailto:${inquiry.email}`} className="text-scarlet hover:underline">
                {inquiry.email}
              </a>
            )}
            {inquiry.phone && ` · ${inquiry.phone}`}
            {` · ${formatDate(inquiry.created_at)}`}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <form action={setInquiryHandled}>
            <input type="hidden" name="id" value={inquiry.id} />
            <input type="hidden" name="handled" value={handled ? "false" : "true"} />
            <button type="submit" className="text-scarlet hover:underline">
              {handled ? "Reopen" : "Mark handled"}
            </button>
          </form>
          <ConfirmForm action={deleteInquiry} message={`Delete the submission from ${inquiry.name}?`}>
            <input type="hidden" name="id" value={inquiry.id} />
            <button type="submit" className="text-muted-light hover:text-scarlet">Delete</button>
          </ConfirmForm>
        </div>
      </div>
      {inquiry.fields.length > 0 && (
        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
          {inquiry.fields.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-muted-light">{f.label}</dt>
              <dd className="whitespace-pre-line">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  );
}

export default async function InboxPage() {
  await requireExec();
  const inquiries = await getInquiries();
  const open = inquiries.filter((i) => !i.handled_at);
  const handled = inquiries.filter((i) => !!i.handled_at);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-1 text-lg font-medium">Inbox</h2>
        <p className="mb-4 text-sm text-muted-light">
          Contact messages, alumni info updates, and recruitment referrals from the public site.
        </p>
        {open.length === 0 ? (
          <p className="text-sm text-muted-light">Nothing waiting. You&apos;re all caught up.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {open.map((i) => (
              <InquiryCard key={i.id} inquiry={i} />
            ))}
          </div>
        )}
      </section>

      {handled.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-medium">Handled</h2>
          <div className="flex flex-col gap-4">
            {handled.map((i) => (
              <InquiryCard key={i.id} inquiry={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
