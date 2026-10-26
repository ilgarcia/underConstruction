"use client";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // Many widgets read the same lists; mutations invalidate them, so a short
      // stale time avoids a refetch every time a panel mounts.
      queries: { staleTime: 30_000, retry: 1 },
    },
  });
}

function getQueryClient() {
  // Keep server renders isolated and reuse one client in the browser
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
