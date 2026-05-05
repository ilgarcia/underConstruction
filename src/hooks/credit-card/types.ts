export interface CreditCardRecord {
  id_credit_card: string;
  id_user_wallet: string;
  ds_description: string;
  vl_balance: number;
  vl_day: number;
  dt_day_closing: number;
  dt_created: string;
  dt_updated: string;
}

export interface UseCreditCardInitResult {
  creditCards: CreditCardRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface CreditCardUpdatePayload {
  id_credit_card: string;
  ds_description: string;
  vl_balance: number;
  vl_day: number;
  dt_day_closing: number;
}

export interface UseCreditCardUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateCreditCard: (payload: CreditCardUpdatePayload) => Promise<void>;
}
