"use client";

import * as React from "react";
import { CategoryFormProps } from "./types";
import { ActionButton, CustomTabs } from "@/components/custom";
import { useCreditCardInit, useCreditCardUpdate, useCreditCardBalanceManager } from "@/hooks";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormActionInput as Input } from "@/components/custom/input";
import { creditCardSchema, CreditCardData, CreditCardInput } from "./schema";
import { toast } from "sonner";
import { TransactionManager } from "../transaction-manager";

/**
 * Category - A scoped form component for categorizing transactions.
 */
export function Category({ targetLabel, idUserWallet, onSubmit }: CategoryFormProps) {
  const { creditCards, isLoading, error, refresh } = useCreditCardInit(idUserWallet);
  const { updateCreditCard } = useCreditCardUpdate();
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);
  const balanceManager = useCreditCardBalanceManager(selectedCardId || undefined);

  const form = useForm<CreditCardInput, undefined, CreditCardData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      ds_description: "",
      dt_day_closing: 1,
      vl_day: 1,
      vl_balance: 0,
    },
  });

  React.useEffect(() => {
    if (creditCards.length > 0 && !selectedCardId) {
      setSelectedCardId(creditCards[0].id_credit_card);
    }
  }, [creditCards, selectedCardId]);

  React.useEffect(() => {
    if (selectedCardId && creditCards) {
      const card = creditCards.find((c) => c.id_credit_card === selectedCardId);
      if (card) {
        form.reset({
          ds_description: card.ds_description,
          dt_day_closing: card.dt_day_closing,
          vl_day: card.vl_day,
          vl_balance: card.vl_balance,
        });
      }
    }
  }, [selectedCardId, creditCards, form]);

  const onFormSubmit = async (data: CreditCardData) => {
    if (!selectedCardId) return;

    try {
      await updateCreditCard({
        id_credit_card: selectedCardId,
        ...data,
      });
      form.reset(data);
      toast.success("Cartão atualizado com sucesso!");
      await refresh();
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar o cartão.");
    }
  };

  const { isSubmitting, isDirty } = form.formState;

  return (
    <div className="grid grid-cols-12 gap-6 pt-4 min-h-[600px]">
      <div className="col-span-2 flex flex-col h-full border-r border-border pr-2">
        <div className="flex-1 overflow-y-auto space-y-1">
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Carregando...</p>
          ) : error ? (
            <p className="text-xs text-red-500">Erro: {error}</p>
          ) : creditCards.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhum cartão</p>
          ) : (
            <CustomTabs
              items={creditCards.map(card => ({
                id: card.id_credit_card,
                label: card.ds_description,
              }))}
              selectedId={selectedCardId}
              onSelect={setSelectedCardId}
              vertical
            />
          )}
        </div>
        
        <div className="pt-4 mt-auto">
          <ActionButton
            label="Novo"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => console.log("Clicou em Novo Cartão")}
          />
        </div>
      </div>

      {/* Right Column: 10/12 */}
      <div className="col-span-10 h-full overflow-y-auto">
        {selectedCardId ? (
          <div className="p-1 w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onFormSubmit)} className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-3">
                  <Input
                    control={form.control}
                    name="ds_description"
                    label="Nome"
                    type="text"
                  />
                </div>
                
                <div className="col-span-2">
                  <Input
                    control={form.control}
                    name="dt_day_closing"
                    label="Fechamento"
                    type="day_picker"
                  />
                </div>
                
                <div className="col-span-2">
                  <Input
                    control={form.control}
                    name="vl_day"
                    label="Pagamento"
                    type="day_picker"
                  />
                </div>
                
                <div className="col-span-3">
                  <Input
                    control={form.control}
                    name="vl_balance"
                    label="Fatura"
                    type="currency"
                  />
                </div>

                <div className="col-span-2 pt-[22px]">
                  <ActionButton
                    type="submit"
                    label="Salvar"
                    loading={isSubmitting}
                    disabled={!isDirty || isSubmitting}
                  />
                </div>
              </form>
            </Form>
            
            <div className="mt-8 border-t border-border pt-4">
              <TransactionManager
                targetLabel="Fatura do Cartão"
                idKey="id_credit_card_balance"
                manager={balanceManager}
              />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Selecione um cartão ao lado.</p>
        )}
      </div>
    </div>
  );
}
