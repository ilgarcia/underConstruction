import { useEffect, useState, useCallback } from "react";
import type { CreditCardRecord, UseCreditCardInitResult, UseCreditCardUpdateResult, CreditCardUpdatePayload } from "./types";

function useCreditCardInit(idUserWallet: string | undefined): UseCreditCardInitResult {
  const [creditCards, setCreditCards] = useState<CreditCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditCard = useCallback(async (cancelled = false) => {
    if (!idUserWallet) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/cash-flow/credit-card?id_user_wallet=${idUserWallet}`);

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to load credit cards");
      }

      const data = await res.json();

      if (!cancelled) {
        setCreditCards(data);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }
  }, [idUserWallet]);

  useEffect(() => {
    let cancelled = false;
    fetchCreditCard(cancelled);
    return () => {
      cancelled = true;
    };
  }, [fetchCreditCard]);

  const refresh = async () => {
    await fetchCreditCard(false);
  };

  return { creditCards, isLoading, error, refresh };
}

function useCreditCardUpdate(): UseCreditCardUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCreditCard = async (payload: CreditCardUpdatePayload): Promise<void> => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/credit-card", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to update credit card");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, updateCreditCard };
}

export type { CreditCardRecord, UseCreditCardInitResult, UseCreditCardUpdateResult, CreditCardUpdatePayload } from "./types";
export { useCreditCardInit, useCreditCardUpdate };
