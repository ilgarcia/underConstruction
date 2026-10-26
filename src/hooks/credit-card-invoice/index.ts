import { useCallback, useEffect, useState } from "react";
import { useCreditCardInvoiceStore } from "@/store/credit-card-invoice-store";
import { useCardChargesStore } from "@/store/card-charges-store";
import { useCreditCardBalanceStore } from "@/store/credit-card-balance-store";
import { getUpcomingInvoices } from "@/helpers/invoice";
import type { CreditCardRecord } from "@/hooks/credit-card/types";
import type {
  InvoiceRow,
  UseCardInvoiceScheduleResult,
  UseCreditCardInvoicesResult,
} from "./types";

function useCreditCardInvoices(idUserWallet: string | undefined): UseCreditCardInvoicesResult {
  const invoices = useCreditCardInvoiceStore((state) => state.invoices);
  const walletId = useCreditCardInvoiceStore((state) => state.walletId);
  const isLoading = useCreditCardInvoiceStore((state) => state.isLoading);
  const error = useCreditCardInvoiceStore((state) => state.error);
  const fetchInvoices = useCreditCardInvoiceStore((state) => state.fetchInvoices);
  const saveInvoice = useCreditCardInvoiceStore((state) => state.saveInvoice);

  useEffect(() => {
    // Shared store: only fetch when the wallet changes
    if (idUserWallet && walletId !== idUserWallet) {
      fetchInvoices(idUserWallet);
    }
  }, [idUserWallet, walletId, fetchInvoices]);

  const getInvoiceAmount = useCallback(
    (idCreditCard: string, monthKey: string) => {
      const invoice = invoices.find(
        (i) => i.id_credit_card === idCreditCard && i.dt_month === monthKey,
      );
      return invoice ? Number(invoice.vl_amount) : 0;
    },
    [invoices],
  );

  return { invoices, isLoading, error, getInvoiceAmount, saveInvoice };
}

/** Recurring charges of every card in the wallet, refetched after a card's charges change. */
function useCardCharges(idUserWallet: string | undefined) {
  const charges = useCardChargesStore((state) => state.charges);
  const fetchCharges = useCardChargesStore((state) => state.fetchCharges);
  const editedCharges = useCreditCardBalanceStore((state) => state.items);

  useEffect(() => {
    if (idUserWallet) fetchCharges(idUserWallet, editedCharges);
  }, [idUserWallet, editedCharges, fetchCharges]);

  return charges;
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
