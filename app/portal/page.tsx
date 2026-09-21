import { Card } from "@/components/ui/Card";
import { requireMember } from "@/lib/portal/auth";
import { getChargesForMember, balanceOf } from "@/lib/portal/queries";
import { formatCents, formatDate } from "@/lib/portal/format";
import { paymentInstructions } from "@/lib/portal/config";
import { startCheckout } from "@/lib/portal/payments";
import { Button } from "@/components/ui/Button";

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
  const owed = charges.filter((c) => c.paid_at === null && c.pending_at === null);
  const pending = charges.filter((c) => c.paid_at === null && c.pending_at !== null);
  const paid = charges.filter((c) => c.paid_at !== null);
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <div className="flex flex-col gap-8">
      {justPaid && (
        <Card variant="featured" className="text-sm">
          Payment received — thank you. Card payments post right away; bank
          transfers show as “processing” for a few business days.
        </Card>
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
          <form action={startCheckout}>
            <Button type="submit">Pay all {formatCents(balanceOf(owed))}</Button>
          </form>
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
                  {stripeEnabled && (
                    <form action={startCheckout}>
                      <input type="hidden" name="charge_id" value={c.id} />
                      <button type="submit" className="text-sm font-semibold text-scarlet hover:underline">
                        Pay
                      </button>
                    </form>
                  )}
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
    </div>
  );
}
