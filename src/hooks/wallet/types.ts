interface WalletRecord {
  id_user_wallet: string;
  id_user: string;
  vl_balance: number;
  dt_created: string;
  dt_updated: string;
}

interface UseWalletInitResult {
  wallet: WalletRecord | null;
  isLoading: boolean;
  error: string | null;
}

interface UseWalletUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateBalance: (id_user_wallet: string, vl_balance: number) => Promise<void>;
}

export type { WalletRecord, UseWalletInitResult, UseWalletUpdateResult };
