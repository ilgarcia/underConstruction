import * as React from "react";
import { CustomTabsProps } from "./types";
import { cn } from "@/lib/utils";

export function CustomTabs({
  items,
  selectedId,
  onSelect,
  vertical = false,
  className,
}: CustomTabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            "text-sm transition-colors p-2",
            vertical ? "w-full text-left truncate" : "text-center whitespace-nowrap",
            selectedId === item.id
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          title={item.label}
        >
          {item.icon && <span className="mr-2 inline-flex align-middle">{item.icon}</span>}
          <span className="align-middle">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
