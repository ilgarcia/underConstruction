import type { CreditCardRecord } from "@/hooks/credit-card/types";

interface CreditCardInvoiceRecord {
  id_credit_card_invoice: string;
  id_credit_card: string;
  /** Due month, "YYYY-MM-01". */
  dt_month: string;
  vl_amount: number;
  dt_created: string;
  dt_updated: string;
}

interface CreditCardInvoicePayload {
  id_credit_card: string;
  dt_month: string;
  vl_amount: number;
}

interface UseCreditCardInvoicesResult {
  invoices: CreditCardInvoiceRecord[];
  isLoading: boolean;
  error: string | null;
  /** Amount already charged on the invoice of a card due in `monthKey` (0 when none). */
  getInvoiceAmount: (idCreditCard: string, monthKey: string) => number;
  saveInvoice: (payload: CreditCardInvoicePayload) => Promise<CreditCardInvoiceRecord>;
}

interface InvoiceRow {
  /** Due month, "YYYY-MM-01". */
  monthKey: string;
  dueDate: Date;
  /** Amount already charged on the invoice (editable). */
  launched: number;
  /** Sum of the card's recurring charges, which go into every invoice. */
  recurring: number;
  total: number;
}

interface UseCardInvoiceScheduleResult {
  /** The next `count` invoices of a card, from the first one due today or later. */
  getSchedule: (card: CreditCardRecord, count: number) => InvoiceRow[];
  saveInvoice: (payload: CreditCardInvoicePayload) => Promise<CreditCardInvoiceRecord>;
}

export type {
  InvoiceRow,
  UseCardInvoiceScheduleResult,
  CreditCardInvoiceRecord,
  CreditCardInvoicePayload,
  UseCreditCardInvoicesResult,
};
