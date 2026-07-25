import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ className, invalid, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn(
            "h-11 w-full rounded-xl border bg-surface/60 px-4 pr-11 text-base text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200",
            "focus:border-primary/80 focus:bg-surface focus:ring-2 focus:ring-primary/30",
            invalid
              ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-hairline hover:border-hairline/90",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          tabIndex={-1}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
