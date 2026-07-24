import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ReactNode, InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
      >
        {children}
      </label>
      {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-surface/50 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors",
        "focus:border-primary/60 focus:bg-surface focus:ring-2 focus:ring-primary/20",
        invalid
          ? "border-rose-500/60"
          : "border-hairline hover:border-hairline/80",
        className,
      )}
      {...props}
    />
  ),
);
TextInput.displayName = "TextInput";

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-rose-300">
      <AlertCircle className="size-3" />
      {children}
    </p>
  );
}

export function FormAlert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  const isError = tone === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-xs",
        isError
          ? "border-rose-500/25 bg-rose-500/5 text-rose-200"
          : "border-emerald-500/25 bg-emerald-500/5 text-emerald-200",
      )}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
      )}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function SubmitButton({
  loading,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={cn(
        "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors",
        "hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
