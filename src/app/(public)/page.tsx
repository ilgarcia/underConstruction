import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthCard, AuthErrorHandler } from "@/components/custom";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/cash-flow");
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-linear-to-br from-background to-secondary/50 font-sans min-h-screen p-4 transition-colors duration-500 text-foreground">
      <AuthErrorHandler />
      <AuthCard />
    </div>
  );
}
