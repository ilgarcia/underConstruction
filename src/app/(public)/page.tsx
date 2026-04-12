import { AuthCard } from "@/components/custom";
import { AuthErrorHandler } from "@/components/custom/auth-error-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/cash-flow");
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-background to-secondary/50 font-sans min-h-screen p-4 transition-colors duration-500 text-foreground">
      <AuthErrorHandler />
      <AuthCard />
    </div>
  );
}
