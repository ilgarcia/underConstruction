"use client";

import { X } from "lucide-react";
import { useWalletInit } from "@/hooks";
import { Category } from "../quick-transaction/card-invoices";
import { Expenses } from "../quick-transaction/expenses";
import { ExtraExpenses } from "../quick-transaction/extra-expenses";
import { Receivables } from "../quick-transaction/receivables";
import type { PanelKey } from "../types";
import { DetailPanelProps } from "./types";

const TITLES: Record<PanelKey, string> = {
  card: "Cartões e faturas",
  expenses: "Contas fixas",
  extras: "Gastos extras",
  receivables: "Recebíveis",
};

/**
 * DetailPanel - Opens below the summary cards (no dialog, friendlier on phones)
 * and closes with the X button in the top-right corner.
 */
export function DetailPanel({ panel, onClose }: DetailPanelProps) {
  const { wallet } = useWalletInit();
  const idUserWallet = wallet?.id_user_wallet;

  return (
    <section
      id="cash-flow-details"
      aria-label={TITLES[panel]}
      className="relative flex flex-col gap-5 border border-primary bg-card p-4 pr-14 sm:p-6 sm:pr-16"
    >
      <button
        type="button"
        aria-label="Fechar detalhes"
        onClick={onClose}
        className="absolute right-3 top-3 flex size-10 items-center justify-center border border-input transition-colors hover:bg-muted"
      >
        <X className="size-4" />
      </button>

      <h2 className="text-base font-bold">{TITLES[panel]}</h2>

      {panel === "card" && <Category idUserWallet={idUserWallet} />}
      {panel === "expenses" && (
        <Expenses
          targetLabel="Contas"
          listTitle="Contas cadastradas"
          idUserWallet={idUserWallet}
        />
      )}
      {panel === "extras" && (
        <ExtraExpenses
          targetLabel="Gasto extra"
          listTitle="Gastos extras cadastrados"
          idUserWallet={idUserWallet}
        />
      )}
      {panel === "receivables" && (
        <Receivables
          targetLabel="Recebíveis"
          listTitle="Recebíveis cadastrados"
          idUserWallet={idUserWallet}
        />
      )}
    </section>
  );
}
