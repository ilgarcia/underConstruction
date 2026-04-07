"use client";

import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserProfile } from "@/components/custom";
import { SidebarProps } from "./types";

export function Sidebar({ user }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <div className="flex flex-col flex-1">
        <div className="flex h-16 shrink-0 items-center justify-center border-b pt-2 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
          </div>
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
                  <span className="sr-only">Dashboard</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </div>

      <UserProfile user={user} />
    </aside>
  );
}
