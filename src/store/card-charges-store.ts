import { create } from "zustand";
import type { CreditCardBalanceRecord } from "./credit-card-balance-store";

interface CardChargesState {
  /** Recurring charges of every card in the wallet. */
  charges: CreditCardBalanceRecord[];
  walletId: string | null;
  /** The edited-card list this snapshot was fetched after, to skip duplicate refetches. */
  syncedWith: unknown;
  fetchCharges: (walletId: string, marker: unknown) => Promise<void>;
}

export const useCardChargesStore = create<CardChargesState>((set, get) => ({
  charges: [],
  walletId: null,
  syncedWith: null,
  fetchCharges: async (walletId: string, marker: unknown) => {
    if (get().walletId === walletId && get().syncedWith === marker) return;
    set({ walletId, syncedWith: marker });
    try {
      const res = await fetch(`/api/cash-flow/credit-card-balance?id_user_wallet=${walletId}`);
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to load card charges");
      }
      const data: CreditCardBalanceRecord[] = await res.json();
      set({ charges: data });
    } catch (err) {
      console.error("Failed to fetch card charges", err);
    }
  },
}));
