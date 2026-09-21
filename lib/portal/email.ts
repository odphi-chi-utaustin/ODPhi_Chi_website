import { Resend } from "resend";
import { emailFrom, paymentInstructions } from "@/lib/portal/config";
import { formatCents } from "@/lib/portal/format";

// Best-effort notifications. Every function is a no-op without RESEND_API_KEY
// and never throws — a failed email must not fail the charge that triggered it.

type ChargeLine = { description: string; amount_cents: number };
type Recipient = { name: string; email: string };

function client() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function firstName(name: string) {
  return name.split(" ")[0] || name;
}

function lines(charges: ChargeLine[]) {
  return charges.map((c) => `  • ${c.description} — ${formatCents(c.amount_cents)}`).join("\n");
}

function footer(portalUrl: string) {
  return [
    `Pay online: ${portalUrl}`,
    `Or Venmo ${paymentInstructions.venmo} / Zelle ${paymentInstructions.zelle} and the treasurer will mark it paid.`,
    "",
    "— Chi Chapter Exec Board",
  ].join("\n");
}

export function newChargeEmail(
  to: Recipient,
  charges: ChargeLine[],
  balanceCents: number,
  portalUrl: string,
) {
  const one = charges.length === 1;
  return {
    from: emailFrom,
    to: to.email,
    subject: one
      ? `New charge: ${charges[0].description} (${formatCents(charges[0].amount_cents)})`
      : `${charges.length} new charges on your account`,
    text: [
      `Hi ${firstName(to.name)},`,
      "",
      one ? "A new charge was added to your account:" : "New charges were added to your account:",
      lines(charges),
      "",
      `Your balance is now ${formatCents(balanceCents)}.`,
      "",
      footer(portalUrl),
    ].join("\n"),
  };
}

export function reminderEmail(
  to: Recipient,
  charges: ChargeLine[],
  balanceCents: number,
  portalUrl: string,
) {
  return {
    from: emailFrom,
    to: to.email,
    subject: `Reminder: you owe ${formatCents(balanceCents)} to the chapter`,
    text: [
      `Hi ${firstName(to.name)},`,
      "",
      `You have ${charges.length} outstanding charge${charges.length === 1 ? "" : "s"} totaling ${formatCents(balanceCents)}:`,
      lines(charges),
      "",
      footer(portalUrl),
    ].join("\n"),
  };
}

type Message = ReturnType<typeof newChargeEmail>;

export async function sendEmails(messages: Message[]): Promise<number> {
  const resend = client();
  if (!resend || messages.length === 0) return 0;
  let sent = 0;
  try {
    // Resend batches up to 100 per call.
    for (let i = 0; i < messages.length; i += 100) {
      const { error } = await resend.batch.send(messages.slice(i, i + 100));
      if (error) console.error("[email] batch failed:", error.message);
      else sent += Math.min(100, messages.length - i);
    }
  } catch (err) {
    console.error("[email] send failed:", err);
  }
  return sent;
}
