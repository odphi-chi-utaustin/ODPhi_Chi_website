"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/portal/actions";
import { Button } from "@/components/ui/Button";

// Thin wrapper: runs a (state, formData) server action, shows its error/success,
// and resets the fields on success.
export function ActionForm({
  action,
  submitLabel,
  children,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      key={state?.success}
      action={formAction}
      className="flex flex-col gap-3"
    >
      {children}
      {state?.error && <p className="text-sm text-scarlet">{state.error}</p>}
      {state?.success && <p className="text-sm text-muted-light">{state.success}</p>}
      <Button type="submit" disabled={pending} className="self-start disabled:opacity-60">
        {pending ? "Working…" : submitLabel}
      </Button>
    </form>
  );
}

export const inputClass =
  "h-11 border border-border-light bg-white px-3 text-sm outline-none focus:border-scarlet";
export const labelClass = "text-xs font-medium uppercase tracking-wider text-muted-light";
