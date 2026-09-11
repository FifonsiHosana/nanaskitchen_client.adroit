import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import ReactDOM from "react-dom/client";

import type { Route } from "./+types/root";
import "./app.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { useEffect } from "react";
import { useAuthStore } from "./store/use_auth_store";
import { usePermissionsStore } from "./store/v2/use-permissions-store";

export function Layout({ children }: { children: React.ReactNode }) {
  const { hydrate } = useAuthStore();
  const { fetchPermissions } = usePermissionsStore();

  useEffect(() => {
    hydrate();
    // `hydrate()` restores the session synchronously from localStorage, but
    // `isAuthenticated` in this closure is the pre-hydration value — so check
    // the stored token directly to refetch permissions on app boot.
    if (localStorage.getItem("userToken")) {
      fetchPermissions();
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" />
          <ScrollRestoration />
          <Scripts />
        </TooltipProvider>
      </body>
    </html>
  );
}
export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
