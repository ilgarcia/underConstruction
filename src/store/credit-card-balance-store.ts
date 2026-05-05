import { createTransactionStore } from "./transaction-factory";

export interface CreditCardBalanceRecord {
  id_credit_card_balance: string;
  id_credit_card: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
  dt_created: string;
  dt_updated: string;
}

export const useCreditCardBalanceStore = createTransactionStore<CreditCardBalanceRecord>(
  "/api/cash-flow/credit-card-balance",
);
