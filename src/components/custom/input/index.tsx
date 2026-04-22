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
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActionInputProps, FormActionInputProps } from "./types";
import { FieldValues } from "react-hook-form";
import { Plus, Save } from "lucide-react";
import { ActionButton } from "../buttons/action-button";

/**
 * Helper to extract value safely from React input props (which could be string[])
 */
const getSafeValue = (v: any): string | number => Array.isArray(v) ? v[0] || "" : v;

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
      actionInput = false,
      showButton = false,
      rightAction,
      submitProps,
      onChange,
      defaultValue,
      value,
      type = "text",
      maxDigits = 10,
      placeholder: passedPlaceholder,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const isCurrency = type === "currency" || isFinancial;
    const displayPrefix = isCurrency ? "R$" : prefix;
    const placeholder = passedPlaceholder ?? (isCurrency ? "0,00" : undefined);
    const hasButton = actionInput || (showButton && (actionLabel || actionIcon || onAction));

    const finalRightAction = rightAction || (submitProps && (
      <ActionButton
        type="submit"
        icon={<Save className="w-4 h-4" />}
        loading={submitProps.loading}
        disabled={submitProps.disabled}
      />
    ));

    // Initial formatting logic for financial values
    const formatCurrency = (valRaw: string | number) => {
      // Se for um número real (vindo do hook form, ex: 12.5), 
      // convertemos para a representação de 'centavos' (1250) antes do replace
      const strVal = typeof valRaw === "number"
        ? (valRaw * 100).toFixed(0)
        : String(valRaw);

      const numericValue = parseInt(strVal.replace(/\D/g, "") || "0", 10);

      return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue / 100);
    };

    const [val, setVal] = React.useState(
      isCurrency ? formatCurrency(getSafeValue(value ?? defaultValue ?? 0)) : String(getSafeValue(value ?? defaultValue ?? ""))
    );

    // Mantém o estado sincronizado se o React Hook Form (ou pái) alterar o value dinamicamente
    React.useEffect(() => {
      if (value !== undefined) {
        setVal(isCurrency ? formatCurrency(getSafeValue(value)) : String(getSafeValue(value)));
      }
    }, [value, isCurrency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let nextValue = e.target.value;

      if (isCurrency) {
        // Remove all non-digits
        let digits = nextValue.replace(/\D/g, "");

        if (maxDigits) {
          // maxDigits applied to the integer part, meaning total digits = maxDigits + 2 (for cents)
          const maxTotalDigits = maxDigits + 2;
          // Trim leading zeros initially to count accurately
          const cleanDigits = digits.replace(/^0+/, "");

          if (cleanDigits.length > maxTotalDigits) {
            // Se o usuário estourou o limite, nós cortamos os limpos (assim evitamos fatiar zeros à toa)
            digits = cleanDigits.slice(0, maxTotalDigits);
          }
        }

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
        <div className={cn(finalRightAction ? "grid grid-cols-12 gap-2 items-end" : "")}>
          <div className={cn(finalRightAction ? "col-span-9" : "w-full")}>
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
                type={type === "currency" ? "text" : type}
                placeholder={placeholder}
                className={cn(
                  "rounded-none h-full text-sm placeholder:text-zinc-500 border-0 focus-visible:ring-0",
                  readOnlyInput && "cursor-default bg-muted dark:bg-muted/60 text-muted-foreground",
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
                  {actionInput ? (
                    <Plus className="w-4 h-4" />
                  ) : (
                    <>
                      {actionIcon && <span className="shrink-0">{actionIcon}</span>}
                      {actionLabel && <span>{actionLabel}</span>}
                    </>
                  )}
                </InputGroupButton>
              )}
            </InputGroup>
          </div>
          {finalRightAction && <div className="col-span-3">{finalRightAction}</div>}
        </div>
      </div>
    );
  }
);

ActionInput.displayName = "ActionInput";

/**
 * FormActionInput - A React Hook Form integrated wrapper for ActionInput.
 */
export function FormActionInput<T extends FieldValues>({
  control,
  name,
  ...props
}: FormActionInputProps<T>) {
  if (props.type === "day_picker") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("flex flex-col space-y-2", props.containerClassName)}>
            {props.label && (
              <FormLabel className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {props.label}
              </FormLabel>
            )}
            <Select
              onValueChange={(val) => {
                field.onChange(parseInt(val, 10));
                // Simulate event
                props.onChange?.({ target: { value: val } } as any);
              }}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger className="w-full h-9 rounded-none border-zinc-200 dark:border-zinc-800 transition-all focus:ring-1 focus:ring-primary shadow-none">
                  <SelectValue placeholder={props.placeholder || "Selecione o Dia"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    Dia {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={props.containerClassName}>
          <FormControl>
            <ActionInput
              {...props}
              {...field}
              onChange={(e) => {
                field.onChange(e); // Inform RHF
                props.onChange?.(e); // Allow external onChange capture
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
