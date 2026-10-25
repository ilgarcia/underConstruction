"use client";

import { useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMonths, formatMonthShort, monthDiff, parseMonthKey, toMonthKey } from "@/helpers/month";
import { FrequencyFieldsProps } from "./types";

const labelClass = "text-xs font-semibold text-muted-foreground uppercase tracking-wider";
const triggerClass = "w-full h-9 rounded-none shadow-none focus:ring-1 focus:ring-primary";
const MONTH_COUNTS = Array.from({ length: 36 }, (_, i) => i + 1);

/** Twelve months from the current one, plus the edited item's start month if it is older. */
function getMonthOptions(editingStartMonth?: string): string[] {
  const current = toMonthKey(new Date());
  const first = editingStartMonth && monthDiff(current, editingStartMonth) < 0
    ? editingStartMonth
    : current;
  const count = monthDiff(first, current) + 12;
  return Array.from({ length: count }, (_, i) => addMonths(first, i));
}

/**
 * FrequencyFields - Second form row for items that repeat: every month ("Todo mês") or for a
 * number of months ("Por alguns meses"), starting at a given month.
 */
export function FrequencyFields({ control, editingStartMonth }: FrequencyFieldsProps) {
  const frequency = useWatch({ control, name: "frequency" });
  const monthOptions = getMonthOptions(editingStartMonth);

  return (
    <div className="flex flex-wrap gap-3">
      <FormField
        control={control}
        name="frequency"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2 flex-[1_1_180px]">
            <FormLabel className={labelClass}>Frequência</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className={triggerClass}>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="always">Todo mês</SelectItem>
                <SelectItem value="months">Por alguns meses</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {frequency === "months" && (
        <FormField
          control={control}
          name="nr_months"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 flex-[1_1_140px]">
              <FormLabel className={labelClass}>Quantidade de meses</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={(val) => field.onChange(parseInt(val, 10))}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MONTH_COUNTS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "mês" : "meses"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="dt_start_month"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2 flex-[1_1_140px]">
            <FormLabel className={labelClass}>A partir de</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className={triggerClass}>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {monthOptions.map((key) => (
                  <SelectItem key={key} value={key}>
                    {formatMonthShort(parseMonthKey(key))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
