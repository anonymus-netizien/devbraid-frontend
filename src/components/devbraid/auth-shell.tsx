import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Terminal, CheckCircle2, AlertTriangle } from "lucide-react";

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
    <div className="h-dvh max-h-dvh w-full overflow-hidden grid grid-cols-1 bg-background text-foreground selection:bg-primary/30 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Left Pane: Perfectly Centered Form (No Overflow) */}
      <div className="relative flex h-full flex-col justify-between overflow-y-auto lg:overflow-hidden px-6 py-6 sm:px-10 lg:px-12 xl:px-16">
        {/* Subtle Background Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40"
        >
          <div className="absolute -top-[20%] -left-[10%] h-[400px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        {/* Top Header */}
        <header className="relative z-10 flex shrink-0 items-center justify-between">
          <Link
            to="/dashboard"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              DB
            </div>
            <span className="text-lg font-bold tracking-tight">
              DevBraid
            </span>
          </Link>
          <span className="rounded-full border border-hairline bg-surface/50 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground backdrop-blur-md">
            v1.0 · beta
          </span>
        </header>

        {/* Form Container: Centered Vertically */}
        <main className="relative z-10 my-auto py-4">
          <div className="mx-auto w-full max-w-[420px]">
            {eyebrow && (
              <div className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                {eyebrow}
              </div>
            )}
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {subtitle}
              </p>
            )}

            <div className="mt-6 sm:mt-8">{children}</div>

            {footer && (
              <div className="mt-6 border-t border-hairline/60 pt-4 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            )}
          </div>
        </main>

        {/* Bottom Footer */}
        <footer className="relative z-10 flex shrink-0 items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} DevBraid Inc.</span>
          <div className="flex items-center gap-5">
            <a className="transition-colors hover:text-foreground" href="#">
              Privacy
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Terms
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Status
            </a>
          </div>
        </footer>
      </div>

      {/* Right Pane: Brand Pane with 3D Graphic Showcase (No-Scroll Fixed Container) */}
      <aside className="relative hidden h-full overflow-hidden border-l border-hairline bg-surface/30 lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
        {/* Soothing Grid & Radial Glow Overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
        >
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--color-hairline) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse at 50% 40%, black 50%, transparent 90%)",
            }}
          />
        </div>

        {/* Brand Hero Header */}
        <div className="relative z-10 shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur-md">
            <Sparkles className="size-3.5" />
            AI-Driven Context Logbook
          </div>
          <h2 className="mt-4 max-w-[22ch] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            From tricky bugs to verified solutions.
          </h2>
          <p className="mt-2.5 max-w-[44ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
            DevBraid captures developer reasoning, links stack traces to code decisions, and publishes evidence-backed briefs.
          </p>
        </div>

        {/* 3D Graphic Showcase Container (Constrained max-height to avoid page scroll) */}
        <div className="relative z-10 my-auto py-4 flex flex-1 items-center justify-center min-h-0">
          <div className="group relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-hairline/80 bg-background/60 p-2.5 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300 hover:border-primary/40">
            {/* Ambient Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/10 opacity-50 transition-opacity group-hover:opacity-100" />
            
            {/* Image Wrapper with Max Height Limit */}
            <div className="relative max-h-[260px] xl:max-h-[300px] w-full overflow-hidden rounded-xl bg-surface/80">
              <img
                src="/programmer_3d.png"
                alt="3D Developer solving an error"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".fallback-graphic");
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />

              {/* Dynamic Fallback Graphic if Image fails to load */}
              <div className="fallback-graphic hidden flex h-full w-full flex-col justify-center p-6 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-300">
                      <AlertTriangle className="size-4" /> ERROR 503
                    </div>
                    <div className="mt-1 text-xs text-rose-200/80">Stack trace: Database timeout</div>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-300">
                      <CheckCircle2 className="size-4" /> SOLVED
                    </div>
                    <div className="mt-1 text-xs text-emerald-200/80">Build passed & deployed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Pill */}
            <div className="mt-2.5 flex items-center justify-between px-3 py-1">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  Live Logbook Stream
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-primary">
                <Terminal className="size-3.5" />
                Evidence Connected
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="relative z-10 shrink-0 grid grid-cols-3 gap-3 text-xs">
          {[
            ["Decision Notes", "Developer-owned"],
            ["Risk Analysis", "Deterministic"],
            ["Change Brief", "Evidence-backed"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-xl border border-hairline/80 bg-background/50 p-3.5 backdrop-blur-md transition-colors hover:border-hairline hover:bg-surface/60"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {k}
              </div>
              <div className="mt-1 font-semibold text-foreground text-xs sm:text-sm">{v}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

