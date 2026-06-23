import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary-dark" | "secondary-light" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-scarlet text-white hover:bg-scarlet-dark",
  "secondary-dark":
    "bg-transparent text-white border border-elevated hover:bg-elevated",
  "secondary-light":
    "bg-white text-ink border border-border-light hover:bg-surface-light",
  ghost:
    "bg-transparent text-scarlet border border-scarlet hover:bg-scarlet-tint",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors";

type ButtonProps = {
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
