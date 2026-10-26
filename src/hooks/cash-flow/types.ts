import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { JsonMethod } from "@/lib/api-client";
import type { MonthlyFrequency } from "@/helpers/month";

interface BaseTransactionRecord {
  id_user_wallet: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
  dt_created: string;
  dt_updated: string;
}

type CreateTransactionParams = Omit<BaseTransactionRecord, "dt_created" | "dt_updated">;

/** Create params for items with a frequency (receivables, extra expenses). */
type CreateFrequencyParams = CreateTransactionParams & Partial<MonthlyFrequency>;

interface UseCashFlowListResult<T> {
  items: T[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
}

interface CashFlowMutationOptions<TVariables, TResult> {
  url: string;
  method: Exclude<JsonMethod, "GET">;
  errorMessage: string;
  /** Builds the request body from the mutation input (defaults to the input itself). */
  toBody?: (variables: TVariables) => unknown;
  /** Queries to refetch once the write succeeds; the mutation resolves after they reload. */
  invalidate?: readonly QueryKey[];
  /** Writes the result straight into the cache, for responses that carry the final value. */
  onSuccess?: (result: TResult, variables: TVariables, queryClient: QueryClient) => void;
}

export type {
  BaseTransactionRecord,
  CreateTransactionParams,
  CreateFrequencyParams,
  UseCashFlowListResult,
  CashFlowMutationOptions,
};
