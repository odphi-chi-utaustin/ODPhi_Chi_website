import { cn } from "@/lib/utils";

type ScarletRuleProps = {
  className?: string;
};

export function ScarletRule({ className }: ScarletRuleProps) {
  return <div className={cn("mb-4 h-0.5 w-12 bg-scarlet", className)} />;
}
