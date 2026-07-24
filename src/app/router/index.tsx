import React from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { LoginPage } from "../../pages/LoginPage";
import { RegisterPage } from "../../pages/RegisterPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { Toaster } from "sonner";

// Root Component wrapping AuthProvider & Layout
function RootComponent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="grid size-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            DB
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
            Restoring session…
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <Toaster position="bottom-right" />
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <RootComponent />
    </AuthProvider>
  ),
});

// Index route redirects to /dashboard or /auth/login
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const token = localStorage.getItem("devbraid_access_token");
    if (token) {
      throw redirect({ to: "/dashboard" });
    } else {
      throw redirect({ to: "/auth/login" });
    }
  },
});

// Auth Routes (Public)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  beforeLoad: () => {
    const token = localStorage.getItem("devbraid_access_token");
    if (token) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/register",
  beforeLoad: () => {
    const token = localStorage.getItem("devbraid_access_token");
    if (token) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegisterPage,
});

// Protected Routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => {
    const token = localStorage.getItem("devbraid_access_token");
    if (!token) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
