"use client";

import { useActionState } from "react";
import { subscribe } from "@/lib/newsletter-actions";
import { inputClass } from "@/components/ui/form-styles";
import { cn } from "@/lib/utils";

// Email box + button. `source` records which page someone signed up from.
export function NewsletterSignup({ source }: { source: string }) {
  const [state, formAction, pending] = useActionState(subscribe, undefined);

  if (state?.success) {
    return (
      <p className="border-l-2 border-scarlet bg-card-bg px-5 py-4 text-[15px] text-ink">
        {state.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="source" value={source} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={cn(inputClass, "h-12 w-full text-[15px]")}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="h-12 bg-scarlet px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-scarlet-dark disabled:opacity-60"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-scarlet">{state.error}</p>}
      <p className="text-xs text-muted-light">
        Chapter news and updates from the brothers. Unsubscribe anytime.
      </p>
    </form>
  );
}
