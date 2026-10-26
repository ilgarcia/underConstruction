import type {
  BaseTransactionRecord,
  CreateTransactionParams,
  UseCashFlowListResult,
} from "@/hooks/cash-flow/types";
import type { TransactionManagerStore } from "@/components/form/cash-flow-form/quick-transaction/transaction-manager/types";

interface ExpensesRecord extends BaseTransactionRecord {
  id_expense: string;
}

interface ExpensesUpdatePayload {
  id_expense: string;
  ds_description?: string;
  vl_amount?: number;
  vl_day?: number;
}

interface UseExpensesCreateResult {
  isCreating: boolean;
  error: string | null;
  createExpenses: (
    params: CreateTransactionParams | CreateTransactionParams[],
  ) => Promise<ExpensesRecord | ExpensesRecord[]>;
}

interface UseExpensesDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteExpenses: (ids: string[]) => Promise<void>;
}

interface UseExpensesUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateExpenses: (params: ExpensesUpdatePayload) => Promise<ExpensesRecord>;
}

interface UseExpensesListResult extends Omit<UseCashFlowListResult<ExpensesRecord>, "items"> {
  expenses: ExpensesRecord[];
}

interface UseExpensesManagerResult extends TransactionManagerStore {
  items: ExpensesRecord[];
}

export type {
  ExpensesRecord,
  ExpensesUpdatePayload,
  UseExpensesCreateResult,
  UseExpensesDeleteResult,
  UseExpensesUpdateResult,
  UseExpensesListResult,
  UseExpensesManagerResult,
};
