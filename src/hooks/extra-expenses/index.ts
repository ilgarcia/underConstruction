import { useState, useEffect } from "react";
import { useExtraExpenseStore } from "@/store/extra-expense-store";
import type { CreateFrequencyParams } from "@/store/transaction-factory";
import type {
  ExtraExpenseRecord,
  UseExtraExpenseCreateResult,
  UseExtraExpenseDeleteResult,
  UseExtraExpenseUpdateResult,
  UseExtraExpenseListResult,
  UseExtraExpensesManagerResult,
} from "./types";

function useExtraExpenseCreate(): UseExtraExpenseCreateResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExtraExpense = async (
    params: CreateFrequencyParams | CreateFrequencyParams[],
  ): Promise<ExtraExpenseRecord | ExtraExpenseRecord[]> => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/extra-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to create extra expense");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, error, createExtraExpense };
}

function useExtraExpenseDelete(): UseExtraExpenseDeleteResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteExtraExpenses = async (ids: string[]) => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/extra-expense", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to delete extra expenses");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, deleteExtraExpenses };
}

function useExtraExpenseUpdate(): UseExtraExpenseUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateExtraExpense = async (params: {
    id_extra_expense: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
    dt_start_month?: string;
    nr_months?: number | null;
  }): Promise<ExtraExpenseRecord> => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/extra-expense", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to update extra expense");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, updateExtraExpense };
}

function useExtraExpenseList(id_user_wallet: string | undefined): UseExtraExpenseListResult {
  const {
    items: extraExpenses,
    totalSum,
    isLoading,
    error,
    fetchItems: fetchExtraExpenses,
  } = useExtraExpenseStore();

  useEffect(() => {
    if (id_user_wallet) {
      fetchExtraExpenses(id_user_wallet);
    }
  }, [id_user_wallet, fetchExtraExpenses]);

  return {
    extraExpenses,
    totalSum,
    isLoading,
    error,
    refresh: () => (id_user_wallet ? fetchExtraExpenses(id_user_wallet) : Promise.resolve()),
  };
}

function useExtraExpensesManager(
  id_user_wallet: string | undefined,
): UseExtraExpensesManagerResult {
  const { extraExpenses: items, isLoading, refresh } = useExtraExpenseList(id_user_wallet);
  const { createExtraExpense: onCreate } = useExtraExpenseCreate();
  const { updateExtraExpense: onUpdate } = useExtraExpenseUpdate();
  const { deleteExtraExpenses: onDelete } = useExtraExpenseDelete();

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
  ExtraExpenseRecord,
  UseExtraExpenseCreateResult,
  UseExtraExpenseDeleteResult,
  UseExtraExpenseUpdateResult,
  UseExtraExpenseListResult,
  UseExtraExpensesManagerResult,
} from "./types";

// Internal exports
export {
  useExtraExpenseCreate,
  useExtraExpenseList,
  useExtraExpenseDelete,
  useExtraExpenseUpdate,
  useExtraExpensesManager,
};
