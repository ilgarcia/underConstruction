import { BaseTransactionRecord, CreateTransactionParams } from "@/store/transaction-factory";
import type { TransactionManagerStore } from "@/components/form/cash-flow-form/quick-transaction/transaction-manager/types";

interface ReceivableRecord extends BaseTransactionRecord {
  id_receivable: string;
}

interface UseReceivableCreateResult {
  isCreating: boolean;
  error: string | null;
  createReceivable: (
    params: CreateTransactionParams | CreateTransactionParams[],
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
  updateReceivable: (params: {
    id_receivable: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  }) => Promise<ReceivableRecord>;
}

interface UseReceivableListResult {
  receivables: ReceivableRecord[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseReceivablesManagerResult extends TransactionManagerStore {
  items: ReceivableRecord[];
}

export type {
  ReceivableRecord,
  UseReceivableCreateResult,
  UseReceivableDeleteResult,
  UseReceivableUpdateResult,
  UseReceivableListResult,
  UseReceivablesManagerResult,
};
