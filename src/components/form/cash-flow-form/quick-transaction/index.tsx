"use client";
import * as React from "react";
import {
  FormActionInput as Input,
  BaseDialog,
  ActionButton,
} from "@/components/custom";
import { Save } from "lucide-react";
import { Category } from "./card-invoices";
import { Expenses } from "./expenses";
import { Receivables } from "./receivables";
import { QuickTransactionFormProps } from "./types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  quickTransactionSchema,
  QuickTransactionData,
  QuickTransactionInput,
} from "./schema";
import { useWalletUpdate } from "@/hooks/use-wallet";
import { useReceivableList } from "@/hooks/use-receivable";
import { useExpensesList } from "@/hooks/use-expenses";

export function QuickTransaction({
  wallet,
}: QuickTransactionFormProps) {
  const { updateBalance } = useWalletUpdate();
  const { totalSum: totalReceivables } = useReceivableList(wallet?.id_user_wallet);
  const { totalSum: totalExpenses } = useExpensesList(wallet?.id_user_wallet);
  const [dialogConfig, setDialogConfig] = React.useState<{
    title: string;
    description?: React.ReactNode;
    content: React.ReactNode;
  } | null>(null);

  const form = useForm<
    QuickTransactionInput,
    undefined,
    QuickTransactionData
  >({
    resolver: zodResolver(quickTransactionSchema),
    defaultValues: { balance: 0, invoice: 0, expenses: 0, receivables: 0 },
  });

  // Atualiza apenas o saldo quando a carteira carregar da API
  React.useEffect(() => {
    if (wallet?.vl_balance !== undefined) {
      form.setValue("balance", wallet.vl_balance);
    }
  }, [wallet?.vl_balance, form]);

  // Sincronizam as somas totais do Zustand (calculadas globalmente) direto nos inputs em tempo real
  React.useEffect(() => {
    form.setValue("receivables", totalReceivables);
  }, [totalReceivables, form]);

  React.useEffect(() => {
    form.setValue("expenses", totalExpenses);
  }, [totalExpenses, form]);

  const onSubmit = async (data: QuickTransactionData) => {
    if (!wallet?.id_user_wallet) return;

    await updateBalance(wallet.id_user_wallet, data.balance);
  };

  const openDialog = (config: {
    title: string;
    description?: React.ReactNode;
    content: React.ReactNode;
  }) => {
    setDialogConfig(config);
  };

  const closeDialog = () => setDialogConfig(null);

  const fieldLabels = {
    balance: "Saldo",
    receivables: "Recebíveis",
    invoice: "Fatura",
    expenses: "Contas",
  };

  const { isSubmitting, dirtyFields } = form.formState;

  return (
    <div>
      <h3 className="text-lg font-bold mb-6 text-foreground uppercase tracking-tight">
        Lançamentos Rápidos
      </h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* 1. Saldo + Salvar */}
          <div className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-9">
              <Input
                control={form.control}
                name="balance"
                label={fieldLabels.balance}
                type="currency"
              />
            </div>
            <div className="col-span-3">
              <ActionButton
                type="submit"
                icon={<Save className="w-4 h-4" />}
                loading={isSubmitting}
                disabled={!dirtyFields.balance || isSubmitting}
              />
            </div>
          </div>

          {/* 2. Fatura (With button) */}
          <Input
            control={form.control}
            name="invoice"
            label={fieldLabels.invoice}
            type="currency"
            actionInput
            readOnlyInput
            onAction={() =>
              openDialog({
                title: `Categorizar: ${fieldLabels.invoice}`,
                content: (
                  <Category
                    targetLabel={fieldLabels.invoice}
                    onSubmit={(data) => {
                      console.log("Fatura categorizada:", data);
                      closeDialog();
                    }}
                  />
                ),
              })
            }
          />

          {/* 3. Contas (With button) */}
          <Input
            control={form.control}
            name="expenses"
            label={fieldLabels.expenses}
            type="currency"
            actionInput
            readOnlyInput
            onAction={() =>
              openDialog({
                title: `Categorizar: ${fieldLabels.expenses}`,
                content: (
                  <Expenses
                    targetLabel={fieldLabels.expenses}
                    idUserWallet={wallet?.id_user_wallet}
                    onSubmit={(data) => {
                      // Logica cash-flow-chart
                    }}
                  />
                ),
              })
            }
          />

          {/* 4. Recebíveis (With button, readOnly input) */}
          <Input
            control={form.control}
            name="receivables"
            label={fieldLabels.receivables}
            type="currency"
            actionInput
            readOnlyInput
            onAction={() =>
              openDialog({
                title: `Categorizar: ${fieldLabels.receivables}`,
                content: (
                  <Receivables
                    targetLabel={fieldLabels.receivables}
                    idUserWallet={wallet?.id_user_wallet}
                    onClose={closeDialog}
                    onSubmit={async (data) => {
                      // Logica cash-flow-chart
                    }}
                  />
                ),
              })
            }
          />
        </form>
      </Form>

      {/* Modular Base Dialog */}
      <BaseDialog
        isOpen={!!dialogConfig}
        onOpenChange={(open) => !open && closeDialog()}
        title={dialogConfig?.title || ""}
        description={dialogConfig?.description}
        className="md:min-w-4xl"
      >
        {dialogConfig?.content}
      </BaseDialog>
    </div>
  );
}