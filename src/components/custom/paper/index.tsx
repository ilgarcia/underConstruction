import { cn } from "@/lib/utils";
import { PaperProps } from "./types";

export function Paper({ title, subtitle, children, className }: PaperProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-8">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
