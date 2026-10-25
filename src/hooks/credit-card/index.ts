import { useEffect, useState } from "react";
import { useCreditCardStore } from "@/store/credit-card-store";
import type {
  CreditCardRecord,
  UseCreditCardInitResult,
  UseCreditCardUpdateResult,
  UseCreditCardCreateResult,
  UseCreditCardDeleteResult,
  CreditCardUpdatePayload,
  CreditCardCreatePayload,
} from "./types";

function useCreditCardInit(idUserWallet: string | undefined): UseCreditCardInitResult {
  const creditCards = useCreditCardStore((state) => state.creditCards);
  const walletId = useCreditCardStore((state) => state.walletId);
  const isLoading = useCreditCardStore((state) => state.isLoading);
  const error = useCreditCardStore((state) => state.error);
  const fetchCreditCards = useCreditCardStore((state) => state.fetchCreditCards);

  useEffect(() => {
    // Shared store: only fetch when the wallet changes
    if (idUserWallet && walletId !== idUserWallet) {
      fetchCreditCards(idUserWallet);
    }
  }, [idUserWallet, walletId, fetchCreditCards]);

  const refresh = async () => {
    if (idUserWallet) await fetchCreditCards(idUserWallet);
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

function useCreditCardCreate(): UseCreditCardCreateResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCreditCard = async (payload: CreditCardCreatePayload): Promise<CreditCardRecord> => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/credit-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to create credit card");
      }

      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, error, createCreditCard };
}

function useCreditCardDelete(): UseCreditCardDeleteResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCreditCard = async (id_credit_card: string): Promise<void> => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/cash-flow/credit-card", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_credit_card }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "Failed to delete credit card");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, deleteCreditCard };
}

export type {
  CreditCardRecord,
  UseCreditCardInitResult,
  UseCreditCardUpdateResult,
  UseCreditCardCreateResult,
  UseCreditCardDeleteResult,
  CreditCardUpdatePayload,
  CreditCardCreatePayload,
} from "./types";
export { useCreditCardInit, useCreditCardUpdate, useCreditCardCreate, useCreditCardDelete };
