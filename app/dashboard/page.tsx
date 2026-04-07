import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Dupla proteção: além do middleware.ts, a página verifica a sessão
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen p-8 bg-zinc-50 dark:bg-black font-sans items-center justify-center">
      <div className="w-full max-w-2xl p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Dashboard Privado</h1>
          <Button variant="outline" asChild>
            <Link href="/">Voltar</Link>
          </Button>
        </div>
        
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Você está vendo esta página pois sua conta (<span className="font-semibold text-zinc-900 dark:text-zinc-200">{session.user?.email}</span>) está na whitelist.
        </p>

        <h2 className="text-lg font-medium mb-2 dark:text-white">Dados da Sessão:</h2>
        <pre className="p-4 bg-zinc-100 dark:bg-zinc-950 rounded-lg overflow-x-auto text-xs border dark:border-zinc-800 text-zinc-800 dark:text-zinc-300">
          {JSON.stringify(session, null, 2)}
        </pre>

      </div>
    </div>
  );
}
