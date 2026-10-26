import { cn } from "@/lib/utils";
import { PaperProps } from "./types";

export function Paper({ title, subtitle, children, className }: PaperProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border border-border p-6 flex flex-col",
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
