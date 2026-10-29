import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ActionForm } from "@/components/portal/ActionForm";
import { ConfirmForm } from "@/components/portal/ConfirmForm";
import { NewsletterComposer } from "@/components/portal/NewsletterComposer";
import { requireExec } from "@/lib/portal/auth";
import { formatDate } from "@/lib/portal/format";
import { getIssues, getSubscribers } from "@/lib/newsletter";
import { addSubscribers, removeSubscriber } from "@/lib/newsletter-actions";

export const metadata = { title: "Newsletter | Chi Chapter" };

export default async function PortalNewsletterPage() {
  await requireExec();
  const [subscribers, issues] = await Promise.all([getSubscribers(), getIssues()]);
  const active = subscribers.filter((s) => !s.unsubscribed_at);
  const emailReady = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-sm uppercase tracking-wider text-muted-light">Subscribers</p>
        <p className="text-display mt-1">{active.length}</p>
        <p className="mt-1 text-sm text-muted-light">
          People sign up from the Rush, Alumni, and News pages.
          {subscribers.length > active.length &&
            ` ${subscribers.length - active.length} unsubscribed.`}
        </p>
      </div>

      {!emailReady && (
        <Card variant="featured" className="text-sm">
          Email isn&apos;t set up yet, so nothing can send. Add RESEND_API_KEY
          (see supabase/README.md).
        </Card>
      )}

      <Card>
        <h2 className="mb-1 text-lg font-medium">Write a newsletter</h2>
        <p className="mb-4 text-sm text-muted-light">
          Send yourself a test first to see how it looks in an inbox.
        </p>
        <NewsletterComposer subscriberCount={active.length} />
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-medium">Sent</h2>
        {issues.length === 0 ? (
          <p className="text-sm text-muted-light">Nothing sent yet.</p>
        ) : (
          <Card className="divide-y divide-border-light p-0">
            {issues.map((issue) => (
              <div key={issue.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{issue.subject}</p>
                  <p className="text-xs text-muted-light">
                    {formatDate(issue.sent_at)} · {issue.recipient_count} recipient
                    {issue.recipient_count === 1 ? "" : "s"}
                    {issue.sent_by && ` · ${issue.sent_by}`}
                  </p>
                </div>
                {issue.news_slug && (
                  <Link href={`/news/${issue.news_slug}`} className="text-sm text-muted-light hover:text-scarlet">
                    View post
                  </Link>
                )}
              </div>
            ))}
          </Card>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <Card className="self-start">
          <h2 className="mb-1 text-lg font-medium">Add subscribers</h2>
          <p className="mb-4 text-sm text-muted-light">
            Import an existing list. Only add people who asked to hear from the
            chapter. Anyone who unsubscribed stays off.
          </p>
          <ActionForm action={addSubscribers} submitLabel="Add">
            <textarea
              name="emails"
              required
              rows={5}
              placeholder={"one@example.com\ntwo@example.com"}
              className="border border-border-light bg-white px-3 py-2.5 text-sm outline-none focus:border-scarlet"
            />
          </ActionForm>
        </Card>

        <section>
          <h2 className="mb-3 text-lg font-medium">Mailing list</h2>
          {subscribers.length === 0 ? (
            <p className="text-sm text-muted-light">No one yet.</p>
          ) : (
            <Card className="max-h-[480px] divide-y divide-border-light overflow-y-auto p-0">
              {subscribers.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 px-5 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm">{s.email}</p>
                      <p className="text-xs text-muted-light">
                        {formatDate(s.subscribed_at)}
                        {s.source && ` · ${s.source}`}
                      </p>
                    </div>
                    {s.unsubscribed_at && <Badge variant="alumni">Unsubscribed</Badge>}
                  </div>
                  {!s.unsubscribed_at && (
                    <ConfirmForm action={removeSubscriber} message={`Unsubscribe ${s.email}? They can sign up again themselves.`}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="text-sm text-muted-light hover:text-scarlet">
                        Remove
                      </button>
                    </ConfirmForm>
                  )}
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
