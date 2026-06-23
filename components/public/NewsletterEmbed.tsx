export function NewsletterEmbed() {
  const embedUrl = process.env.NEXT_PUBLIC_BEEHIIV_EMBED_URL;

  if (!embedUrl) {
    return (
      <div className="rounded-xl border border-border-light bg-card-bg p-6 text-sm text-muted-light">
        Beehiiv embed not configured. Set NEXT_PUBLIC_BEEHIIV_EMBED_URL.
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      title="Subscribe to the Chi Chapter newsletter"
      className="h-[320px] w-full rounded-xl border border-border-light"
      frameBorder="0"
    />
  );
}
