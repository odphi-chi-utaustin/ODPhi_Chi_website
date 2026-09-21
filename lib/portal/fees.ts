// Stripe US pricing. The fee is grossed up so the chapter nets the full charge:
//   total = (amount + fixed) / (1 - pct)
export type PayMethod = "bank" | "card";

const rates = {
  bank: { pct: 0.008, fixed: 0, cap: 500 }, // ACH: 0.8%, capped at $5
  card: { pct: 0.029, fixed: 30, cap: Infinity }, // 2.9% + 30¢
} as const;

export function feeFor(amountCents: number, method: PayMethod) {
  const { pct, fixed, cap } = rates[method];
  const grossed = Math.ceil((amountCents + fixed) / (1 - pct)) - amountCents;
  return Math.min(grossed, cap);
}

export const methodLabel: Record<PayMethod, string> = {
  bank: "Pay by bank",
  card: "Pay by card",
};
