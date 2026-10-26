import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { requestJson } from "@/lib/api-client";
import { cashFlowKeys } from "@/lib/query-keys";
import { getUpcomingInvoices } from "@/helpers/invoice";
import { useCashFlowList, useCashFlowMutation } from "@/hooks/cash-flow";
import type { CreditCardRecord } from "@/hooks/credit-card/types";
import type { CreditCardBalanceRecord } from "@/hooks/credit-card-balance/types";
import type {
  CreditCardInvoiceRecord,
  CreditCardInvoicePayload,
  InvoiceRow,
  UseCardInvoiceScheduleResult,
  UseCreditCardInvoicesResult,
} from "./types";

const ENDPOINT = "/api/cash-flow/credit-card-invoice";

function useCreditCardInvoices(idUserWallet: string | undefined): UseCreditCardInvoicesResult {
  const query = useQuery({
    queryKey: cashFlowKeys.invoices.list(idUserWallet ?? ""),
    queryFn: () =>
      requestJson<CreditCardInvoiceRecord[]>(
        `${ENDPOINT}?id_user_wallet=${idUserWallet}`,
        "Failed to load invoices",
      ),
    enabled: Boolean(idUserWallet),
  });
  const invoices = useMemo(() => query.data ?? [], [query.data]);

  const mutation = useCashFlowMutation<CreditCardInvoicePayload, CreditCardInvoiceRecord>({
    url: ENDPOINT,
    method: "PUT",
    errorMessage: "Failed to save invoice",
    // Replace the month's row in place so every reader updates at once
    onSuccess: (saved, _payload, queryClient) => {
      queryClient.setQueriesData<CreditCardInvoiceRecord[]>(
        { queryKey: cashFlowKeys.invoices.all },
        (current) =>
          current && [
            ...current.filter((i) => i.id_credit_card_invoice !== saved.id_credit_card_invoice),
            saved,
          ],
      );
    },
  });

  const getInvoiceAmount = useCallback(
    (idCreditCard: string, monthKey: string) => {
      const invoice = invoices.find(
        (i) => i.id_credit_card === idCreditCard && i.dt_month === monthKey,
      );
      return invoice ? Number(invoice.vl_amount) : 0;
    },
    [invoices],
  );

  return {
    invoices,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    getInvoiceAmount,
    saveInvoice: mutation.mutateAsync,
  };
}

/** Recurring charges of every card in the wallet, refetched after a card's charges change. */
function useCardCharges(idUserWallet: string | undefined): CreditCardBalanceRecord[] {
  const { items } = useCashFlowList<CreditCardBalanceRecord>(
    cashFlowKeys.cardCharges.byWallet(idUserWallet ?? ""),
    idUserWallet ? `/api/cash-flow/credit-card-balance?id_user_wallet=${idUserWallet}` : null,
    "Failed to load card charges",
  );

  return items;
}

function useCardInvoiceSchedule(idUserWallet: string | undefined): UseCardInvoiceScheduleResult {
  const { getInvoiceAmount, saveInvoice } = useCreditCardInvoices(idUserWallet);
  const charges = useCardCharges(idUserWallet);
  const [today] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });

  const getSchedule = useCallback(
    (card: CreditCardRecord, count: number): InvoiceRow[] => {
      const recurring = charges
        .filter((c) => c.id_credit_card === card.id_credit_card)
        .reduce((sum, c) => sum + Number(c.vl_amount), 0);

      return getUpcomingInvoices(card.vl_day, today, count).map(({ monthKey, dueDate }) => {
        const launched = getInvoiceAmount(card.id_credit_card, monthKey);
        return { monthKey, dueDate, launched, recurring, total: launched + recurring };
      });
    },
    [charges, getInvoiceAmount, today],
  );

  return { getSchedule, saveInvoice };
}

export type {
  InvoiceRow,
  UseCardInvoiceScheduleResult,
  CreditCardInvoiceRecord,
  CreditCardInvoicePayload,
  UseCreditCardInvoicesResult,
} from "./types";

export { useCreditCardInvoices, useCardCharges, useCardInvoiceSchedule };
