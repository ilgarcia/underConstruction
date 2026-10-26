import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { requestJson } from "@/lib/api-client";
import type { CashFlowMutationOptions, UseCashFlowListResult } from "./types";

/**
 * Loads a list from a cash-flow route. `url` is null until its owner id is known,
 * which keeps the query disabled.
 */
function useCashFlowList<T extends { vl_amount: number }>(
  queryKey: QueryKey,
  url: string | null,
  errorMessage: string,
): UseCashFlowListResult<T> {
  const query = useQuery({
    queryKey,
    queryFn: () => requestJson<T[]>(url ?? "", errorMessage),
    enabled: url !== null,
  });

  // Stable empty array while loading, so memoized readers don't recompute every render
  const items = useMemo(() => query.data ?? [], [query.data]);
  const totalSum = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.vl_amount), 0),
    [items],
  );

  return {
    items,
    totalSum,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  };
}

/** A write to a cash-flow route that refreshes the affected queries on success. */
function useCashFlowMutation<TVariables, TResult>({
  url,
  method,
  errorMessage,
  toBody,
  invalidate = [],
  onSuccess,
}: CashFlowMutationOptions<TVariables, TResult>) {
  const queryClient = useQueryClient();

  return useMutation<TResult, Error, TVariables>({
    mutationFn: (variables) =>
      requestJson<TResult>(url, errorMessage, method, toBody ? toBody(variables) : variables),
    onSuccess: async (result, variables) => {
      onSuccess?.(result, variables, queryClient);
      await Promise.all(
        invalidate.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      );
    },
  });
}

// Re-export types
export type {
  BaseTransactionRecord,
  CreateTransactionParams,
  CreateFrequencyParams,
  UseCashFlowListResult,
  CashFlowMutationOptions,
} from "./types";

// Internal exports
export { useCashFlowList, useCashFlowMutation };
