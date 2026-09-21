import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary-dark" | "secondary-light" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-scarlet text-white hover:bg-scarlet-dark",
  "secondary-dark":
    "bg-transparent text-white border border-white/60 hover:border-white hover:bg-white/10",
  "secondary-light":
    "bg-transparent text-scarlet border border-scarlet hover:bg-scarlet hover:text-white",
  ghost: "bg-transparent text-scarlet hover:text-scarlet-dark px-0",
};

const baseClasses =
  "inline-flex h-12 items-center justify-center gap-2 px-6 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors";

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
