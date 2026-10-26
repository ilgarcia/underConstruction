import { cashFlowKeys } from "@/lib/query-keys";
import { useCashFlowList, useCashFlowMutation } from "@/hooks/cash-flow";
import type { CreateTransactionParams } from "@/hooks/cash-flow/types";
import type {
  CreditCardBalanceRecord,
  CreditCardBalanceUpdatePayload,
  UseCreditCardBalanceCreateResult,
  UseCreditCardBalanceDeleteResult,
  UseCreditCardBalanceUpdateResult,
  UseCreditCardBalanceListResult,
  UseCreditCardBalanceManagerResult,
} from "./types";

const ENDPOINT = "/api/cash-flow/credit-card-balance";
// Refreshes both the edited card's list and the wallet-wide charges used by the projection
const invalidate = [cashFlowKeys.cardCharges.all];

function useCreditCardBalanceCreate(): UseCreditCardBalanceCreateResult {
  const mutation = useCashFlowMutation<
    CreateTransactionParams | CreateTransactionParams[],
    CreditCardBalanceRecord | CreditCardBalanceRecord[]
  >({
    url: ENDPOINT,
    method: "POST",
    errorMessage: "Failed to create credit card balance",
    invalidate,
  });

  return {
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
    createCreditCardBalance: mutation.mutateAsync,
  };
}

function useCreditCardBalanceDelete(): UseCreditCardBalanceDeleteResult {
  const mutation = useCashFlowMutation<string[], unknown>({
    url: ENDPOINT,
    method: "DELETE",
    errorMessage: "Failed to delete credit card balances",
    toBody: (ids) => ({ ids }),
    invalidate,
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
    deleteCreditCardBalance: async (ids) => {
      await mutation.mutateAsync(ids);
    },
  };
}

function useCreditCardBalanceUpdate(): UseCreditCardBalanceUpdateResult {
  const mutation = useCashFlowMutation<CreditCardBalanceUpdatePayload, CreditCardBalanceRecord>({
    url: ENDPOINT,
    method: "PATCH",
    errorMessage: "Failed to update credit card balance",
    invalidate,
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
    updateCreditCardBalance: mutation.mutateAsync,
  };
}

/** Recurring charges of one card. */
function useCreditCardBalanceList(
  id_credit_card: string | undefined,
): UseCreditCardBalanceListResult {
  const { items, ...rest } = useCashFlowList<CreditCardBalanceRecord>(
    cashFlowKeys.cardCharges.byCard(id_credit_card ?? ""),
    // The route reads the card id from `wallet_id`
    id_credit_card ? `${ENDPOINT}?wallet_id=${id_credit_card}` : null,
    "Failed to load credit card balances",
  );

  return { balances: items, ...rest };
}

function useCreditCardBalanceManager(
  id_credit_card: string | undefined,
): UseCreditCardBalanceManagerResult {
  const { balances: items, isLoading } = useCreditCardBalanceList(id_credit_card);
  const { createCreditCardBalance: onCreate } = useCreditCardBalanceCreate();
  const { updateCreditCardBalance: onUpdate } = useCreditCardBalanceUpdate();
  const { deleteCreditCardBalance: onDelete } = useCreditCardBalanceDelete();

  return {
    items,
    isLoading,
    onCreate,
    onUpdate,
    onDelete,
    // Pass the card id down as if it were a wallet id, keeping TransactionManager generic
    idUserWallet: id_credit_card,
  };
}

// Re-export types
export type {
  CreditCardBalanceRecord,
  CreditCardBalanceUpdatePayload,
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
