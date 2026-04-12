"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PageProps, PageOption } from "./types";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_OPTIONS: PageOption[] = [
  { id: "user1", label: "Usuário principal" },
  { id: "user2", label: "Usuário secundário" },
];

/**
 * Page - A reusable wrapper for dashboard pages.
 * Handles the main layout grid, header (title/subtitle), and responsiveness.
 * Strictly adheres to the project's sharp-corner rule and the specific dashboard container dimensions.
 */
export function Page({
  title,
  subtitle,
  children,
  className,
  options = DEFAULT_OPTIONS,
  onOptionChange,
}: PageProps) {
  // Initialize state with the first option if available
  const [selectedIds, setSelectedIds] = React.useState<string[]>(() => {
    return options.length > 0 ? [options[0].id] : [];
  });

  // Sync state if options change and nothing is selected
  React.useEffect(() => {
    if (selectedIds.length === 0 && options.length > 0) {
      const initialId = options[0].id;
      setSelectedIds([initialId]);
      onOptionChange?.([initialId]);
    }
  }, [options, selectedIds.length, onOptionChange]);

  const toggleOption = (id: string) => {
    const isSelected = selectedIds.includes(id);

    // If trying to unselect the last remaining item, do nothing
    if (isSelected && selectedIds.length === 1) {
      return;
    }

    const newSelection = isSelected
      ? selectedIds.filter((p) => p !== id)
      : [...selectedIds, id];
    
    setSelectedIds(newSelection);
    onOptionChange?.(newSelection);
  };

  return (
    <div className="flex-1 w-full lg:h-[calc(100vh-48px)] p-8 bg-zinc-50 dark:bg-zinc-950 shadow-sm lg:overflow-hidden flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full space-y-8 flex-1 flex flex-col min-h-0">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <section>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <section className="text-muted-foreground mt-2">
              {subtitle}
            </section>
          </section>

          {options.length > 0 && (
            <div className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-56 rounded-none border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 justify-between font-normal hover:bg-white dark:hover:bg-zinc-900 h-9 px-3"
                  >
                    <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                      {selectedIds.length === 0 
                        ? "Selecionar opções" 
                        : `Pessoas selecionadas (${selectedIds.length})`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] rounded-none">
                  {options.map((option) => (
                    <DropdownMenuCheckboxItem 
                      key={option.id}
                      checked={selectedIds.includes(option.id)} 
                      onCheckedChange={() => toggleOption(option.id)}
                      disabled={selectedIds.length === 1 && selectedIds.includes(option.id)}
                      className="rounded-none cursor-pointer"
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className={cn("flex-1 flex flex-col min-h-0", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
