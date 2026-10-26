"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryFormProps } from "./types";
import { ActionButton, AutoSaveInput, CustomTabs, DaySelect } from "@/components/custom";
import {
  useCreditCardInit,
  useCreditCardUpdate,
  useCreditCardCreate,
  useCreditCardDelete,
  useCreditCardBalanceManager,
} from "@/hooks";
import type { CreditCardRecord, CreditCardUpdatePayload } from "@/hooks";
import { TransactionManager } from "../transaction-manager";
import { InvoiceSchedule } from "./invoice-schedule";

/**
 * Category - Manages the wallet's credit cards inline: card settings (saved on blur), the next
 * invoices (editable per month), card deletion and the recurring charges of the card.
 */
export function Category({ idUserWallet }: CategoryFormProps) {
  const { creditCards, isLoading, error } = useCreditCardInit(idUserWallet);
  const { updateCreditCard } = useCreditCardUpdate();
  const { createCreditCard, isCreating } = useCreditCardCreate();
  const { deleteCreditCard, isDeleting } = useCreditCardDelete();
  const [chosenCardId, setSelectedCardId] = React.useState<string | null>(null);
  // Card whose deletion is waiting for confirmation; switching cards cancels it
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  // Falls back to the first card while none is chosen or the chosen one no longer exists
  const selectedCardId = creditCards.some((c) => c.id_credit_card === chosenCardId)
    ? chosenCardId
    : (creditCards[0]?.id_credit_card ?? null);
  const confirmDelete = confirmDeleteId !== null && confirmDeleteId === selectedCardId;
  const balanceManager = useCreditCardBalanceManager(selectedCardId || undefined);

  const card = creditCards.find((c) => c.id_credit_card === selectedCardId);
  const canDelete = creditCards.length >= 2;

  const saveCard = async (changes: Partial<CreditCardUpdatePayload>) => {
    if (!card) return;
    const payload: CreditCardUpdatePayload = {
      id_credit_card: card.id_credit_card,
      ds_description: card.ds_description,
      vl_day: card.vl_day,
      dt_day_closing: card.dt_day_closing,
      ...changes,
    };
    try {
      await updateCreditCard(payload);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar o cartão.");
      throw err;
    }
  };

  const handleCreate = async () => {
    if (!idUserWallet) return;
    try {
      const created: CreditCardRecord = await createCreditCard({
        id_user_wallet: idUserWallet,
        ds_description: `Cartão ${creditCards.length + 1}`,
      });
      setSelectedCardId(created.id_credit_card);
      toast.success("Cartão criado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar o cartão.");
    }
  };

  const handleDelete = async () => {
    if (!card) return;
    try {
      await deleteCreditCard(card.id_credit_card);
      setSelectedCardId(null);
      toast.success("Cartão excluído.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir o cartão.");
    }
  };

  if (isLoading && creditCards.length === 0) {
    return <p className="text-xs text-muted-foreground">Carregando...</p>;
  }

  if (error) {
    return <p className="text-xs text-destructive">Erro: {error}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <CustomTabs
          items={creditCards.map((c) => ({ id: c.id_credit_card, label: c.ds_description }))}
          selectedId={selectedCardId}
          onSelect={setSelectedCardId}
          className="flex-wrap"
        />
        <ActionButton
          label="Novo cartão"
          icon={<Plus className="size-4" />}
          loading={isCreating}
          onClick={handleCreate}
          className="w-auto px-3 bg-transparent border border-dashed border-input shadow-none"
        />
      </div>

      {card && (
        <>
          <div className="flex flex-wrap items-start gap-3">
            <AutoSaveInput
              key={`name-${card.id_credit_card}`}
              label="Nome"
              type="text"
              value={card.ds_description}
              onSave={(v) => saveCard({ ds_description: String(v) })}
              containerClassName="flex-[2_1_200px] min-w-0"
              hideStatus
            />
            <DaySelect
              key={`closing-${card.id_credit_card}`}
              label="Fechamento"
              value={card.dt_day_closing}
              onChange={(day) => saveCard({ dt_day_closing: day }).catch(() => undefined)}
              containerClassName="flex-[1_1_140px]"
            />
            <DaySelect
              key={`payment-${card.id_credit_card}`}
              label="Pagamento"
              value={card.vl_day}
              onChange={(day) => saveCard({ vl_day: day }).catch(() => undefined)}
              containerClassName="flex-[1_1_140px]"
            />
          </div>

          <InvoiceSchedule card={card} idUserWallet={idUserWallet} />

          {canDelete && (
            <div className="flex flex-col gap-3">
              {confirmDelete ? (
                <div
                  role="alert"
                  className="flex flex-wrap items-center justify-between gap-3 border border-destructive bg-destructive/10 px-4 py-3"
                >
                  <span className="text-sm">
                    Excluir <strong>{card.ds_description}</strong>? Os recorrentes e as faturas dele saem da projeção.
                  </span>
                  <div className="flex gap-2">
                    <ActionButton
                      label="Cancelar"
                      onClick={() => setConfirmDeleteId(null)}
                      className="w-auto px-4 bg-transparent border border-input"
                    />
                    <ActionButton
                      label="Excluir"
                      loading={isDeleting}
                      onClick={handleDelete}
                      className="w-auto px-4 bg-destructive text-background font-bold"
                    />
                  </div>
                </div>
              ) : (
                <ActionButton
                  label="Excluir cartão"
                  icon={<Trash2 className="size-4" />}
                  onClick={() => setConfirmDeleteId(selectedCardId)}
                  className="w-auto self-end px-4 bg-transparent border border-destructive text-destructive"
                />
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-border pt-5">
            <h4 className="text-sm font-bold">Gastos recorrentes do cartão</h4>
            <p className="text-xs text-muted-foreground">
              Entram automaticamente na fatura de todos os meses, no dia informado.
            </p>
            <TransactionManager
              targetLabel="Gasto recorrente"
              listTitle="Recorrentes cadastrados"
              idKey="id_credit_card_balance"
              manager={balanceManager}
            />
          </div>
        </>
      )}
    </div>
  );
}
