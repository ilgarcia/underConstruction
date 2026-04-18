import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";

// ---------------------------------------------------------------------------
// Shared type
// ---------------------------------------------------------------------------

interface WalletRecord {
  id_user_wallet: string;
  id_user: string;
  vl_balance: number;
  dt_created: string;
  dt_updated: string;
}

// ---------------------------------------------------------------------------
// useWalletInit — fetch or create the wallet record on mount
// ---------------------------------------------------------------------------

interface UseWalletInitResult {
  wallet: WalletRecord | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches (or initializes) the current user's wallet via GET /api/wallet.
 * Waits for the Zustand user store to hydrate before firing the request.
 * Creates a wallet with vl_balance = 0 if none exists (handled server-side).
 */
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

// ---------------------------------------------------------------------------
// useWalletUpdate — update vl_balance of an existing wallet record
// ---------------------------------------------------------------------------

interface UseWalletUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateBalance: (id_user_wallet: string, vl_balance: number) => Promise<void>;
}

/**
 * Exposes an updateBalance action that calls PATCH /api/wallet.
 */
function useWalletUpdate(): UseWalletUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBalance = async (
    id_user_wallet: string,
    vl_balance: number,
  ): Promise<void> => {
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

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export type { WalletRecord };
export { useWalletInit, useWalletUpdate };
