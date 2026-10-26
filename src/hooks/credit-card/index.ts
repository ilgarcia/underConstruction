import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { requestJson } from "@/lib/api-client";
import { cashFlowKeys } from "@/lib/query-keys";
import { useCashFlowMutation } from "@/hooks/cash-flow";
import type {
  CreditCardRecord,
  UseCreditCardInitResult,
  UseCreditCardUpdateResult,
  UseCreditCardCreateResult,
  UseCreditCardDeleteResult,
  CreditCardUpdatePayload,
  CreditCardCreatePayload,
} from "./types";

const ENDPOINT = "/api/cash-flow/credit-card";

function useCreditCardInit(idUserWallet: string | undefined): UseCreditCardInitResult {
  const query = useQuery({
    queryKey: cashFlowKeys.creditCards.list(idUserWallet ?? ""),
    queryFn: () =>
      requestJson<CreditCardRecord[]>(
        `${ENDPOINT}?id_user_wallet=${idUserWallet}`,
        "Failed to load credit cards",
      ),
    enabled: Boolean(idUserWallet),
  });

  const creditCards = useMemo(() => query.data ?? [], [query.data]);

  return {
    creditCards,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  };
}

function useCreditCardUpdate(): UseCreditCardUpdateResult {
  const mutation = useCashFlowMutation<CreditCardUpdatePayload, CreditCardRecord>({
    url: ENDPOINT,
    method: "PATCH",
    errorMessage: "Failed to update credit card",
    invalidate: [cashFlowKeys.creditCards.all],
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
    updateCreditCard: async (payload) => {
      await mutation.mutateAsync(payload);
    },
  };
}

function useCreditCardCreate(): UseCreditCardCreateResult {
  const mutation = useCashFlowMutation<CreditCardCreatePayload, CreditCardRecord>({
    url: ENDPOINT,
    method: "POST",
    errorMessage: "Failed to create credit card",
    invalidate: [cashFlowKeys.creditCards.all],
  });

  return {
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
    createCreditCard: mutation.mutateAsync,
  };
}

function useCreditCardDelete(): UseCreditCardDeleteResult {
  const mutation = useCashFlowMutation<string, unknown>({
    url: ENDPOINT,
    method: "DELETE",
    errorMessage: "Failed to delete credit card",
    toBody: (id_credit_card) => ({ id_credit_card }),
    // The card's recurring charges and invoices go with it
    invalidate: [
      cashFlowKeys.creditCards.all,
      cashFlowKeys.cardCharges.all,
      cashFlowKeys.invoices.all,
    ],
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
    deleteCreditCard: async (id_credit_card) => {
      await mutation.mutateAsync(id_credit_card);
    },
  };
}

export type {
  CreditCardRecord,
  UseCreditCardInitResult,
  UseCreditCardUpdateResult,
  UseCreditCardCreateResult,
  UseCreditCardDeleteResult,
  CreditCardUpdatePayload,
  CreditCardCreatePayload,
} from "./types";
export { useCreditCardInit, useCreditCardUpdate, useCreditCardCreate, useCreditCardDelete };
