import type { CreateTransactionParams, UseCashFlowListResult } from "@/hooks/cash-flow/types";

interface CreditCardBalanceRecord {
  id_credit_card_balance: string;
  id_credit_card: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
  dt_created: string;
  dt_updated: string;
}

interface CreditCardBalanceUpdatePayload {
  id_credit_card_balance: string;
  ds_description?: string;
  vl_amount?: number;
  vl_day?: number;
}

interface UseCreditCardBalanceCreateResult {
  isCreating: boolean;
  error: string | null;
  createCreditCardBalance: (
    params: CreateTransactionParams | CreateTransactionParams[],
  ) => Promise<CreditCardBalanceRecord | CreditCardBalanceRecord[]>;
}

interface UseCreditCardBalanceDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteCreditCardBalance: (ids: string[]) => Promise<void>;
}

interface UseCreditCardBalanceUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateCreditCardBalance: (
    params: CreditCardBalanceUpdatePayload,
  ) => Promise<CreditCardBalanceRecord>;
}

interface UseCreditCardBalanceListResult
  extends Omit<UseCashFlowListResult<CreditCardBalanceRecord>, "items"> {
  balances: CreditCardBalanceRecord[];
}

interface UseCreditCardBalanceManagerResult {
  items: CreditCardBalanceRecord[];
  isLoading: boolean;
  onCreate: (
    params: CreateTransactionParams | CreateTransactionParams[],
  ) => Promise<CreditCardBalanceRecord | CreditCardBalanceRecord[]>;
  onUpdate: (params: CreditCardBalanceUpdatePayload) => Promise<CreditCardBalanceRecord>;
  onDelete: (ids: string[]) => Promise<void>;
  idUserWallet: string | undefined;
}

export type {
  CreditCardBalanceRecord,
  CreditCardBalanceUpdatePayload,
  UseCreditCardBalanceCreateResult,
  UseCreditCardBalanceDeleteResult,
  UseCreditCardBalanceUpdateResult,
  UseCreditCardBalanceListResult,
  UseCreditCardBalanceManagerResult,
};
