import { Card } from "@/components/ui/Card";
import { requireMember } from "@/lib/portal/auth";
import { getChargesForMember, balanceOf } from "@/lib/portal/queries";
import { formatCents, formatDate } from "@/lib/portal/format";
import { paymentInstructions } from "@/lib/portal/config";
import { PayButtons } from "@/components/portal/PayButtons";
import { passFeesToPayer } from "@/lib/portal/config";
import { ActionForm, inputClass, labelClass } from "@/components/portal/ActionForm";
import { setPassword } from "@/lib/portal/actions";

export const metadata = { title: "My Dues | Chi Chapter" };

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string; canceled?: string }>;
}) {
  const [member, { paid: justPaid, canceled }] = await Promise.all([
    requireMember(),
    searchParams,
  ]);
  const charges = await getChargesForMember(member.id);
  const balance = balanceOf(charges);
  const owed = charges.filter((c) => !c.paid_at && !c.pending_at);
  const pending = charges.filter((c) => !c.paid_at && !!c.pending_at);
  const paid = charges.filter((c) => !!c.paid_at);
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <div className="flex flex-col gap-8">
      {justPaid && (
        <Card variant="featured" className="text-sm">
          Payment received — thank you. Card payments post right away; bank
          transfers show as “processing” for a few business days.
        </Card>
      )}
      {stripeEnabled && passFeesToPayer && owed.length > 0 && (
        <p className="-mt-4 text-xs text-muted-light">
          Online payments add the processor&apos;s fee so the chapter receives the full amount.
          Bank transfer is the cheaper option. Venmo and Zelle have no fee.
        </p>
      )}
      {canceled && (
        <p className="text-sm text-muted-light">Checkout canceled. Nothing was charged.</p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-muted-light">You owe</p>
          <p className="text-display mt-1">{formatCents(balance)}</p>
        </div>
        {stripeEnabled && owed.length > 1 && (
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs uppercase tracking-wider text-muted-light">Pay all {formatCents(balanceOf(owed))}</p>
            <PayButtons amountCents={balanceOf(owed)} size="lg" />
          </div>
        )}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium">Outstanding</h2>
        {owed.length === 0 ? (
          <p className="text-sm text-muted-light">Nothing outstanding. You&apos;re all set.</p>
        ) : (
          <Card className="divide-y divide-border-light p-0">
            {owed.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{c.description}</p>
                  <p className="text-xs text-muted-light">Added {formatDate(c.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">{formatCents(c.amount_cents)}</p>
                  {stripeEnabled && <PayButtons amountCents={c.amount_cents} chargeId={c.id} />}
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>

      {pending.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">Processing</h2>
          <Card className="divide-y divide-border-light p-0">
            {pending.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3 text-muted-light">
                <div>
                  <p className="text-sm">{c.description}</p>
                  <p className="text-xs">Bank transfer started {formatDate(c.pending_at!)} · clears in a few business days</p>
                </div>
                <p className="text-sm">{formatCents(c.amount_cents)}</p>
              </div>
            ))}
          </Card>
        </section>
      )}

      {balance > 0 && (
        <Card variant="light">
          <h2 className="text-lg font-medium">{stripeEnabled ? "Or pay by Venmo / Zelle" : "How to pay"}</h2>
          <dl className="mt-3 grid gap-1 text-sm">
            <div className="flex gap-2">
              <dt className="w-16 text-muted-light">Venmo</dt>
              <dd>{paymentInstructions.venmo}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 text-muted-light">Zelle</dt>
              <dd>{paymentInstructions.zelle}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-muted-light">{paymentInstructions.note}</p>
        </Card>
      )}

      {paid.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">Paid</h2>
          <Card className="divide-y divide-border-light p-0">
            {paid.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-5 py-3 text-muted-light"
              >
                <div>
                  <p className="text-sm">{c.description}</p>
                  <p className="text-xs">Paid {formatDate(c.paid_at!)}</p>
                </div>
                <p className="text-sm">{formatCents(c.amount_cents)}</p>
              </div>
            ))}
          </Card>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-medium">Password</h2>
        <Card>
          <p className="mb-4 text-sm text-muted-light">
            Set a password to sign in without waiting for an email link.
          </p>
          <ActionForm action={setPassword} submitLabel="Save password">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>New password</label>
                <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Confirm</label>
                <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
              </div>
            </div>
          </ActionForm>
        </Card>
      </section>
    </div>
  );
}
