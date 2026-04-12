"use client";

import { SessionProvider } from "next-auth/react";
import { UserStoreSync } from "./user-store-sync";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserStoreSync />
      {children}
    </SessionProvider>
  );
}
