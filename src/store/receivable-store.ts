import { createTransactionStore } from "./transaction-factory";

export interface ReceivableRecord {
  id_receivable: string;
  id_user_wallet: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
  dt_created: string;
  dt_updated: string;
}

export const useReceivableStore = createTransactionStore<ReceivableRecord>("/api/cash-flow/receivable");

