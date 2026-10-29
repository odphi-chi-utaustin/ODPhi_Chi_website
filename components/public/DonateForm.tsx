"use client";

import { useActionState, useState } from "react";
import { startDonation } from "@/lib/donations";
import { donationFunds, donationPresets } from "@/lib/site";
import { feeFor } from "@/lib/portal/fees";
import { formatCents, parseDollars } from "@/lib/portal/format";
import { inputClass, labelClass } from "@/components/ui/form-styles";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function DonateForm() {
  const [state, formAction, pending] = useActionState(startDonation, undefined);
  const [amount, setAmount] = useState(String(donationPresets[1] ?? ""));
  const [coverFees, setCoverFees] = useState(true);

  const cents = parseDollars(amount) ?? 0;
  const fee = cents >= 500 ? feeFor(cents, "card") : 0;
  const total = cents + (coverFees ? fee : 0);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className={labelClass}>Amount</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {donationPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={amount === String(preset)}
              onClick={() => setAmount(String(preset))}
              className={cn(
                "h-12 border text-base font-semibold transition-colors",
                amount === String(preset)
                  ? "border-scarlet bg-scarlet text-white"
                  : "border-border-light bg-white text-ink hover:border-scarlet",
              )}
            >
              ${preset}
            </button>
          ))}
        </div>
        <label className="relative mt-1">
          <span className="sr-only">Other amount in dollars</span>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-light">
            $
          </span>
          <input
            name="amount"
            inputMode="decimal"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Other amount"
            className={cn(inputClass, "w-full pl-7")}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Direct my gift to</span>
        <select name="fund" defaultValue={donationFunds[0].value} className={inputClass}>
          {donationFunds.map((fund) => (
            <option key={fund.value} value={fund.value}>
              {fund.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="cover_fees"
          checked={coverFees}
          onChange={(e) => setCoverFees(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-scarlet"
        />
        <span>
          Add {fee > 0 ? formatCents(fee) : "the processing fee"} so the chapter
          receives my full gift.
        </span>
      </label>

      {state?.error && <p className="text-sm text-scarlet">{state.error}</p>}

      <Button type="submit" disabled={pending} className="disabled:opacity-60">
        {pending ? "Opening checkout…" : total > 0 ? `Give ${formatCents(total)}` : "Give"}
      </Button>
      <p className="-mt-3 text-xs text-muted-light">
        Secure checkout by Stripe. You&apos;ll get an emailed receipt.
      </p>
    </form>
  );
}
