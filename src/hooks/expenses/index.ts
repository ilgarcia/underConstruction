import { cashFlowKeys } from "@/lib/query-keys";
import { useCashFlowList, useCashFlowMutation } from "@/hooks/cash-flow";
import type { CreateTransactionParams } from "@/hooks/cash-flow/types";
import type {
  ExpensesRecord,
  ExpensesUpdatePayload,
  UseExpensesCreateResult,
  UseExpensesDeleteResult,
  UseExpensesUpdateResult,
  UseExpensesListResult,
  UseExpensesManagerResult,
} from "./types";

const ENDPOINT = "/api/cash-flow/expenses";
const invalidate = [cashFlowKeys.expenses.all];

function useExpensesCreate(): UseExpensesCreateResult {
  const mutation = useCashFlowMutation<
    CreateTransactionParams | CreateTransactionParams[],
    ExpensesRecord | ExpensesRecord[]
  >({ url: ENDPOINT, method: "POST", errorMessage: "Failed to create expenses", invalidate });

  return {
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
    createExpenses: mutation.mutateAsync,
  };
}

function useExpensesDelete(): UseExpensesDeleteResult {
  const mutation = useCashFlowMutation<string[], unknown>({
    url: ENDPOINT,
    method: "DELETE",
    errorMessage: "Failed to delete expenses",
    toBody: (ids) => ({ ids }),
    invalidate,
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
    deleteExpenses: async (ids) => {
      await mutation.mutateAsync(ids);
    },
  };
}

function useExpensesUpdate(): UseExpensesUpdateResult {
  const mutation = useCashFlowMutation<ExpensesUpdatePayload, ExpensesRecord>({
    url: ENDPOINT,
    method: "PATCH",
    errorMessage: "Failed to update expenses",
    invalidate,
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
    updateExpenses: mutation.mutateAsync,
  };
}

function useExpensesList(id_user_wallet: string | undefined): UseExpensesListResult {
  const { items, ...rest } = useCashFlowList<ExpensesRecord>(
    cashFlowKeys.expenses.list(id_user_wallet ?? ""),
    id_user_wallet ? `${ENDPOINT}?wallet_id=${id_user_wallet}` : null,
    "Failed to load expenses",
  );

  return { expenses: items, ...rest };
}

function useExpensesManager(id_user_wallet: string | undefined): UseExpensesManagerResult {
  const { expenses: items, isLoading } = useExpensesList(id_user_wallet);
  const { createExpenses: onCreate } = useExpensesCreate();
  const { updateExpenses: onUpdate } = useExpensesUpdate();
  const { deleteExpenses: onDelete } = useExpensesDelete();

  return {
    items,
    isLoading,
    onCreate,
    onUpdate,
    onDelete,
    idUserWallet: id_user_wallet,
  };
}

// Re-export types
export type {
  ExpensesRecord,
  ExpensesUpdatePayload,
  UseExpensesCreateResult,
  UseExpensesDeleteResult,
  UseExpensesUpdateResult,
  UseExpensesListResult,
  UseExpensesManagerResult,
} from "./types";

// Internal exports
export {
  useExpensesCreate,
  useExpensesList,
  useExpensesDelete,
  useExpensesUpdate,
  useExpensesManager,
};
