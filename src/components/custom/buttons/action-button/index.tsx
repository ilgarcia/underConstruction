"use client";

import * as React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionButtonProps } from "./types";

/**
 * ActionButton - A flexible button that can display an icon, a label, or both.
 * Supports a loading state that replaces the icon with a spinner.
 * At least one of `icon` or `label` must be provided.
 */
export function ActionButton({
  icon,
  label,
  loading = false,
  className,
  disabled,
  children: _children,
  ...props
}: ActionButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Button
      disabled={isDisabled}
      className={cn(
        "w-full h-9 bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm",
        "rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {label && <span>{label}</span>}
    </Button>
  );
}
