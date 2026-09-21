import { cn } from "@/lib/utils";

type BadgeVariant =
  | "active-dark"
  | "active-light"
  | "pledge"
  | "exec"
  | "alumni";

const variantClasses: Record<BadgeVariant, string> = {
  "active-dark": "bg-scarlet-ghost text-rose border border-scarlet-dark",
  "active-light": "bg-scarlet-tint text-scarlet-dark border border-rose",
  pledge: "bg-elevated text-silver border border-elevated",
  exec: "bg-scarlet text-white border border-scarlet",
  alumni: "bg-transparent text-muted border border-elevated",
};

const baseClasses =
  "inline-flex items-center px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]";

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ variant = "active-dark", className, children }: BadgeProps) {
  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
}
