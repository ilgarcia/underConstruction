import { useState, useEffect } from "react";
import { useReceivableStore } from "@/store/receivable-store";
import type { CreateFrequencyParams } from "@/store/transaction-factory";
import type {
  ReceivableRecord,
  UseReceivableCreateResult,
  UseReceivableDeleteResult,
  UseReceivableUpdateResult,
  UseReceivableListResult,
  UseReceivablesManagerResult,
} from "./types";

function useReceivableCreate(): UseReceivableCreateResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReceivable = async (
    params: CreateFrequencyParams | CreateFrequencyParams[],
  ): Promise<ReceivableRecord | ReceivableRecord[]> => {
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

function useReceivableUpdate(): UseReceivableUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReceivable = async (params: {
    id_receivable: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
    dt_start_month?: string;
    nr_months?: number | null;
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

function useReceivableList(id_user_wallet: string | undefined): UseReceivableListResult {
  const {
    items: receivables,
    totalSum,
    isLoading,
    error,
    fetchItems: fetchReceivables,
  } = useReceivableStore();

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
    refresh: () => (id_user_wallet ? fetchReceivables(id_user_wallet) : Promise.resolve()),
  };
}

function useReceivablesManager(id_user_wallet: string | undefined): UseReceivablesManagerResult {
  const { receivables: items, isLoading, refresh } = useReceivableList(id_user_wallet);
  const { createReceivable: onCreate } = useReceivableCreate();
  const { updateReceivable: onUpdate } = useReceivableUpdate();
  const { deleteReceivables: onDelete } = useReceivableDelete();

  return {
    items,
    isLoading,
    refresh,
    onCreate,
    onUpdate,
    onDelete,
    idUserWallet: id_user_wallet,
  };
}

// Re-export types
export type {
  ReceivableRecord,
  UseReceivableCreateResult,
  UseReceivableDeleteResult,
  UseReceivableUpdateResult,
  UseReceivableListResult,
  UseReceivablesManagerResult,
} from "./types";

// Internal exports
export {
  useReceivableCreate,
  useReceivableList,
  useReceivableDelete,
  useReceivableUpdate,
  useReceivablesManager,
};
