import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginButton, LogoutButton } from "@/components/auth-buttons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans min-h-screen dark:bg-black p-4">
      <main className="flex max-h-[500px] flex-1 w-full max-w-lg flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Meu App Restrito</h1>
        
        {session ? (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col items-center gap-2">
              {session.user?.image && (
                <img src={session.user.image} alt="Avatar" className="w-20 h-20 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800" />
              )}
              <h2 className="text-xl font-medium mt-2 dark:text-zinc-100">Bem-vindo(a), {session.user?.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{session.user?.email}</p>
            </div>
            
            <div className="flex w-full gap-4 mt-6">
              <Button asChild className="flex-1" variant="default">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full mt-4">
            <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm">
              Sistema exclusivo para usuários na whitelist. Faça login com um email autorizado para continuar.
            </p>
            <div className="w-full mt-2">
               <LoginButton />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
