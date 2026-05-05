import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { useWalletStore } from "@/store/wallet-store";
import type { WalletRecord, UseWalletInitResult, UseWalletUpdateResult } from "./types";

function useWalletInit(): UseWalletInitResult {
  const isLoaded = useUserStore((state) => state.isLoaded);
  
  const wallet = useWalletStore((state) => state.wallet);
  const isLoading = useWalletStore((state) => state.isLoading);
  const error = useWalletStore((state) => state.error);
  const fetchWallet = useWalletStore((state) => state.fetchWallet);

  useEffect(() => {
    // Only fetch if user is loaded and we haven't fetched yet
    if (isLoaded && !wallet && !isLoading && !error) {
      fetchWallet();
    }
  }, [isLoaded, wallet, isLoading, error, fetchWallet]);

  return { wallet, isLoading, error };
}

function useWalletUpdate(): UseWalletUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateBalanceLocally = useWalletStore((state) => state.updateBalanceLocally);

  const updateBalance = async (id_user_wallet: string, vl_balance: number): Promise<void> => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/wallet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user_wallet, vl_balance }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to update wallet");
      }
      
      // Update local store so components reactive to the wallet state re-render
      updateBalanceLocally(vl_balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, updateBalance };
}

// Re-export types
export type { WalletRecord, UseWalletInitResult, UseWalletUpdateResult } from "./types";

// Internal exports
export { useWalletInit, useWalletUpdate };
