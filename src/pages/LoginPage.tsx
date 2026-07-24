import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";
import { AuthShell } from "../components/devbraid/auth-shell";
import { PasswordInput } from "../components/devbraid/password-input";
import {
  FieldError,
  FieldLabel,
  FormAlert,
  SubmitButton,
  TextInput,
} from "../components/devbraid/auth-form";
import { Github } from "lucide-react";

const schema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Enter your email address." })
    .email({ message: "Enter a valid email address." })
    .max(255),
  password: z
    .string()
    .nonempty({ message: "Enter your password." })
    .max(200),
});

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
      });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      toast.success("Welcome back", {
        description: "Signed in to your DevBraid workspace.",
      });
      window.location.href = "/dashboard";
    } catch (err: any) {
      setFormError(getErrorMessage(err, "Invalid credentials or server error."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back to DevBraid."
      subtitle="Continue where you left off — your change threads, decision notes, and evidence panels are waiting."
      footer={
        <>
          New to DevBraid?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-foreground hover:text-primary"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {formError && <FormAlert tone="error">{formError}</FormAlert>}

        <div>
          <FieldLabel htmlFor="email">Work email</FieldLabel>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            invalid={!!errors.email}
            aria-invalid={!!errors.email}
            required
          />
          <FieldError>{errors.email}</FieldError>
        </div>

        <div>
          <FieldLabel
            htmlFor="password"
            hint={
              <Link
                to="/auth/forgot"
                className="text-muted-foreground hover:text-foreground"
              >
                Forgot?
              </Link>
            }
          >
            Password
          </FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            invalid={!!errors.password}
            aria-invalid={!!errors.password}
            required
          />
          <FieldError>{errors.password}</FieldError>
        </div>

        <SubmitButton type="submit" loading={loading}>
          Sign in
        </SubmitButton>

        <div className="relative py-1 text-center">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline" />
          <span className="relative bg-background px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            toast("Provider sign-in", {
              description: "GitHub OAuth flow will be connected.",
            })
          }
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-hairline bg-surface/50 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          <Github className="size-4" />
          Continue with GitHub
        </button>
      </form>
    </AuthShell>
  );
}
