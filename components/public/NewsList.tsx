"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { NewsCard } from "@/components/public/NewsCard";
import type { MockNewsPost } from "@/lib/mock-data";

const tabs: { key: "all" | MockNewsPost["type"]; label: string }[] = [
  { key: "all", label: "All" },
  { key: "spotlight", label: "Alumni Spotlights" },
  { key: "newsletter", label: "Newsletters" },
];

export function NewsList({ posts }: { posts: MockNewsPost[] }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("all");

  const filtered =
    activeTab === "all" ? posts : posts.filter((post) => post.type === activeTab);

  return (
    <div>
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "h-11 px-4 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors",
              activeTab === tab.key
                ? "bg-scarlet text-white"
                : "border border-border-light text-muted-light hover:border-scarlet hover:text-scarlet"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {filtered.map((post) => (
          <NewsCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
