import { useQuery } from "@tanstack/react-query";
import { requestJson } from "@/lib/api-client";
import { cashFlowKeys } from "@/lib/query-keys";
import { useUserStore } from "@/store/user-store";
import { useCashFlowMutation } from "@/hooks/cash-flow";
import type { WalletRecord, UseWalletInitResult, UseWalletUpdateResult } from "./types";

const ENDPOINT = "/api/cash-flow/wallet";

/** Fetches (or creates, server side) the user's wallet once the session is known. */
function useWalletInit(): UseWalletInitResult {
  const isLoaded = useUserStore((state) => state.isLoaded);

  const query = useQuery({
    queryKey: cashFlowKeys.wallet,
    queryFn: () => requestJson<WalletRecord>(ENDPOINT, "Failed to load wallet"),
    enabled: isLoaded,
  });

  return {
    wallet: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  };
}

function useWalletUpdate(): UseWalletUpdateResult {
  const mutation = useCashFlowMutation<
    { id_user_wallet: string; vl_balance: number },
    WalletRecord
  >({
    url: ENDPOINT,
    method: "PATCH",
    errorMessage: "Failed to update wallet",
    // The new balance is known, so write it into the cache instead of refetching
    onSuccess: (_result, { vl_balance }, queryClient) => {
      queryClient.setQueryData<WalletRecord>(cashFlowKeys.wallet, (wallet) =>
        wallet ? { ...wallet, vl_balance } : wallet,
      );
    },
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
    updateBalance: async (id_user_wallet, vl_balance) => {
      await mutation.mutateAsync({ id_user_wallet, vl_balance });
    },
  };
}

// Re-export types
export type { WalletRecord, UseWalletInitResult, UseWalletUpdateResult } from "./types";

// Internal exports
export { useWalletInit, useWalletUpdate };
