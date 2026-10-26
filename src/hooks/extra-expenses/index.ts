import { cashFlowKeys } from "@/lib/query-keys";
import { useCashFlowList, useCashFlowMutation } from "@/hooks/cash-flow";
import type { CreateFrequencyParams } from "@/hooks/cash-flow/types";
import type {
  ExtraExpenseRecord,
  ExtraExpenseUpdatePayload,
  UseExtraExpenseCreateResult,
  UseExtraExpenseDeleteResult,
  UseExtraExpenseUpdateResult,
  UseExtraExpenseListResult,
  UseExtraExpensesManagerResult,
} from "./types";

const ENDPOINT = "/api/cash-flow/extra-expense";
const invalidate = [cashFlowKeys.extraExpenses.all];

function useExtraExpenseCreate(): UseExtraExpenseCreateResult {
  const mutation = useCashFlowMutation<
    CreateFrequencyParams | CreateFrequencyParams[],
    ExtraExpenseRecord | ExtraExpenseRecord[]
  >({ url: ENDPOINT, method: "POST", errorMessage: "Failed to create extra expense", invalidate });

  return {
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
    createExtraExpense: mutation.mutateAsync,
  };
}

function useExtraExpenseDelete(): UseExtraExpenseDeleteResult {
  const mutation = useCashFlowMutation<string[], unknown>({
    url: ENDPOINT,
    method: "DELETE",
    errorMessage: "Failed to delete extra expenses",
    toBody: (ids) => ({ ids }),
    invalidate,
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
    deleteExtraExpenses: async (ids) => {
      await mutation.mutateAsync(ids);
    },
  };
}

function useExtraExpenseUpdate(): UseExtraExpenseUpdateResult {
  const mutation = useCashFlowMutation<ExtraExpenseUpdatePayload, ExtraExpenseRecord>({
    url: ENDPOINT,
    method: "PATCH",
    errorMessage: "Failed to update extra expense",
    invalidate,
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
    updateExtraExpense: mutation.mutateAsync,
  };
}

function useExtraExpenseList(id_user_wallet: string | undefined): UseExtraExpenseListResult {
  const { items, ...rest } = useCashFlowList<ExtraExpenseRecord>(
    cashFlowKeys.extraExpenses.list(id_user_wallet ?? ""),
    id_user_wallet ? `${ENDPOINT}?wallet_id=${id_user_wallet}` : null,
    "Failed to load extra expenses",
  );

  return { extraExpenses: items, ...rest };
}

function useExtraExpensesManager(
  id_user_wallet: string | undefined,
): UseExtraExpensesManagerResult {
  const { extraExpenses: items, isLoading } = useExtraExpenseList(id_user_wallet);
  const { createExtraExpense: onCreate } = useExtraExpenseCreate();
  const { updateExtraExpense: onUpdate } = useExtraExpenseUpdate();
  const { deleteExtraExpenses: onDelete } = useExtraExpenseDelete();

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
  ExtraExpenseRecord,
  ExtraExpenseUpdatePayload,
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
