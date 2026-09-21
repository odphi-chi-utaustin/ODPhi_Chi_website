import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScarletRule } from "@/components/ui/ScarletRule";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { HeroSection } from "@/components/public/HeroSection";
import { ExecBoardGrid } from "@/components/public/ExecBoardGrid";
import { NewsCard } from "@/components/public/NewsCard";
import { mockExecBoard, mockNewsPosts } from "@/lib/mock-data";
import { photos } from "@/lib/photos";

const stats = [
  { value: "1998", label: "Chartered at Texas" },
  { value: "32", label: "Active Brothers" },
  { value: "4", label: "Founding Pillars" },
];

const pillars = [
  {
    name: "Brotherhood",
    text: "A bond across every culture and background that outlasts campus.",
  },
  {
    name: "Leadership",
    text: "Brothers who step up in the chapter, on campus, and in their careers.",
  },
  {
    name: "Scholarship",
    text: "A GPA standard, study halls, and mentorship every semester.",
  },
  {
    name: "Service",
    text: "Hundreds of hours a year with partners across Austin.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Stats band */}
      <section className="bg-scarlet text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-11 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 border-l border-white/35 pl-6"
            >
              <p className="text-stat">{stat.value}</p>
              <p className="text-label text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About split */}
      <section className="bg-page-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-eyebrow">Who We Are</p>
            <h2 className="text-heading mt-4 text-ink">
              Founded on the principle that brotherhood transcends background.
            </h2>
            <p className="text-body mt-5 text-ink-soft">
              The Chi Chapter was chartered at The University of Texas at
              Austin in 1998. Nearly three decades later, we remain a home for
              men of every culture who share one standard: to lead, to serve,
              and to lift each other up.
            </p>
            <Button href="/about" variant="ghost" className="mt-6">
              Read our full story <span aria-hidden="true">→</span>
            </Button>
          </div>
          <div className="relative">
            <PhotoFrame
              src={photos.about}
              alt="Founding class of the Chi Chapter"
              label="Photo — founding class or crest"
              className="aspect-[4/3] w-full md:h-[440px]"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 h-28 w-28 border border-scarlet"
            />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-page-bg">
        <div className="mx-auto max-w-6xl px-6 pb-24">
          <p className="text-eyebrow">Our Four Pillars</p>
          <h2 className="text-heading mt-3 text-ink">
            What every brother stands on
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {pillars.map((pillar) => (
              <Card key={pillar.name} variant="pillar" className="min-h-[200px] p-7">
                <p className="font-serif text-[26px]">{pillar.name}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {pillar.text}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Exec board */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-eyebrow text-rose">Leadership</p>
          <h2 className="text-heading mt-3">Executive Board</h2>
          <div className="mt-9">
            <ExecBoardGrid members={mockExecBoard} variant="dark" />
          </div>
          <Button href="/about" variant="secondary-dark" className="mt-10">
            View full board
          </Button>
        </div>
      </section>

      {/* News */}
      <section className="bg-surface-light">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow">Latest</p>
              <h2 className="text-heading mt-3 text-ink">News &amp; Spotlights</h2>
            </div>
            <Button href="/news" variant="ghost">
              All news <span aria-hidden="true">→</span>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {mockNewsPosts.slice(0, 3).map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-page-bg">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
          <ScarletRule className="mb-6" />
          <h2 className="text-heading max-w-2xl text-ink">
            Rush begins every fall and spring. Come meet the brothers.
          </h2>
          <Button href="/membership" variant="primary" className="mt-8">
            Rush Information
          </Button>
        </div>
      </section>
    </>
  );
}
