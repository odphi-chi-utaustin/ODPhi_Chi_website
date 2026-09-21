import { cn } from "@/lib/utils";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import type { MockExecMember } from "@/lib/mock-data";

type ExecBoardGridProps = {
  members: MockExecMember[];
  variant?: "dark" | "light";
};

export function ExecBoardGrid({ members, variant = "dark" }: ExecBoardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {members.map((member) => (
        <div key={member.id} className="flex flex-col gap-3">
          <PhotoFrame
            src={member.photoUrl ?? null}
            alt={`${member.name}, ${member.title}`}
            label="Portrait"
            className="aspect-[4/5] w-full"
            position="center 78%"
            sizes="(min-width: 768px) 33vw, 50vw"
          />
          <p className="font-serif text-[22px] leading-tight">{member.name}</p>
          <p
            className={cn(
              "text-label -mt-2",
              variant === "light" ? "text-muted-light" : "text-muted",
            )}
          >
            {member.title}
          </p>
        </div>
      ))}
    </div>
  );
}
