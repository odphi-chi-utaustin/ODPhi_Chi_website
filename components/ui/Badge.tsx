import { cn } from "@/lib/utils";

type BadgeVariant =
  | "active-dark"
  | "active-light"
  | "pledge"
  | "exec"
  | "alumni";

const variantClasses: Record<BadgeVariant, string> = {
  "active-dark": "bg-scarlet-ghost text-scarlet border border-[#3a0a10]",
  "active-light": "bg-scarlet-tint text-scarlet-dark border border-[#f5c4cc]",
  pledge: "bg-elevated text-silver border border-elevated",
  exec: "bg-scarlet text-white border border-scarlet",
  alumni: "bg-transparent text-silver border border-elevated",
};

const baseClasses =
  "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider";

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
