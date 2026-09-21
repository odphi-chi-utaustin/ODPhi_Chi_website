import { cn } from "@/lib/utils";

type CardVariant = "dark" | "light" | "featured" | "pillar";

const variantClasses: Record<CardVariant, string> = {
  dark: "bg-surface border border-elevated text-white",
  light: "bg-card-bg border border-border-light text-ink",
  featured: "bg-scarlet text-white",
  pillar: "bg-card-bg border-t-[3px] border-scarlet text-ink",
};

type CardProps = {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
};

export function Card({ variant = "light", className, children }: CardProps) {
  return (
    <div className={cn("p-6", variantClasses[variant], className)}>
      {children}
    </div>
  );
}
