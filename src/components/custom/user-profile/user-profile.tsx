"use client";

import { Moon, Sun, User as UserIcon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileProps } from "./types";

export function UserProfile({ user }: UserProfileProps) {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-4 px-2 py-6 mt-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm text-muted-foreground transition-all hover:ring-2 hover:ring-primary/20 md:h-10 md:w-10 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border-0 p-0 bg-transparent">
            {user?.image ? (
              <Avatar className="h-8 w-8 md:h-10 md:w-10 rounded-full">
                <AvatarImage src={user.image} alt={user.name || "User"} />
                <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border border-border bg-muted">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" sideOffset={20} className="w-56 mb-2 rounded-none p-3 shadow-xl">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
              <p className="text-xs leading-none text-muted-foreground pt-1">{user?.email || ""}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer py-3 rounded-none my-1">
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span className="text-sm">{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer py-3 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 rounded-none mt-1">
            <LogOut className="mr-2 h-4 w-4" />
            <span className="font-medium text-sm">Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
