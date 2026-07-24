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
const schema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty({ message: "Enter your name." })
      .max(80, { message: "Name is too long." }),
    email: z
      .string()
      .trim()
      .nonempty({ message: "Enter your work email." })
      .email({ message: "Enter a valid email address." })
      .max(255),
    password: z
      .string()
      .min(8, { message: "At least 8 characters." })
      .max(200),
    confirm: z.string().nonempty({ message: "Confirm your password." }),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords don't match.",
  });

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(values.password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        password: flat.password?.[0],
        confirm: flat.confirm?.[0],
      });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await register({
        fullName: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      toast.success("Workspace created", {
        description: "Welcome to your new DevBraid workspace.",
      });
      window.location.href = "/dashboard";
    } catch (err: any) {
      setFormError(getErrorMessage(err, "Couldn't create your account. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Create workspace"
      title="Start a DevBraid workspace."
      subtitle="Bring your GitHub organization, capture reasoning as decision notes, and publish evidence-backed briefs."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-foreground hover:text-primary"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {formError && <FormAlert tone="error">{formError}</FormAlert>}

        <div>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <TextInput
            id="name"
            autoComplete="name"
            placeholder="Alex Vane"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            invalid={!!errors.name}
            aria-invalid={!!errors.name}
            required
          />
          <FieldError>{errors.name}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="email">Work email</FieldLabel>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) =>
              setValues((v) => ({ ...v, email: e.target.value }))
            }
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
              values.password && (
                <span
                  className={
                    strength.tone === "strong"
                      ? "text-emerald-300"
                      : strength.tone === "ok"
                        ? "text-primary"
                        : "text-rose-300"
                  }
                >
                  {strength.label}
                </span>
              )
            }
          >
            Password
          </FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={values.password}
            onChange={(e) =>
              setValues((v) => ({ ...v, password: e.target.value }))
            }
            invalid={!!errors.password}
            aria-invalid={!!errors.password}
            required
          />
          <FieldError>{errors.password}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={values.confirm}
            onChange={(e) =>
              setValues((v) => ({ ...v, confirm: e.target.value }))
            }
            invalid={!!errors.confirm}
            aria-invalid={!!errors.confirm}
            required
          />
          <FieldError>{errors.confirm}</FieldError>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          By creating an account you agree to DevBraid's{" "}
          <a href="#" className="text-foreground hover:text-primary">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-foreground hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>

        <SubmitButton type="submit" loading={loading}>
          Create workspace
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

function passwordStrength(pw: string): {
  label: string;
  tone: "weak" | "ok" | "strong";
} {
  if (pw.length === 0) return { label: "", tone: "weak" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score >= 4) return { label: "Strong", tone: "strong" };
  if (score >= 2) return { label: "OK", tone: "ok" };
  return { label: "Weak", tone: "weak" };
}
