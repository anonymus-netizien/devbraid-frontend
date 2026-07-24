import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh w-full grid-cols-1 bg-background text-foreground lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Left: form */}
      <div className="flex min-h-dvh flex-col px-6 py-8 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="grid size-7 place-items-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
              DB
            </div>
            <span className="text-sm font-semibold tracking-tight">
              DevBraid
            </span>
          </Link>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            v1.0 · beta
          </div>
        </header>

        <main className="flex flex-1 items-center">
          <div className="w-full max-w-[400px] py-14">
            {eyebrow && (
              <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-primary/80">
                {eyebrow}
              </div>
            )}
            <h1 className="text-[26px] font-semibold leading-tight tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
            <div className="mt-8">{children}</div>
            {footer && (
              <div className="mt-6 text-xs text-muted-foreground">{footer}</div>
            )}
          </div>
        </main>

        <footer className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} DevBraid</span>
          <div className="flex items-center gap-4">
            <a className="hover:text-foreground" href="#">
              Privacy
            </a>
            <a className="hover:text-foreground" href="#">
              Terms
            </a>
            <a className="hover:text-foreground" href="#">
              Status
            </a>
          </div>
        </footer>
      </div>

      {/* Right: brand pane */}
      <aside className="relative hidden overflow-hidden border-l border-hairline bg-surface/40 lg:block">
        <BrandPane />
      </aside>
    </div>
  );
}

function BrandPane() {
  return (
    <div className="relative flex h-full flex-col justify-between p-14">
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--color-hairline) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 30% 20%, black 30%, transparent 75%)",
        }}
      />
      <div className="relative z-10">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          two-pane logbook
        </div>
        <h2 className="mt-3 max-w-[22ch] text-[28px] font-semibold leading-[1.15] tracking-tight">
          Preserve the reasoning behind every change.
        </h2>
        <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
          DevBraid pairs your decision notes with GitHub evidence and turns
          them into an evidence-backed Change Brief before review.
        </p>
      </div>

      <div className="relative z-10">
        <div className="rounded-lg border border-hairline bg-background/70 p-4 shadow-[0_1px_0_var(--color-hairline)] backdrop-blur">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-muted-foreground">
              acme/gateway · feat/auth-rs256
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              ready
            </span>
          </div>
          <div className="mt-2 text-sm font-medium">
            Refactor JWT authentication to use RS256 providers
          </div>
          <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">
                cited
              </span>
              <span className="truncate">
                Standardize on RS256 signing for internal service-mesh tokens.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                inference
              </span>
              <span className="truncate">
                Legacy Go runtimes only ship HS-family verifiers.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-[11px]">
          {[
            ["Decision notes", "developer-owned"],
            ["Risk analysis", "deterministic"],
            ["Change brief", "evidence-backed"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-md border border-hairline bg-background/60 p-3"
            >
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                {k}
              </div>
              <div className="mt-1 text-foreground">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
