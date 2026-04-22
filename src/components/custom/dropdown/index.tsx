"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownProps, PageOption } from "./types";

const DEFAULT_OPTIONS: PageOption[] = [
  { id: "user1", label: "Usuário principal" },
  { id: "user2", label: "Usuário secundário" },
];

export function Dropdown({
  options = DEFAULT_OPTIONS,
  onOptionChange,
}: DropdownProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>(() => {
    return options.length > 0 ? [options[0].id] : [];
  });

  React.useEffect(() => {
    if (selectedIds.length === 0 && options.length > 0) {
      const initialId = options[0].id;
      setSelectedIds([initialId]);
      onOptionChange?.([initialId]);
    }
  }, [options, selectedIds.length, onOptionChange]);

  const toggleOption = (id: string) => {
    const isSelected = selectedIds.includes(id);

    if (isSelected && selectedIds.length === 1) {
      return;
    }

    const newSelection = isSelected
      ? selectedIds.filter((p) => p !== id)
      : [...selectedIds, id];
    
    setSelectedIds(newSelection);
    onOptionChange?.(newSelection);
  };

  if (options.length === 0) return null;

  return (
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
  );
}
