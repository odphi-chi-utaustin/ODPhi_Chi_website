import { Button } from "@/components/ui/Button";
import { ScarletRule } from "@/components/ui/ScarletRule";
import { HeroSection } from "@/components/public/HeroSection";
import { ExecBoardGrid } from "@/components/public/ExecBoardGrid";
import { NewsCard } from "@/components/public/NewsCard";
import { mockExecBoard, mockNewsPosts } from "@/lib/mock-data";

const stats = [
  { value: "1998", label: "Founding Year" },
  { value: "4", label: "Pillars" },
  { value: "32", label: "Current Brothers" },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="bg-black border-t border-elevated">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-8 px-6 py-12 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-display text-white">{stat.value}</p>
              <p className="text-label mt-2 text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-page-bg border-t border-border-light">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScarletRule />
          <p className="text-eyebrow">Who We Are</p>
          <h2 className="text-heading mt-2 text-ink">About the Chi Chapter</h2>
          <p className="text-body mt-4 max-w-2xl text-muted-light">
            The Chi Chapter of Omega Delta Phi Fraternity, Inc. was founded
            at the University of Texas at Austin in 1998 on the principle
            that brotherhood transcends race, background, and culture. We
            build leaders through scholarship, service, and unity.
          </p>
          <Button href="/about" variant="secondary-light" className="mt-6">
            Read our full story
          </Button>
        </div>
      </section>

      <section className="bg-page-bg">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          <ScarletRule />
          <p className="text-eyebrow">Leadership</p>
          <h2 className="text-heading mt-2 text-ink">Executive Board</h2>
          <div className="mt-8">
            <ExecBoardGrid members={mockExecBoard} variant="light" />
          </div>
          <Button href="/about" variant="secondary-light" className="mt-6">
            View full board
          </Button>
        </div>
      </section>

      <section className="bg-black border-t border-elevated">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScarletRule />
          <p className="text-eyebrow">Latest</p>
          <h2 className="text-heading mt-2 text-white">News &amp; Spotlights</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {mockNewsPosts.slice(0, 3).map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
          <Button href="/news" variant="secondary-dark" className="mt-6">
            View all news
          </Button>
        </div>
      </section>

      <section className="bg-black border-t border-elevated">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <ScarletRule className="mx-auto" />
          <h2 className="text-heading text-white">
            Ready to join the brotherhood?
          </h2>
          <p className="text-body mt-4 text-silver">
            Rush events kick off every fall and spring semester. Come meet
            the brothers.
          </p>
          <Button href="/membership" variant="primary" className="mt-6">
            Rush Info →
          </Button>
        </div>
      </section>
    </>
  );
}
