import { useState, useEffect } from "react";
import { useExpensesStore } from "@/store/expenses-store";
import { BaseTransactionRecord, CreateTransactionParams } from "@/store/transaction-factory";

export interface ExpensesRecord extends BaseTransactionRecord {
  id_expense: string;
}

interface UseExpensesCreateResult {
  isCreating: boolean;
  error: string | null;
  createExpenses: (
    params: CreateTransactionParams | CreateTransactionParams[]
  ) => Promise<ExpensesRecord | ExpensesRecord[]>;
}

function useExpensesCreate(): UseExpensesCreateResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExpenses = async (
    params: CreateTransactionParams | CreateTransactionParams[]
  ): Promise<ExpensesRecord | ExpensesRecord[]> => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to create expenses");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, error, createExpenses };
}

interface UseExpensesDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteExpenses: (ids: string[]) => Promise<void>;
}

function useExpensesDelete(): UseExpensesDeleteResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteExpenses = async (ids: string[]) => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to delete expenses");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, deleteExpenses };
}

interface UseExpensesUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateExpenses: (params: {
    id_expense: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  }) => Promise<ExpensesRecord>;
}

function useExpensesUpdate(): UseExpensesUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateExpenses = async (params: {
    id_expense: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  }): Promise<ExpensesRecord> => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/expenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to update expenses");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, updateExpenses };
}

interface UseExpensesListResult {
  expenses: ExpensesRecord[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function useExpensesList(
  id_user_wallet: string | undefined,
): UseExpensesListResult {
  const { items: expenses, totalSum, isLoading, error, fetchItems: fetchExpenses } =
    useExpensesStore();

  useEffect(() => {
    if (id_user_wallet) {
      fetchExpenses(id_user_wallet);
    }
  }, [id_user_wallet, fetchExpenses]);

  return {
    expenses,
    totalSum,
    isLoading,
    error,
    refresh: () =>
      id_user_wallet ? fetchExpenses(id_user_wallet) : Promise.resolve(),
  };
}

export {
  useExpensesCreate,
  useExpensesList,
  useExpensesDelete,
  useExpensesUpdate,
};
