"use client";

import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { BaseDialogProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * BaseDialog - A standard wrapper for reusable dialogs across the app.
 * It provides a consistent header and structure while allowing any content as children.
 */
export function BaseDialog({
  title,
  description,
  isOpen,
  onOpenChange,
  children,
  className,
}: BaseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[425px] rounded-none border-zinc-200 dark:border-zinc-800", className)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">
              Transaction details and categorization form.
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="min-h-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
