import type {
  BaseTransactionRecord,
  CreateFrequencyParams,
  UseCashFlowListResult,
} from "@/hooks/cash-flow/types";
import type { MonthlyFrequency } from "@/helpers/month";
import type { TransactionManagerStore } from "@/components/form/cash-flow-form/quick-transaction/transaction-manager/types";

interface ExtraExpenseRecord extends BaseTransactionRecord, MonthlyFrequency {
  id_extra_expense: string;
}

interface ExtraExpenseUpdatePayload {
  id_extra_expense: string;
  ds_description?: string;
  vl_amount?: number;
  vl_day?: number;
  dt_start_month?: string;
  nr_months?: number | null;
}

interface UseExtraExpenseCreateResult {
  isCreating: boolean;
  error: string | null;
  createExtraExpense: (
    params: CreateFrequencyParams | CreateFrequencyParams[],
  ) => Promise<ExtraExpenseRecord | ExtraExpenseRecord[]>;
}

interface UseExtraExpenseDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteExtraExpenses: (ids: string[]) => Promise<void>;
}

interface UseExtraExpenseUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateExtraExpense: (params: ExtraExpenseUpdatePayload) => Promise<ExtraExpenseRecord>;
}

interface UseExtraExpenseListResult extends Omit<UseCashFlowListResult<ExtraExpenseRecord>, "items"> {
  extraExpenses: ExtraExpenseRecord[];
}

interface UseExtraExpensesManagerResult extends TransactionManagerStore {
  items: ExtraExpenseRecord[];
}

export type {
  ExtraExpenseRecord,
  ExtraExpenseUpdatePayload,
  UseExtraExpenseCreateResult,
  UseExtraExpenseDeleteResult,
  UseExtraExpenseUpdateResult,
  UseExtraExpenseListResult,
  UseExtraExpensesManagerResult,
};
