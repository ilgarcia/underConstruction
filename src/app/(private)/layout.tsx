import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/custom";
import { authOptions } from "@/lib/auth";
import { QueryProvider } from "@/providers/query-provider";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <QueryProvider>
      <div className="flex min-h-screen w-full flex-col bg-background font-sans">
        <Sidebar user={session.user} />
        <div className="flex flex-col sm:pl-16 flex-1">
          <main className="flex flex-col flex-1 h-full p-6">
            {children}
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
