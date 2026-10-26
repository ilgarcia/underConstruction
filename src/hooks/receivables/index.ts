import { cashFlowKeys } from "@/lib/query-keys";
import { useCashFlowList, useCashFlowMutation } from "@/hooks/cash-flow";
import type { CreateFrequencyParams } from "@/hooks/cash-flow/types";
import type {
  ReceivableRecord,
  ReceivableUpdatePayload,
  UseReceivableCreateResult,
  UseReceivableDeleteResult,
  UseReceivableUpdateResult,
  UseReceivableListResult,
  UseReceivablesManagerResult,
} from "./types";

const ENDPOINT = "/api/cash-flow/receivable";
const invalidate = [cashFlowKeys.receivables.all];

function useReceivableCreate(): UseReceivableCreateResult {
  const mutation = useCashFlowMutation<
    CreateFrequencyParams | CreateFrequencyParams[],
    ReceivableRecord | ReceivableRecord[]
  >({ url: ENDPOINT, method: "POST", errorMessage: "Failed to create receivable", invalidate });

  return {
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
    createReceivable: mutation.mutateAsync,
  };
}

function useReceivableDelete(): UseReceivableDeleteResult {
  const mutation = useCashFlowMutation<string[], unknown>({
    url: ENDPOINT,
    method: "DELETE",
    errorMessage: "Failed to delete receivables",
    toBody: (ids) => ({ ids }),
    invalidate,
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
    deleteReceivables: async (ids) => {
      await mutation.mutateAsync(ids);
    },
  };
}

function useReceivableUpdate(): UseReceivableUpdateResult {
  const mutation = useCashFlowMutation<ReceivableUpdatePayload, ReceivableRecord>({
    url: ENDPOINT,
    method: "PATCH",
    errorMessage: "Failed to update receivable",
    invalidate,
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
    updateReceivable: mutation.mutateAsync,
  };
}

function useReceivableList(id_user_wallet: string | undefined): UseReceivableListResult {
  const { items, ...rest } = useCashFlowList<ReceivableRecord>(
    cashFlowKeys.receivables.list(id_user_wallet ?? ""),
    id_user_wallet ? `${ENDPOINT}?wallet_id=${id_user_wallet}` : null,
    "Failed to load receivables",
  );

  return { receivables: items, ...rest };
}

function useReceivablesManager(
  id_user_wallet: string | undefined,
): UseReceivablesManagerResult {
  const { receivables: items, isLoading } = useReceivableList(id_user_wallet);
  const { createReceivable: onCreate } = useReceivableCreate();
  const { updateReceivable: onUpdate } = useReceivableUpdate();
  const { deleteReceivables: onDelete } = useReceivableDelete();

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
  ReceivableRecord,
  ReceivableUpdatePayload,
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
