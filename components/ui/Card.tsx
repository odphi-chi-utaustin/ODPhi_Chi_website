import { cn } from "@/lib/utils";

type CardVariant = "dark" | "light" | "featured";

const variantClasses: Record<CardVariant, string> = {
  dark: "bg-surface border border-elevated text-white",
  light: "bg-card-bg border border-border-light text-ink",
  featured: "bg-scarlet text-white",
};

type CardProps = {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
};

export function Card({ variant = "light", className, children }: CardProps) {
  return (
    <div className={cn("rounded-xl p-5", variantClasses[variant], className)}>
      {children}
    </div>
  );
}
