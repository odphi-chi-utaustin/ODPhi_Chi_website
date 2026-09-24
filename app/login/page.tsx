import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/portal/LoginForm";

export const metadata = { title: "Member Login | Chi Chapter" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-medium tracking-tight">Member Login</h1>
      <p className="mt-2 text-sm text-muted-light">
        Sign in with your password, or enter the email on the chapter roster and we&apos;ll send you a sign-in link.
      </p>
      {error === "expired" && (
        <p className="mt-4 text-sm text-scarlet">
          That link expired, was already used, or was opened on a different device than the one that requested it. Request a new one below and open it here.
        </p>
      )}
      <Card className="mt-6">
        <LoginForm />
      </Card>
    </div>
  );
}
