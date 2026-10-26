import type {
  BaseTransactionRecord,
  CreateFrequencyParams,
  UseCashFlowListResult,
} from "@/hooks/cash-flow/types";
import type { MonthlyFrequency } from "@/helpers/month";
import type { TransactionManagerStore } from "@/components/form/cash-flow-form/quick-transaction/transaction-manager/types";

interface ReceivableRecord extends BaseTransactionRecord, MonthlyFrequency {
  id_receivable: string;
}

interface ReceivableUpdatePayload {
  id_receivable: string;
  ds_description?: string;
  vl_amount?: number;
  vl_day?: number;
  dt_start_month?: string;
  nr_months?: number | null;
}

interface UseReceivableCreateResult {
  isCreating: boolean;
  error: string | null;
  createReceivable: (
    params: CreateFrequencyParams | CreateFrequencyParams[],
  ) => Promise<ReceivableRecord | ReceivableRecord[]>;
}

interface UseReceivableDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteReceivables: (ids: string[]) => Promise<void>;
}

interface UseReceivableUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateReceivable: (params: ReceivableUpdatePayload) => Promise<ReceivableRecord>;
}

interface UseReceivableListResult extends Omit<UseCashFlowListResult<ReceivableRecord>, "items"> {
  receivables: ReceivableRecord[];
}

interface UseReceivablesManagerResult extends TransactionManagerStore {
  items: ReceivableRecord[];
}

export type {
  ReceivableRecord,
  ReceivableUpdatePayload,
  UseReceivableCreateResult,
  UseReceivableDeleteResult,
  UseReceivableUpdateResult,
  UseReceivableListResult,
  UseReceivablesManagerResult,
};
