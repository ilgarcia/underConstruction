"use client";

import * as React from "react";
import { Check, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseCurrency } from "@/helpers/currency";
import { ActionInput } from "@/components/custom/input";
import { AutoSaveInputProps, AutoSaveStatus } from "./types";

/**
 * AutoSaveInput - An input that saves its value when the user leaves the field.
 * There is no save button: blur (or Enter) triggers `onSave` when the value changed.
 */
export function AutoSaveInput({
  label,
  value,
  type = "currency",
  onSave,
  disabled,
  containerClassName,
  hideStatus = false,
}: AutoSaveInputProps) {
  const isCurrency = type === "currency";
  const [draft, setDraft] = React.useState<number | string>(value);
  const [status, setStatus] = React.useState<AutoSaveStatus>("idle");
  const [savedAt, setSavedAt] = React.useState<string | null>(null);
  const [syncedValue, setSyncedValue] = React.useState(value);

  // Reset the draft when the saved value changes from outside
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const normalize = (v: number | string) => (isCurrency ? parseCurrency(v) : String(v).trim());

  const handleBlur = async () => {
    const next = normalize(draft);
    if (next === normalize(value)) return;

    setStatus("saving");
    try {
      await onSave(next);
      setStatus("saved");
      setSavedAt(
        new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      );
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      <ActionInput
        label={label}
        type={type}
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
      />
      {!hideStatus && (
        <p
          aria-live="polite"
          className={cn(
            "flex items-center gap-1.5 text-xs",
            status === "error" ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {status === "saving" && "Salvando..."}
          {status === "saved" && (
            <>
              <Check className="size-3.5 text-success" />
              Salvo às {savedAt}
            </>
          )}
          {status === "error" && (
            <>
              <CircleAlert className="size-3.5" />
              Não foi possível salvar. Tente de novo.
            </>
          )}
          {status === "idle" && "Salva ao sair do campo"}
        </p>
      )}
    </div>
  );
}
