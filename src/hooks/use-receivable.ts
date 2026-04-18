import { useState, useEffect } from "react";
import { useReceivableStore } from "@/store/receivable-store";

interface ReceivableRecord {
  id_receivable: string;
  id_user_wallet: string;
  ds_receivable: string;
  vl_receivable: number;
  vl_day_receivable: number;
  dt_created: string;
  dt_updated: string;
}

interface UseReceivableCreateResult {
  isCreating: boolean;
  error: string | null;
  createReceivable: (params: {
    id_user_wallet: string;
    ds_receivable: string;
    vl_receivable: number;
    vl_day_receivable: number;
  }) => Promise<ReceivableRecord>;
}

/**
 * Exposes a createReceivable action that calls POST /api/cash-flow/receivable.
 */
function useReceivableCreate(): UseReceivableCreateResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReceivable = async (params: {
    id_user_wallet: string;
    ds_receivable: string;
    vl_receivable: number;
    vl_day_receivable: number;
  }): Promise<ReceivableRecord> => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/receivable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to create receivable");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, error, createReceivable };
}

// ---------------------------------------------------------------------------
// useReceivableList — syncs with the global receivable store
// ---------------------------------------------------------------------------

interface UseReceivableListResult {
  receivables: ReceivableRecord[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function useReceivableList(id_user_wallet: string | undefined): UseReceivableListResult {
  const { receivables, totalSum, isLoading, error, fetchReceivables } = useReceivableStore();

  useEffect(() => {
    if (id_user_wallet) {
      fetchReceivables(id_user_wallet);
    }
  }, [id_user_wallet, fetchReceivables]);

  return { 
    receivables, 
    totalSum,
    isLoading, 
    error, 
    refresh: () => id_user_wallet ? fetchReceivables(id_user_wallet) : Promise.resolve() 
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export type { ReceivableRecord };
export { useReceivableCreate, useReceivableList };
