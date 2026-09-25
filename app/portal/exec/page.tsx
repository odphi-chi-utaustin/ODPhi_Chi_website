import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ActionForm, inputClass, labelClass } from "@/components/portal/ActionForm";
import { ConfirmForm } from "@/components/portal/ConfirmForm";
import {
  requireExec,
  canCharge,
  isRosterAdmin,
  canEditMember,
  grantableRoles,
  ROLE_LABELS,
} from "@/lib/portal/auth";
import { getRosterWithBalances, getAllCharges } from "@/lib/portal/queries";
import { formatCents, formatDate } from "@/lib/portal/format";
import {
  addCharge,
  chargeAllActives,
  markPaid,
  markUnpaid,
  deleteCharge,
  addMember,
  setMemberActive,
  setMemberRole,
  removeMember,
  setMemberPassword,
} from "@/lib/portal/actions";

export const metadata = { title: "Exec | Chi Chapter" };

export default async function ExecPage() {
  const me = await requireExec();
  const charger = canCharge(me);
  const rosterAdmin = isRosterAdmin(me);
  const roles = grantableRoles(me);
  const [roster, charges] = await Promise.all([getRosterWithBalances(), getAllCharges()]);
  const actives = roster.filter((m) => m.active);
  const totalOwed = roster.reduce((s, m) => s + m.balance_cents, 0);
  const outstanding = charges.filter((c) => !c.paid_at);
  const settled = charges.filter((c) => !!c.paid_at).slice(0, 25);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-sm uppercase tracking-wider text-muted-light">Total outstanding</p>
        <p className="text-display mt-1">{formatCents(totalOwed)}</p>
        <p className="mt-1 text-sm text-muted-light">
          {roster.filter((m) => m.balance_cents > 0).length} of {actives.length} active members owe something.
          {" "}{roster.filter((m) => !m.last_sign_in_at).length} on the roster have never signed in.
        </p>
      </div>

      {charger && (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-medium">Charge one member</h2>
          <ActionForm action={addCharge} submitLabel="Add charge">
            <label className={labelClass}>Member</label>
            <select name="member_id" required className={inputClass} defaultValue="">
              <option value="" disabled>Select…</option>
              {roster.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}{m.active ? "" : " (inactive)"}
                </option>
              ))}
            </select>
            <label className={labelClass}>Description</label>
            <input name="description" required placeholder="Missed chapter 9/8" className={inputClass} />
            <label className={labelClass}>Amount ($)</label>
            <input name="amount" required inputMode="decimal" placeholder="25" className={inputClass} />
          </ActionForm>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-medium">Charge all actives</h2>
          <ActionForm action={chargeAllActives} submitLabel={`Charge ${actives.length} members`}>
            <label className={labelClass}>Description</label>
            <input name="description" required placeholder="Fall 2026 dues" className={inputClass} />
            <label className={labelClass}>Amount each ($)</label>
            <input name="amount" required inputMode="decimal" placeholder="300" className={inputClass} />
          </ActionForm>
        </Card>
      </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-medium">Outstanding charges</h2>
        {outstanding.length === 0 ? (
          <p className="text-sm text-muted-light">Nothing outstanding.</p>
        ) : (
          <Card className="divide-y divide-border-light p-0">
            {outstanding.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {c.member_name} <span className="text-muted-light">·</span> {c.description}
                  </p>
                  <p className="text-xs text-muted-light">
                    Added {formatDate(c.created_at)}
                    {c.pending_at && " · bank transfer processing"}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">{formatCents(c.amount_cents)}</span>
                  {charger && (
                    <>
                      <form action={markPaid}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="text-scarlet hover:underline">Mark paid</button>
                      </form>
                      <form action={deleteCharge}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="text-muted-light hover:text-scarlet">Delete</button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Roster</h2>
        <Card className="divide-y divide-border-light p-0">
          {roster.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-light">{m.email}</p>
                </div>
                {m.role !== "member" && <Badge variant="exec">{ROLE_LABELS[m.role]}</Badge>}
                {!m.active && <Badge variant="alumni">Inactive</Badge>}
                {!m.last_sign_in_at && <Badge variant="active-light">Never signed in</Badge>}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={m.balance_cents > 0 ? "font-medium" : "text-muted-light"}>
                  {formatCents(m.balance_cents)}
                </span>
                {canEditMember(me, m) && (
                  <>
                    <form action={setMemberRole} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={m.id} />
                      <select name="role" defaultValue={m.role} className="h-8 border border-border-light bg-white px-2 text-xs">
                        {roles.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                      <button type="submit" className="text-muted-light hover:text-scarlet">Set role</button>
                    </form>
                    <form action={setMemberActive}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="active" value={m.active ? "false" : "true"} />
                      <button type="submit" className="text-muted-light hover:text-scarlet">
                        {m.active ? "Deactivate" : "Reactivate"}
                      </button>
                    </form>
                  </>
                )}
                {rosterAdmin && m.id !== me.id && (
                  <ConfirmForm
                    action={removeMember}
                    message={`Remove ${m.name} from the roster? This deletes their charges and login. It can't be undone.`}
                  >
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="text-muted-light hover:text-scarlet">Remove</button>
                  </ConfirmForm>
                )}
              </div>
            </div>
          ))}
        </Card>

        <Card className="mt-4">
          <h3 className="mb-4 text-base font-medium">Add member</h3>
          <ActionForm action={addMember} submitLabel="Add & send invite">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Name</label>
                <input name="name" required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Email</label>
                <input name="email" type="email" required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Role</label>
                <select name="role" defaultValue="member" className={inputClass}>
                  {roles.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Temporary password (optional)</label>
              <input name="password" type="password" autoComplete="new-password" minLength={8} className={inputClass} />
              <p className="text-xs text-muted-light">
                Lets them sign in without the email link. They can change it from their dues page.
              </p>
            </div>
          </ActionForm>
        </Card>

        <Card className="mt-4">
          <h3 className="mb-4 text-base font-medium">Set a member&apos;s password</h3>
          <p className="mb-4 text-sm text-muted-light">
            For members with no password yet, or who forgot theirs. Also lifts a lockout.
          </p>
          <ActionForm action={setMemberPassword} submitLabel="Set password">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Member</label>
                <select name="member_id" required className={inputClass} defaultValue="">
                  <option value="" disabled>Select…</option>
                  {roster
                    .filter((m) => canEditMember(me, m))
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}{m.active ? "" : " (inactive)"}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Temporary password</label>
                <input name="password" type="password" required autoComplete="new-password" minLength={8} className={inputClass} />
              </div>
            </div>
          </ActionForm>
        </Card>
      </section>

      {settled.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">Recently paid</h2>
          <Card className="divide-y divide-border-light p-0">
            {settled.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-muted-light">
                <div>
                  <p className="text-sm">{c.member_name} · {c.description}</p>
                  <p className="text-xs">Paid {formatDate(c.paid_at!)}{c.stripe_session_id && " · Stripe"}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{formatCents(c.amount_cents)}</span>
                  {charger && (
                    <form action={markUnpaid}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="hover:text-scarlet">Undo</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}
    </div>
  );
}
