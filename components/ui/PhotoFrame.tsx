import Image from "next/image";
import { cn } from "@/lib/utils";

type PhotoFrameProps = {
  src: string | null;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

// Renders the photo when we have one, otherwise a labelled stand-in so the
// layout reads correctly before photography is shot.
export function PhotoFrame({
  src,
  alt,
  label,
  className,
  sizes = "100vw",
  priority,
}: PhotoFrameProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "photo-placeholder relative overflow-hidden",
        className,
      )}
    >
      <span className="absolute right-4 top-4 border border-dashed border-white/35 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/55">
        {label ?? alt}
      </span>
    </div>
  );
}
