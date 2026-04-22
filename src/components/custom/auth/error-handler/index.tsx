"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "AccessDenied") {
      toast.error("Você não tem permissão, peça ao administrador", {
        description: "Seu e-mail não está na lista de usuários permitidos.",
        duration: 5000,
      });

      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [error, router]);

  return null;
}

export function AuthErrorHandler() {
  return (
    <Suspense fallback={null}>
      <AuthErrorContent />
    </Suspense>
  );
}
