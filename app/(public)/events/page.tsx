import Link from "next/link";
import { ScarletRule } from "@/components/ui/ScarletRule";
import { calendarEmbedUrl, calendarPublicUrl } from "@/lib/site";

export const metadata = {
  title: "Calendar | Chi Chapter",
};

export default function EventsPage() {
  return (
    <div className="bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <p className="text-eyebrow">News &amp; Events</p>
        <h1 className="text-display mt-2 text-ink">Chapter Calendar</h1>
        <p className="text-body mt-4 max-w-2xl text-ink-soft">
          Rush events, service projects, Founders Week, and alumni gatherings —
          everything the chapter has coming up.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14 pb-24">
        <ScarletRule />
        {calendarEmbedUrl ? (
          <>
            <iframe
              src={calendarEmbedUrl}
              title="Chi Chapter calendar"
              className="mt-2 h-[640px] w-full border border-border-light bg-white"
            />
            {calendarPublicUrl && (
              <a
                href={calendarPublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-scarlet hover:text-scarlet-dark"
              >
                Add to your calendar →
              </a>
            )}
          </>
        ) : (
          <div className="mt-2 border border-dashed border-border-light bg-card-bg px-6 py-16 text-center">
            <p className="font-serif text-2xl text-ink">The calendar is coming soon.</p>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Until then, follow{" "}
              <a
                href="https://www.instagram.com/texasodphi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-scarlet hover:text-scarlet-dark"
              >
                @texasodphi
              </a>{" "}
              for event announcements, or see{" "}
              <Link href="/membership" className="text-scarlet hover:text-scarlet-dark">
                rush information
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
