import { Button } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { photos } from "@/lib/photos";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[640px] flex-col justify-end text-white">
      <div className="absolute inset-0">
        <PhotoFrame
          src={photos.hero}
          alt="Brothers of the Chi Chapter on the UT Austin Main Mall"
          label="Chapter photo — brothers on the Main Mall"
          className="h-full w-full"
          position="center 35%"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-40">
        <p className="text-eyebrow text-rose">
          Omega Delta Phi Fraternity, Inc. · Est. 1998
        </p>
        <h1 className="text-display mt-5 max-w-3xl">
          One culture. Any race.
          <br />A brotherhood since 1998.
        </h1>
        <p className="text-body mt-6 max-w-xl text-white/80">
          The Chi Chapter at The University of Texas at Austin — leaders built
          on unity, honesty, integrity, and leadership.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/membership" variant="primary">
            Rush Info
          </Button>
          <Button href="/about" variant="secondary-dark">
            Our Story
          </Button>
        </div>
      </div>
    </section>
  );
}
