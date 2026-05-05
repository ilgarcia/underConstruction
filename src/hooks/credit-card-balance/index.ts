import { useState, useEffect } from "react";
import { useCreditCardBalanceStore } from "@/store/credit-card-balance-store";
import type { CreateTransactionParams } from "@/store/transaction-factory";
import type {
  CreditCardBalanceRecord,
  UseCreditCardBalanceCreateResult,
  UseCreditCardBalanceDeleteResult,
  UseCreditCardBalanceUpdateResult,
  UseCreditCardBalanceListResult,
  UseCreditCardBalanceManagerResult,
} from "./types";

function useCreditCardBalanceCreate(): UseCreditCardBalanceCreateResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCreditCardBalance = async (
    params: CreateTransactionParams | CreateTransactionParams[],
  ): Promise<CreditCardBalanceRecord | CreditCardBalanceRecord[]> => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/credit-card-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to create credit card balance");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, error, createCreditCardBalance };
}

function useCreditCardBalanceDelete(): UseCreditCardBalanceDeleteResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCreditCardBalance = async (ids: string[]) => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/credit-card-balance", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to delete credit card balances");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, deleteCreditCardBalance };
}

function useCreditCardBalanceUpdate(): UseCreditCardBalanceUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCreditCardBalance = async (params: {
    id_credit_card_balance: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  }): Promise<CreditCardBalanceRecord> => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/credit-card-balance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to update credit card balance");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, updateCreditCardBalance };
}

function useCreditCardBalanceList(id_credit_card: string | undefined): UseCreditCardBalanceListResult {
  const {
    items: balances,
    totalSum,
    isLoading,
    error,
    fetchItems: fetchBalances,
  } = useCreditCardBalanceStore();

  useEffect(() => {
    if (id_credit_card) {
      fetchBalances(id_credit_card);
    }
  }, [id_credit_card, fetchBalances]);

  return {
    balances,
    totalSum,
    isLoading,
    error,
    refresh: () => (id_credit_card ? fetchBalances(id_credit_card) : Promise.resolve()),
  };
}

function useCreditCardBalanceManager(id_credit_card: string | undefined): UseCreditCardBalanceManagerResult {
  const { balances: items, isLoading, refresh } = useCreditCardBalanceList(id_credit_card);
  const { createCreditCardBalance: onCreate } = useCreditCardBalanceCreate();
  const { updateCreditCardBalance: onUpdate } = useCreditCardBalanceUpdate();
  const { deleteCreditCardBalance: onDelete } = useCreditCardBalanceDelete();

  return {
    items,
    isLoading,
    refresh,
    onCreate,
    onUpdate,
    onDelete,
    idUserWallet: id_credit_card, // Intercept and pass credit card ID down as if it were a wallet ID, keeping TransactionManager generic
  };
}

// Re-export types
export type {
  CreditCardBalanceRecord,
  UseCreditCardBalanceCreateResult,
  UseCreditCardBalanceDeleteResult,
  UseCreditCardBalanceUpdateResult,
  UseCreditCardBalanceListResult,
  UseCreditCardBalanceManagerResult,
} from "./types";

// Internal exports
export {
  useCreditCardBalanceCreate,
  useCreditCardBalanceList,
  useCreditCardBalanceDelete,
  useCreditCardBalanceUpdate,
  useCreditCardBalanceManager,
};
