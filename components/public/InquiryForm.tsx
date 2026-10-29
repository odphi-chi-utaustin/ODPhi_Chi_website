import { ActionForm } from "@/components/portal/ActionForm";
import { inputClass, labelClass } from "@/components/ui/form-styles";
import type { ActionState } from "@/lib/portal/actions";
import { cn } from "@/lib/utils";

// A public form: ActionForm plus a honeypot field bots fill in and people never see.
export function InquiryForm({
  action,
  submitLabel,
  children,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  children: React.ReactNode;
}) {
  return (
    <ActionForm action={action} submitLabel={submitLabel}>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{children}</div>
    </ActionForm>
  );
}

type FieldProps = {
  name: string;
  label: string;
  required?: boolean;
  wide?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

export function Field({ name, label, required, wide, className, ...input }: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", wide && "sm:col-span-2")}>
      <span className={labelClass}>
        {label}
        {required && <span className="text-scarlet"> *</span>}
      </span>
      <input name={name} required={required} className={cn(inputClass, className)} {...input} />
    </label>
  );
}

export function TextArea({
  name,
  label,
  required,
  rows = 5,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 sm:col-span-2">
      <span className={labelClass}>
        {label}
        {required && <span className="text-scarlet"> *</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        maxLength={4000}
        placeholder={placeholder}
        className="border border-border-light bg-white px-3 py-2.5 text-sm outline-none focus:border-scarlet"
      />
    </label>
  );
}

export function Select({
  name,
  label,
  options,
  wide,
}: {
  name: string;
  label: string;
  options: string[];
  wide?: boolean;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", wide && "sm:col-span-2")}>
      <span className={labelClass}>{label}</span>
      <select name={name} defaultValue={options[0]} className={inputClass}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

// Section heading inside a form grid, spanning both columns.
export function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 border-b border-border-light pb-2 font-serif text-xl text-ink sm:col-span-2">
      {children}
    </p>
  );
}
