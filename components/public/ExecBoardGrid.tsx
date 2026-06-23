import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import type { MockExecMember } from "@/lib/mock-data";

type ExecBoardGridProps = {
  members: MockExecMember[];
  variant?: "dark" | "light";
};

export function ExecBoardGrid({ members, variant = "dark" }: ExecBoardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {members.map((member) => (
        <Card key={member.id} variant={variant} className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-elevated" />
          <p className="mt-4 text-sm font-medium">{member.name}</p>
          <p
            className={cn(
              "text-label mt-1",
              variant === "light" ? "text-muted-light" : "text-muted"
            )}
          >
            {member.title}
          </p>
        </Card>
      ))}
    </div>
  );
}
