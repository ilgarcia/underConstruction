"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/helpers/currency";
import { AutoSaveInput } from "@/components/custom";
import {
  useWalletInit,
  useWalletUpdate,
  useReceivableList,
  useExpensesList,
  useCreditCardInit,
  useCreditCardUpdate,
} from "@/hooks";
import type { PanelKey } from "../types";
import { SummaryCardsProps } from "./types";

function Tile({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 border bg-card p-4",
        active ? "border-primary" : "border-border",
      )}
    >
      {children}
    </div>
  );
}

function ToggleButton({
  panel,
  label,
  openPanel,
  onToggle,
}: {
  panel: PanelKey;
  label: string;
} & SummaryCardsProps) {
  const isOpen = openPanel === panel;
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls="cash-flow-details"
      onClick={() => onToggle(panel)}
      className="mt-auto flex h-10 items-center justify-between border border-input px-3 text-left text-sm font-semibold transition-colors hover:bg-muted"
    >
      {isOpen ? "Fechar" : label}
      {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
    </button>
  );
}

/**
 * SummaryCards - The month at a glance. Balance and invoice save on blur; the other cards
 * open their details inline, below the cards, instead of in a dialog.
 */
export function SummaryCards({ openPanel, onToggle }: SummaryCardsProps) {
  const { wallet } = useWalletInit();
  const { updateBalance } = useWalletUpdate();
  const { totalSum: totalReceivables } = useReceivableList(wallet?.id_user_wallet);
  const { totalSum: totalExpenses } = useExpensesList(wallet?.id_user_wallet);
  const { creditCards, refresh: refreshCards } = useCreditCardInit(wallet?.id_user_wallet);
  const { updateCreditCard } = useCreditCardUpdate();

  const singleCard = creditCards.length === 1 ? creditCards[0] : null;
  const totalInvoices = creditCards.reduce((sum, c) => sum + Number(c.vl_balance), 0);
  const monthName = new Date().toLocaleDateString("pt-BR", { month: "long" });

  const saveBalance = async (value: number | string) => {
    if (!wallet?.id_user_wallet) return;
    try {
      await updateBalance(wallet.id_user_wallet, Number(value));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar o saldo.");
      throw err;
    }
  };

  const saveInvoice = async (value: number | string) => {
    if (!singleCard) return;
    try {
      await updateCreditCard({
        id_credit_card: singleCard.id_credit_card,
        ds_description: singleCard.ds_description,
        vl_balance: Number(value),
        vl_day: singleCard.vl_day,
        dt_day_closing: singleCard.dt_day_closing,
      });
      await refreshCards();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar a fatura.");
      throw err;
    }
  };

  return (
    <section
      aria-label="Resumo do mês"
      className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3"
    >
      <Tile>
        <AutoSaveInput
          label="Saldo em conta"
          value={wallet?.vl_balance ? Number(wallet.vl_balance) : 0}
          onSave={saveBalance}
          disabled={!wallet}
        />
      </Tile>

      <Tile active={openPanel === "card"}>
        {singleCard ? (
          <AutoSaveInput
            label={`Fatura lançada · ${monthName}`}
            value={Number(singleCard.vl_balance)}
            onSave={saveInvoice}
            hideStatus
          />
        ) : (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Faturas lançadas · {creditCards.length} cartões
            </span>
            <p className="flex h-9 items-center font-mono text-lg font-bold">
              {formatCurrency(totalInvoices)}
            </p>
          </div>
        )}
        <ToggleButton
          panel="card"
          label="Ver faturas e cartões"
          openPanel={openPanel}
          onToggle={onToggle}
        />
      </Tile>

      <Tile active={openPanel === "expenses"}>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contas fixas · mês
        </span>
        <span className="font-mono text-xl font-bold">− {formatCurrency(totalExpenses ?? 0)}</span>
        <ToggleButton
          panel="expenses"
          label="Ver contas"
          openPanel={openPanel}
          onToggle={onToggle}
        />
      </Tile>

      <Tile active={openPanel === "receivables"}>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recebíveis · mês
        </span>
        <span className="font-mono text-xl font-bold text-success">
          + {formatCurrency(totalReceivables ?? 0)}
        </span>
        <ToggleButton
          panel="receivables"
          label="Ver recebíveis"
          openPanel={openPanel}
          onToggle={onToggle}
        />
      </Tile>
    </section>
  );
}
