// Shown to members on /portal. Update when the treasurer changes.
// Sender for notifications. Resend's onboarding address only delivers to the Resend
// account owner; use an address on a verified domain for the real roster.
export const emailFrom = "Chi Chapter <onboarding@resend.dev>";

// When true, online payments add a processing-fee line so the chapter nets the full amount.
export const passFeesToPayer = true;

export const paymentInstructions = {
  venmo: "@odphi-chi",
  zelle: "treasurer@example.com",
  note: "Include your name and what the payment is for in the memo. The treasurer marks it paid once it lands.",
};
