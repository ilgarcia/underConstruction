import { create } from "zustand";
import type { WalletRecord } from "@/hooks/wallet/types";

interface WalletState {
  wallet: WalletRecord | null;
  isLoading: boolean;
  error: string | null;
  fetchWallet: () => Promise<void>;
  updateBalanceLocally: (balance: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  isLoading: false,
  error: null,
  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/cash-flow/wallet");
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to load wallet");
      }
      const data: WalletRecord = await res.json();
      set({ wallet: data, isLoading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : "Unknown error", 
        isLoading: false 
      });
    }
  },
  updateBalanceLocally: (balance) => set((state) => ({
    wallet: state.wallet ? { ...state.wallet, vl_balance: balance } : null
  }))
}));
