"use client";

import Script from "next/script";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// Instagram's official embed: a blockquote per post that embed.js swaps for an iframe.
// Each iframe is at least 326px wide, hence the late grid breakpoints.
// onReady re-runs process() after client-side navigations, when the script is already loaded.
export function InstagramFeed({ posts }: { posts: string[] }) {
  return (
    <>
      <div className="mt-8 grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((url) => (
          <blockquote
            key={url}
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ margin: 0, minWidth: 0, maxWidth: "100%", width: "100%" }}
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              View this post on Instagram
            </a>
          </blockquote>
        ))}
      </div>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onReady={() => window.instgrm?.Embeds.process()}
      />
    </>
  );
}
