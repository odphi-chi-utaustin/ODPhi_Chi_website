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
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-scarlet text-white"
                : "border border-elevated text-muted hover:text-white"
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
