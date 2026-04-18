import { create } from "zustand";

interface ReceivableRecord {
  id_receivable: string;
  id_user_wallet: string;
  ds_receivable: string;
  vl_receivable: number;
  vl_day_receivable: number;
  dt_created: string;
  dt_updated: string;
}

interface ReceivableStore {
  receivables: ReceivableRecord[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
  setReceivables: (receivables: ReceivableRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchReceivables: (walletId: string) => Promise<void>;
}

export const useReceivableStore = create<ReceivableStore>((set, get) => ({
  receivables: [],
  totalSum: 0,
  isLoading: false,
  error: null,

  setReceivables: (receivables) => {
    const sum = receivables.reduce((acc, curr) => acc + Number(curr.vl_receivable), 0);
    set({ receivables, totalSum: sum });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchReceivables: async (walletId) => {
    if (!walletId) return;

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`/api/cash-flow/receivable?wallet_id=${walletId}`);

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to fetch receivables");
      }

      const data = await res.json();
      const sum = data.reduce((acc: number, curr: ReceivableRecord) => acc + Number(curr.vl_receivable), 0);
      
      set({ receivables: data, totalSum: sum, isLoading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false 
      });
    }
  },
}));
