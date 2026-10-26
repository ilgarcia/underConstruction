"use client";

import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo, UserProfile } from "@/components/custom";
import { SidebarProps } from "./types";

export function Sidebar({ user }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <div className="flex flex-col flex-1">
        <div className="flex h-16 shrink-0 items-center justify-center border-b pt-2 pb-2">
          <Logo className="h-9 w-9" />
        </div>

        <TooltipProvider delayDuration={0}>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push('/')}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm transition-colors hover:text-foreground md:h-12 md:w-12 border-0"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="sr-only">Fluxo de Caixa</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Fluxo de Caixa</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </div>

      <UserProfile user={user} />
    </aside>
  );
}
