import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScarletRule } from "@/components/ui/ScarletRule";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col bg-black text-white">
      <div className="absolute right-6 top-6">
        <Badge variant="active-dark">Est. 1998 · X-Rated Chi Chapter</Badge>
      </div>

      <div className="mx-auto flex max-w-6xl flex-1 flex-col items-start justify-center px-6">
        <p className="text-eyebrow">Omega Delta Phi Fraternity, Inc.</p>
        <h1 className="text-display mt-4 max-w-2xl text-white">
          One culture. <span className="text-scarlet">Any race.</span>
        </h1>
        <p className="text-body mt-6 max-w-md text-silver">
          The Chi Chapter at the University of Texas at Austin — building
          brotherhood, scholarship, and service across every background.
        </p>

        <div className="mt-8 flex gap-4">
          <Button href="/membership" variant="primary">
            Rush Info →
          </Button>
          <Button href="/about" variant="secondary-dark">
            Meet the chapter
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-10">
        <ScarletRule />
      </div>
    </section>
  );
}
