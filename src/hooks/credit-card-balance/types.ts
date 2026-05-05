import type { CreateTransactionParams } from "@/store/transaction-factory";
import type { CreditCardBalanceRecord } from "@/store/credit-card-balance-store";

export type { CreditCardBalanceRecord };

export interface UseCreditCardBalanceCreateResult {
  isCreating: boolean;
  error: string | null;
  createCreditCardBalance: (
    params: CreateTransactionParams | CreateTransactionParams[],
  ) => Promise<CreditCardBalanceRecord | CreditCardBalanceRecord[]>;
}

export interface UseCreditCardBalanceDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteCreditCardBalance: (ids: string[]) => Promise<void>;
}

export interface UseCreditCardBalanceUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateCreditCardBalance: (params: {
    id_credit_card_balance: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  }) => Promise<CreditCardBalanceRecord>;
}

export interface UseCreditCardBalanceListResult {
  balances: CreditCardBalanceRecord[];
  totalSum: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseCreditCardBalanceManagerResult {
  items: CreditCardBalanceRecord[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  onCreate: (
    params: CreateTransactionParams | CreateTransactionParams[],
  ) => Promise<CreditCardBalanceRecord | CreditCardBalanceRecord[]>;
  onUpdate: (params: {
    id_credit_card_balance: string;
    ds_description?: string;
    vl_amount?: number;
    vl_day?: number;
  }) => Promise<CreditCardBalanceRecord>;
  onDelete: (ids: string[]) => Promise<void>;
  idUserWallet: string | undefined;
}
