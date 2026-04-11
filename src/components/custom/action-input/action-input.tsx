"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ActionInputProps } from "./types";

/**
 * ActionInput - A specialized input with support for prefixes and right-side action buttons.
 * Includes a financial mask (0,01 -> 1,23) and read-only mode for the input field.
 */
export const ActionInput = React.forwardRef<HTMLInputElement, ActionInputProps>(
  (
    {
      className,
      containerClassName,
      label,
      prefix,
      isFinancial,
      readOnlyInput,
      actionLabel,
      actionIcon,
      onAction,
      showButton = true,
      onChange,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const displayPrefix = isFinancial ? "R$" : prefix;
    const hasButton = showButton && (actionLabel || actionIcon || onAction);

    // Initial formatting logic for financial values
    const formatCurrency = (value: string | number) => {
      const numericValue = typeof value === "string"
        ? parseInt(value.replace(/\D/g, "") || "0", 10)
        : value;

      return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue / 100);
    };

    const [val, setVal] = React.useState(
      isFinancial ? formatCurrency(String(defaultValue || "0")) : String(defaultValue || "")
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let nextValue = e.target.value;

      if (isFinancial) {
        // Remove all non-digits and format
        const digits = nextValue.replace(/\D/g, "");
        nextValue = formatCurrency(digits);
      }

      setVal(nextValue);
      if (onChange) {
        // Simulate a standard change event with the new value
        const event = {
          ...e,
          target: {
            ...e.target,
            value: nextValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={id} className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {label}
          </Label>
        )}
        <InputGroup
          className={cn(
            "rounded-none h-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 transition-all duration-200",
            "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-none"
          )}
        >
          {displayPrefix && (
            <InputGroupAddon
              className="rounded-none h-full border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 text-zinc-500 font-medium group-focus-within/input-group:border-primary"
            >
              {displayPrefix}
            </InputGroupAddon>
          )}

          <InputGroupInput
            ref={ref}
            id={id}
            value={val}
            onChange={handleChange}
            readOnly={readOnlyInput}
            className={cn(
              "rounded-none h-full text-sm placeholder:text-zinc-500 border-0 focus-visible:ring-0",
              readOnlyInput && "cursor-default bg-muted text-muted-foreground",
              className
            )}
            {...props}
          />

          {hasButton && (
            <InputGroupButton
              variant="secondary"
              onClick={onAction}
              className="rounded-none h-full border-l border-zinc-200 dark:border-zinc-800 px-4 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group-focus-within/input-group:border-primary"
            >
              {actionIcon && <span className="shrink-0">{actionIcon}</span>}
              {actionLabel && <span>{actionLabel}</span>}
            </InputGroupButton>
          )}
        </InputGroup>
      </div>
    );
  }
);

ActionInput.displayName = "ActionInput";
