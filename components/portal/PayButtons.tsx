import { startCheckout } from "@/lib/portal/payments";
import { passFeesToPayer } from "@/lib/portal/config";
import { feeFor, methodLabel, type PayMethod } from "@/lib/portal/fees";
import { formatCents } from "@/lib/portal/format";
import { cn } from "@/lib/utils";

const methods: PayMethod[] = ["bank", "card"];

// Two forms, one per method, each showing exactly what will be charged.
export function PayButtons({
  amountCents,
  chargeId,
  size = "sm",
}: {
  amountCents: number;
  chargeId?: string;
  size?: "sm" | "lg";
}) {
  return (
    <div className={cn("flex gap-2", size === "lg" ? "flex-wrap" : "flex-col items-end sm:flex-row sm:items-center")}>
      {methods.map((method) => {
        const fee = passFeesToPayer ? feeFor(amountCents, method) : 0;
        return (
          <form key={method} action={startCheckout}>
            {chargeId && <input type="hidden" name="charge_id" value={chargeId} />}
            <input type="hidden" name="method" value={method} />
            <button
              type="submit"
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap font-semibold transition-colors",
                size === "lg"
                  ? "h-12 px-5 text-[13px] uppercase tracking-[0.14em]"
                  : "h-9 px-3 text-xs",
                method === "bank"
                  ? "bg-scarlet text-white hover:bg-scarlet-dark"
                  : "border border-scarlet text-scarlet hover:bg-scarlet hover:text-white",
              )}
            >
              {methodLabel[method]}
              {fee > 0 && (
                <span className={method === "bank" ? "text-white/75" : "opacity-70"}>
                  +{formatCents(fee)}
                </span>
              )}
            </button>
          </form>
        );
      })}
    </div>
  );
}
