"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <Button onClick={() => signIn("google")} variant="default">
      Entrar com Google
    </Button>
  );
}

export function LogoutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline">
      Sair
    </Button>
  );
}
