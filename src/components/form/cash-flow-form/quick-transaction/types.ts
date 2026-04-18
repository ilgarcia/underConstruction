import { WalletRecord } from "@/hooks/use-wallet";

export interface QuickTransactionFormProps {
  className?: string;
  wallet?: WalletRecord | null;
  labels?: {
    balance?: string;
    receivables?: string;
    invoice?: string;
    accounts?: string;
  };
}
