import { create } from "zustand";
import type {
  CreditCardInvoiceRecord,
  CreditCardInvoicePayload,
} from "@/hooks/credit-card-invoice/types";

interface CreditCardInvoiceState {
  invoices: CreditCardInvoiceRecord[];
  walletId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchInvoices: (walletId: string) => Promise<void>;
  saveInvoice: (payload: CreditCardInvoicePayload) => Promise<void>;
}

export const useCreditCardInvoiceStore = create<CreditCardInvoiceState>((set) => ({
  invoices: [],
  walletId: null,
  isLoading: false,
  error: null,
  fetchInvoices: async (walletId: string) => {
    set({ isLoading: true, error: null, walletId });
    try {
      const res = await fetch(`/api/cash-flow/credit-card-invoice?id_user_wallet=${walletId}`);
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to load invoices");
      }
      const data: CreditCardInvoiceRecord[] = await res.json();
      set({ invoices: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },
  saveInvoice: async (payload: CreditCardInvoicePayload) => {
    const res = await fetch("/api/cash-flow/credit-card-invoice", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const { error: msg } = await res.json();
      throw new Error(msg ?? "Failed to save invoice");
    }
    const saved: CreditCardInvoiceRecord = await res.json();
    // Replace the month's row in place so every reader updates at once
    set((state) => ({
      invoices: [
        ...state.invoices.filter((i) => i.id_credit_card_invoice !== saved.id_credit_card_invoice),
        saved,
      ],
    }));
  },
}));
