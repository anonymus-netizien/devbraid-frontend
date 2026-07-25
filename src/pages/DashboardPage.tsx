import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <header className="flex items-center justify-between border-b border-hairline pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user?.name || "Developer"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as <span className="font-mono text-foreground">{user?.email}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-2"
        >
          <LogOut className="size-3.5" />
          Sign out
        </button>
      </header>

      <main className="mt-8">
        <div className="rounded-lg border border-hairline bg-surface/30 p-6 text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">
            Sprint 1 Completed
          </div>
          <h2 className="mt-2 text-lg font-medium">Authentication & Session persistence active</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Backend API integration, AuthContext, JWT tokens, session bootstrap, and route protection are fully functional.
          </p>
        </div>
      </main>
    </div>
  );
}
