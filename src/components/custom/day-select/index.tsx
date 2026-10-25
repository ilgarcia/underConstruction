"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DaySelectProps } from "./types";

/**
 * DaySelect - A day-of-month picker (1 to 31) that is not bound to React Hook Form.
 */
export function DaySelect({ label, value, onChange, disabled, containerClassName }: DaySelectProps) {
  const id = React.useId();

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(parseInt(val, 10))}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="w-full h-9 rounded-none shadow-none focus:ring-1 focus:ring-primary">
          <SelectValue placeholder="Selecione o Dia" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <SelectItem key={day} value={day.toString()}>
              Dia {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
