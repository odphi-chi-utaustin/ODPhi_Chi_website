"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/portal/actions";
import { Button } from "@/components/ui/Button";

const inputClass =
  "h-11 border border-border-light bg-white px-3 text-sm outline-none focus:border-scarlet";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);

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
        className={inputClass}
      />
      <label htmlFor="password" className="text-sm font-medium">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        className={inputClass}
      />
      {state?.error && <p className="text-sm text-scarlet">{state.error}</p>}
      <Button
        type="submit"
        name="intent"
        value="password"
        disabled={pending}
        className="disabled:opacity-60"
      >
        {pending ? "Working…" : "Sign in"}
      </Button>
      <Button
        type="submit"
        name="intent"
        value="link"
        variant="secondary-light"
        formNoValidate
        disabled={pending}
        className="disabled:opacity-60"
      >
        No password? Email me a link
      </Button>
    </form>
  );
}
