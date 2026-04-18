"use client";
import * as React from "react";
import {
  FormActionInput as Input,
  BaseDialog,
  ActionButton,
} from "@/components/custom";
import { Save } from "lucide-react";
import { Category } from "./category";
import { Accounts } from "./accounts";
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
import { useReceivableCreate, useReceivableList } from "@/hooks/use-receivable";

export function QuickTransaction({
  className,
  labels,
  wallet,
}: QuickTransactionFormProps) {
  const { updateBalance } = useWalletUpdate();
  const { createReceivable } = useReceivableCreate();
  const { totalSum } = useReceivableList(wallet?.id_user_wallet);
  const [dialogConfig, setDialogConfig] = React.useState<{
    title: string;
    description?: React.ReactNode;
    content: React.ReactNode;
  } | null>(null);

  const [initialData, setInitialData] =
    React.useState<QuickTransactionData>({
      balance: 0,
      invoice: 0,
      accounts: 0,
      receivables: 0,
    });

  const form = useForm<
    QuickTransactionInput,
    undefined,
    QuickTransactionData
  >({
    resolver: zodResolver(quickTransactionSchema),
    defaultValues: initialData,
  });

  // Seed the balance field when the wallet record loads
  React.useEffect(() => {
    if (wallet) {
      setInitialData((prev) => ({ ...prev, balance: wallet.vl_balance }));
    }
  }, [wallet]);

  React.useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  // Sincroniza a soma total dos recebíveis com o campo do formulário
  React.useEffect(() => {
    form.setValue("receivables", totalSum);
  }, [totalSum, form]);

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
    balance: labels?.balance ?? "Saldo",
    receivables: labels?.receivables ?? "Recebíveis",
    invoice: labels?.invoice ?? "Fatura",
    accounts: labels?.accounts ?? "Contas",
  };

  const { isSubmitting, dirtyFields } = form.formState;

  return (
    <div className={className}>
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
            name="accounts"
            label={fieldLabels.accounts}
            type="currency"
            actionInput
            readOnlyInput
            onAction={() =>
              openDialog({
                title: `Categorizar: ${fieldLabels.accounts}`,
                content: (
                  <Accounts
                    targetLabel={fieldLabels.accounts}
                    onSubmit={(data) => {
                      console.log("Contas categorizadas:", data);
                      closeDialog();
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
                      // Receivables component now handles its own creation/refresh.
                      // We can add logic here if the parent needs to sync something else.
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