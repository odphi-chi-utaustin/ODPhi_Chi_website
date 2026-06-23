import { cn } from "@/lib/utils";

type ScarletRuleProps = {
  className?: string;
};

export function ScarletRule({ className }: ScarletRuleProps) {
  return <div className={cn("h-0.5 w-10 rounded bg-scarlet mb-3", className)} />;
}
