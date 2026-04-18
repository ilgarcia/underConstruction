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
  } | Array<{
    id_user_wallet: string;
    ds_receivable: string;
    vl_receivable: number;
    vl_day_receivable: number;
  }>) => Promise<ReceivableRecord | ReceivableRecord[]>;
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
  } | Array<{
    id_user_wallet: string;
    ds_receivable: string;
    vl_receivable: number;
    vl_day_receivable: number;
  }>): Promise<ReceivableRecord | ReceivableRecord[]> => {
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

interface UseReceivableDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteReceivables: (ids: string[]) => Promise<void>;
}

/**
 * Exposes a deleteReceivables action that calls DELETE /api/cash-flow/receivable.
 */
function useReceivableDelete(): UseReceivableDeleteResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReceivables = async (ids: string[]) => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/receivable", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to delete receivables");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, deleteReceivables };
}

interface UseReceivableUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateReceivable: (params: {
    id_receivable: string;
    ds_receivable?: string;
    vl_receivable?: number;
    vl_day_receivable?: number;
  }) => Promise<ReceivableRecord>;
}

/**
 * Exposes an updateReceivable action that calls PATCH /api/cash-flow/receivable.
 */
function useReceivableUpdate(): UseReceivableUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReceivable = async (params: {
    id_receivable: string;
    ds_receivable?: string;
    vl_receivable?: number;
    vl_day_receivable?: number;
  }): Promise<ReceivableRecord> => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/receivable", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to update receivable");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, updateReceivable };
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
export { useReceivableCreate, useReceivableList, useReceivableDelete, useReceivableUpdate };
