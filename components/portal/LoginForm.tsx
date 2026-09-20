"use client";

import { useActionState } from "react";
import { sendMagicLink } from "@/lib/portal/actions";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [state, action, pending] = useActionState(sendMagicLink, undefined);

  if (state?.success) {
    return <p className="text-sm text-ink">{state.success}</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@utexas.edu"
        className="rounded-md border border-border-light bg-white px-3 py-2 text-sm outline-none focus:border-scarlet"
      />
      {state?.error && <p className="text-sm text-scarlet">{state.error}</p>}
      <Button type="submit" disabled={pending} className="disabled:opacity-60">
        {pending ? "Sending…" : "Send sign-in link"}
      </Button>
    </form>
  );
}
