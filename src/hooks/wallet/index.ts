import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";
import type { WalletRecord, UseWalletInitResult, UseWalletUpdateResult } from "./types";

function useWalletInit(): UseWalletInitResult {
  const isLoaded = useUserStore((state) => state.isLoaded);

  const [wallet, setWallet] = useState<WalletRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;

    async function fetchOrCreateWallet() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/cash-flow/wallet");

        if (!res.ok) {
          const { error: msg } = await res.json();
          throw new Error(msg ?? "Failed to load wallet");
        }

        const data: WalletRecord = await res.json();

        if (!cancelled) {
          setWallet(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchOrCreateWallet();

    return () => {
      cancelled = true;
    };
  }, [isLoaded]);

  return { wallet, isLoading, error };
}

function useWalletUpdate(): UseWalletUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
