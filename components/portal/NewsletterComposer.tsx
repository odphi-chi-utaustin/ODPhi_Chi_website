"use client";

import { useActionState } from "react";
import { sendNewsletter } from "@/lib/newsletter-actions";
import { inputClass, labelClass } from "@/components/ui/form-styles";

// Compose an issue. "Send test" mails only you; "Send" asks first, then mails the list
// and clears the form so the same issue can't go out twice by accident.
export function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const [state, formAction, pending] = useActionState(sendNewsletter, undefined);

  return (
    <form key={state?.sentAt} action={formAction} className="flex flex-col gap-3">
      <label className={labelClass} htmlFor="nl-subject">Subject</label>
      <input
        id="nl-subject"
        name="subject"
        required
        maxLength={200}
        placeholder="Fall 2026 Chapter Update"
        className={inputClass}
      />

      <label className={labelClass} htmlFor="nl-body">Newsletter</label>
      <textarea
        id="nl-body"
        name="body"
        required
        rows={14}
        placeholder={"Leave a blank line between paragraphs.\n\nPaste links in as-is (starting with https://) and they become clickable."}
        className="border border-border-light bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-scarlet"
      />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="post_to_news" defaultChecked className="h-4 w-4 accent-scarlet" />
        Also post it on the public News page (keeps an archive of past issues)
      </label>

      {state?.error && <p className="text-sm text-scarlet">{state.error}</p>}
      {state?.success && <p className="text-sm text-muted-light">{state.success}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="test"
          disabled={pending}
          className="h-11 border border-scarlet px-5 text-xs font-semibold uppercase tracking-[0.14em] text-scarlet transition-colors hover:bg-scarlet hover:text-white disabled:opacity-60"
        >
          Send test to me
        </button>
        <button
          type="submit"
          name="intent"
          value="send"
          disabled={pending || subscriberCount === 0}
          onClick={(e) => {
            if (!window.confirm(`Send this newsletter to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}? This can't be undone.`)) {
              e.preventDefault();
            }
          }}
          className="h-11 bg-scarlet px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-scarlet-dark disabled:opacity-60"
        >
          {pending ? "Sending…" : `Send to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`}
        </button>
      </div>
    </form>
  );
}
