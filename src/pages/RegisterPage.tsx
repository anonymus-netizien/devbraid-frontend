import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";
import { AuthShell } from "../components/devbraid/auth-shell";
import { PasswordInput } from "../components/devbraid/password-input";
import { OtpInput } from "../components/devbraid/otp-input";
import {
  FieldError,
  FieldLabel,
  FormAlert,
  SubmitButton,
  TextInput,
} from "../components/devbraid/auth-form";

const step1Schema = z
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

type Step1Errors = Partial<Record<keyof z.infer<typeof step1Schema>, string>>;

export function RegisterPage() {
  const { register, sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Step1Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(values.password);

  async function onSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = step1Schema.safeParse(values);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({ name: flat.name?.[0], email: flat.email?.[0], password: flat.password?.[0], confirm: flat.confirm?.[0] });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await sendOtp(values.email.trim());
      setStep(2);
      toast.success("OTP sent", { description: `Check your email at ${values.email.trim()}` });
    } catch (err: any) {
      setFormError(getErrorMessage(err, "Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyAndRegister(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (otp.length !== 6) {
      setFormError("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(values.email.trim(), otp);
      await register({ fullName: values.name.trim(), email: values.email.trim(), password: values.password });
      toast.success("Workspace created", { description: "Welcome to your new DevBraid workspace." });
      window.location.href = "/dashboard";
    } catch (err: any) {
      setFormError(getErrorMessage(err, "Verification or registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  function onBackToStep1() {
    setStep(1);
    setOtp("");
    setFormError(null);
  }

  return (
    <AuthShell
      eyebrow="Create workspace"
      title="Start a DevBraid workspace."
      subtitle="Bring your GitHub organization, capture reasoning as decision notes, and publish evidence-backed briefs."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-medium text-foreground hover:text-primary">
            Sign in
          </Link>
        </>
      }
    >
      {step === 1 ? (
        <form onSubmit={onSendOtp} className="space-y-4" noValidate>
          {formError && <FormAlert tone="error">{formError}</FormAlert>}
          <div>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <TextInput id="name" autoComplete="name" placeholder="Alex Vane" value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} invalid={!!errors.name} aria-invalid={!!errors.name} required />
            <FieldError>{errors.name}</FieldError>
          </div>
          <div>
            <FieldLabel htmlFor="email">Work email</FieldLabel>
            <TextInput id="email" type="email" autoComplete="email" placeholder="you@company.com" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} invalid={!!errors.email} aria-invalid={!!errors.email} required />
            <FieldError>{errors.email}</FieldError>
          </div>
          <div>
            <FieldLabel htmlFor="password" hint={values.password && <span className={strength.tone === "strong" ? "text-emerald-300" : strength.tone === "ok" ? "text-primary" : "text-rose-300"}>{strength.label}</span>}>Password</FieldLabel>
            <PasswordInput id="password" autoComplete="new-password" placeholder="At least 8 characters" value={values.password} onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} invalid={!!errors.password} aria-invalid={!!errors.password} required />
            <FieldError>{errors.password}</FieldError>
          </div>
          <div>
            <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
            <PasswordInput id="confirm" autoComplete="new-password" placeholder="Re-enter password" value={values.confirm} onChange={(e) => setValues((v) => ({ ...v, confirm: e.target.value }))} invalid={!!errors.confirm} aria-invalid={!!errors.confirm} required />
            <FieldError>{errors.confirm}</FieldError>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            By creating an account you agree to DevBraid's <a href="#" className="text-foreground hover:text-primary">Terms</a> and <a href="#" className="text-foreground hover:text-primary">Privacy Policy</a>.
          </p>
          <SubmitButton type="submit" loading={loading}>Send OTP</SubmitButton>
        </form>
      ) : (
        <form onSubmit={onVerifyAndRegister} className="space-y-4" noValidate>
          {formError && <FormAlert tone="error">{formError}</FormAlert>}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              OTP sent to <span className="font-medium text-foreground">{values.email}</span>
            </p>
          </div>
          <div className="flex justify-center py-2">
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
          </div>
          <SubmitButton type="submit" loading={loading}>Verify & Create Account</SubmitButton>
          <button type="button" onClick={onBackToStep1} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to form
          </button>
        </form>
      )}
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
