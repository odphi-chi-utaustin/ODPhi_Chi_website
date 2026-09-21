"use client";

// A form that asks before submitting. For the handful of destructive exec actions.
export function ConfirmForm({
  action,
  message,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  message: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
