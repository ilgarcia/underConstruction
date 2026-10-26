import { create } from "zustand";
import type { CreditCardRecord } from "@/hooks/credit-card/types";

interface CreditCardState {
  creditCards: CreditCardRecord[];
  walletId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchCreditCards: (walletId: string) => Promise<void>;
}

export const useCreditCardStore = create<CreditCardState>((set) => ({
  creditCards: [],
  walletId: null,
  isLoading: false,
  error: null,
  fetchCreditCards: async (walletId: string) => {
    set({ isLoading: true, error: null, walletId });
    try {
      const res = await fetch(`/api/cash-flow/credit-card?id_user_wallet=${walletId}`);
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to load credit cards");
      }
      const data: CreditCardRecord[] = await res.json();
      set({ creditCards: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },
}));
