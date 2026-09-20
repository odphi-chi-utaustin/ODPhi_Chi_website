import { Card } from "@/components/ui/Card";
import { requireMember } from "@/lib/portal/auth";
import { getChargesForMember, balanceOf } from "@/lib/portal/queries";
import { formatCents, formatDate } from "@/lib/portal/format";
import { paymentInstructions } from "@/lib/portal/config";

export const metadata = { title: "My Dues | Chi Chapter" };

export default async function PortalPage() {
  const member = await requireMember();
  const charges = await getChargesForMember(member.id);
  const balance = balanceOf(charges);
  const owed = charges.filter((c) => c.paid_at === null);
  const paid = charges.filter((c) => c.paid_at !== null);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm uppercase tracking-wider text-muted-light">You owe</p>
        <p className="text-display mt-1">{formatCents(balance)}</p>
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
                <p className="text-sm font-medium">{formatCents(c.amount_cents)}</p>
              </div>
            ))}
          </Card>
        )}
      </section>

      {balance > 0 && (
        <Card variant="light">
          <h2 className="text-lg font-medium">How to pay</h2>
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
