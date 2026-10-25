"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/helpers/currency";
import {
  formatMonthLong,
  formatMonthShort,
  isActiveInMonth,
  parseMonthKey,
  toMonthKey,
  type MonthlyFrequency,
} from "@/helpers/month";
import { AutoSaveInput } from "@/components/custom";
import {
  useWalletInit,
  useWalletUpdate,
  useReceivableList,
  useExpensesList,
  useExtraExpenseList,
  useCreditCardInit,
  useCardInvoiceSchedule,
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
  const idUserWallet = wallet?.id_user_wallet;
  const { updateBalance } = useWalletUpdate();
  const { receivables } = useReceivableList(idUserWallet);
  const { totalSum: totalExpenses } = useExpensesList(idUserWallet);
  const { extraExpenses } = useExtraExpenseList(idUserWallet);
  const { creditCards } = useCreditCardInit(idUserWallet);
  const { getSchedule, saveInvoice } = useCardInvoiceSchedule(idUserWallet);

  const today = new Date();
  const monthKey = toMonthKey(today);
  const monthShort = formatMonthShort(today).split("/")[0];
  const sumActive = (items: (MonthlyFrequency & { vl_amount: number })[]) =>
    items
      .filter((i) => isActiveInMonth(i, monthKey))
      .reduce((sum, i) => sum + Number(i.vl_amount), 0);
  const totalReceivables = sumActive(receivables);
  const totalExtras = sumActive(extraExpenses);

  // Next invoice of each card (the first one due today or later)
  const nextInvoices = creditCards.map((card) => ({ card, invoice: getSchedule(card, 1)[0] }));
  const singleCard = nextInvoices.length === 1 ? nextInvoices[0] : null;
  const invoiceMonth = singleCard?.invoice
    ? formatMonthLong(parseMonthKey(singleCard.invoice.monthKey))
    : "";
  const totalInvoices = nextInvoices.reduce((sum, { invoice }) => sum + (invoice?.total ?? 0), 0);

  const saveBalance = async (value: number | string) => {
    if (!idUserWallet) return;
    try {
      await updateBalance(idUserWallet, Number(value));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar o saldo.");
      throw err;
    }
  };

  const saveSingleInvoice = async (value: number | string) => {
    if (!singleCard?.invoice) return;
    try {
      await saveInvoice({
        id_credit_card: singleCard.card.id_credit_card,
        dt_month: singleCard.invoice.monthKey,
        vl_amount: Number(value),
      });
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
        {singleCard?.invoice ? (
          <AutoSaveInput
            key={singleCard.invoice.monthKey}
            label={`Fatura lançada · ${invoiceMonth}`}
            value={singleCard.invoice.launched}
            onSave={saveSingleInvoice}
            hideStatus
          />
        ) : (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Próximas faturas · {creditCards.length} cartões
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

      <Tile active={openPanel === "extras"}>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Gastos extras · {monthShort}
        </span>
        <span className="font-mono text-xl font-bold">− {formatCurrency(totalExtras)}</span>
        <ToggleButton
          panel="extras"
          label="Ver gastos extras"
          openPanel={openPanel}
          onToggle={onToggle}
        />
      </Tile>

      <Tile active={openPanel === "receivables"}>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recebíveis · {monthShort}
        </span>
        <span className="font-mono text-xl font-bold text-success">
          + {formatCurrency(totalReceivables)}
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
