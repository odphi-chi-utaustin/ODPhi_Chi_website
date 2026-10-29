import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ScarletRule } from "@/components/ui/ScarletRule";
import { unsubscribe } from "@/lib/newsletter-actions";

export const metadata = {
  title: "Unsubscribe | Chi Chapter",
  robots: { index: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string }>;
}) {
  const { token, done } = await searchParams;

  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <ScarletRule className="mx-auto mb-6" />
        {done ? (
          <>
            <h1 className="text-heading text-ink">You&apos;re unsubscribed.</h1>
            <p className="text-body mt-4 text-ink-soft">
              You won&apos;t get the newsletter anymore. Changed your mind? You
              can sign up again on our{" "}
              <Link href="/news" className="text-scarlet hover:text-scarlet-dark">
                news page
              </Link>
              .
            </p>
          </>
        ) : token ? (
          <>
            <h1 className="text-heading text-ink">Unsubscribe from the newsletter?</h1>
            <p className="text-body mt-4 text-ink-soft">
              You&apos;ll stop getting Chi Chapter newsletters at this address.
            </p>
            <form action={unsubscribe} className="mt-8">
              <input type="hidden" name="token" value={token} />
              <Button type="submit">Unsubscribe</Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-heading text-ink">Unsubscribe</h1>
            <p className="text-body mt-4 text-ink-soft">
              Use the unsubscribe link at the bottom of any newsletter email, or{" "}
              <Link href="/contact" className="text-scarlet hover:text-scarlet-dark">
                contact us
              </Link>{" "}
              and we&apos;ll take you off the list.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
