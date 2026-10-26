import { create, StoreApi, UseBoundStore } from "zustand";
import type { MonthlyFrequency } from "@/helpers/month";

export interface BaseTransactionRecord {
  id_user_wallet: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
  dt_created: string;
  dt_updated: string;
}

export type CreateTransactionParams = Omit<BaseTransactionRecord, "dt_created" | "dt_updated">;

/** Create params for items with a frequency (receivables, extra expenses). */
export type CreateFrequencyParams = CreateTransactionParams & Partial<MonthlyFrequency>;

export interface GenericTransactionStore<T> {
  items: T[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
  setItems: (items: T[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchItems: (walletId: string) => Promise<void>;
}

export function createTransactionStore<T extends { vl_amount: number }>(
  apiEndpoint: string,
): UseBoundStore<StoreApi<GenericTransactionStore<T>>> {
  return create<GenericTransactionStore<T>>((set) => ({
    items: [],
    totalSum: 0,
    isLoading: false,
    error: null,

    setItems: (items) => {
      const sum = items.reduce(
        (acc, curr) => acc + Number(curr.vl_amount),
        0,
      );
      set({ items, totalSum: sum });
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    fetchItems: async (walletId: string) => {
      if (!walletId) return;

      set({ isLoading: true, error: null });

      try {
        const res = await fetch(`${apiEndpoint}?wallet_id=${walletId}`);

        if (!res.ok) {
          const { error: msg } = await res.json();
          throw new Error(msg ?? `Failed to fetch from ${apiEndpoint}`);
        }

        const data = await res.json();
        const sum = data.reduce(
          (acc: number, curr: T) => acc + Number(curr.vl_amount),
          0,
        );

        set({ items: data, totalSum: sum, isLoading: false });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : "Unknown error",
          isLoading: false,
        });
      }
    },
  }));
}
