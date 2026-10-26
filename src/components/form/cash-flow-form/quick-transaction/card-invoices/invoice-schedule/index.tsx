"use client";

import { toast } from "sonner";
import { AutoSaveInput } from "@/components/custom";
import { useCardInvoiceSchedule } from "@/hooks";
import { formatCurrency } from "@/helpers/currency";
import { formatDateShort } from "@/helpers/date";
import { formatMonthShort, parseMonthKey } from "@/helpers/month";
import { InvoiceScheduleProps } from "./types";

const MONTHS_SHOWN = 6;

/**
 * InvoiceSchedule - The card's next invoices. "Lançado" is editable per month and saves on blur;
 * the recurring charges add up into every invoice.
 */
export function InvoiceSchedule({ card, idUserWallet }: InvoiceScheduleProps) {
  const { getSchedule, saveInvoice } = useCardInvoiceSchedule(idUserWallet);
  const rows = getSchedule(card, MONTHS_SHOWN);

  const save = async (monthKey: string, value: number | string) => {
    try {
      await saveInvoice({
        id_credit_card: card.id_credit_card,
        dt_month: monthKey,
        vl_amount: Number(value),
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar a fatura.");
      throw err;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-bold">Faturas dos próximos meses</h4>
      <p className="text-xs text-muted-foreground">
        Edite o valor lançado · salva ao sair do campo
      </p>
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-muted text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Mês</th>
              <th className="px-3 py-2 text-left font-semibold">Vencimento</th>
              <th className="px-3 py-2 text-left font-semibold">Lançado</th>
              <th className="px-3 py-2 text-right font-semibold">+ Recorrentes</th>
              <th className="px-3 py-2 text-right font-semibold">= Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.monthKey} className="border-t border-border">
                <td className="px-3 py-2 font-semibold">
                  {formatMonthShort(parseMonthKey(row.monthKey))}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{formatDateShort(row.dueDate)}</td>
                <td className="px-3 py-2">
                  <AutoSaveInput
                    key={`${card.id_credit_card}-${row.monthKey}`}
                    label=""
                    value={row.launched}
                    onSave={(v) => save(row.monthKey, v)}
                    containerClassName="w-[150px] space-y-0"
                    hideStatus
                  />
                </td>
                <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                  {formatCurrency(row.recurring)}
                </td>
                <td className="px-3 py-2 text-right font-mono font-bold">
                  {formatCurrency(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
