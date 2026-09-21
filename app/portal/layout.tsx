import Link from "next/link";
import { requireMember, isExec } from "@/lib/portal/auth";
import { signOut } from "@/lib/portal/actions";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await requireMember();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border-light pb-4">
        <div className="flex items-center gap-6 text-sm">
          <Link href="/portal" className="font-medium hover:text-scarlet">
            My Dues
          </Link>
          {isExec(member) && (
            <Link href="/portal/exec" className="font-medium hover:text-scarlet">
              Exec
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-light">
          <span>{member.name}</span>
          <form action={signOut}>
            <button type="submit" className="hover:text-scarlet">
              Sign out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
