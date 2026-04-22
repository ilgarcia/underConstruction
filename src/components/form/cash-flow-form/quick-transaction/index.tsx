"use client";
import * as React from "react";
import {
  FormActionInput as Input,
  BaseDialog,
  DialogConfig,
} from "@/components/custom";
import { Category } from "./card-invoices";
import { Expenses } from "./expenses";
import { Receivables } from "./receivables";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  quickTransactionSchema,
  QuickTransactionData,
  QuickTransactionInput,
} from "./schema";
import {
  useWalletInit,
  useWalletUpdate,
  useReceivableList,
  useExpensesList,
} from "@/hooks";

export function QuickTransaction() {
  const { wallet } = useWalletInit();
  const { updateBalance } = useWalletUpdate();
  const { totalSum: totalReceivables } = useReceivableList(wallet?.id_user_wallet);
  const { totalSum: totalExpenses } = useExpensesList(wallet?.id_user_wallet);
  const [dialogConfig, setDialogConfig] = React.useState<DialogConfig | null>(null);

  const form = useForm<
    QuickTransactionInput,
    undefined,
    QuickTransactionData
  >({
    resolver: zodResolver(quickTransactionSchema),
    defaultValues: { balance: 0, invoice: 0, expenses: 0, receivables: 0 },
  });

  React.useEffect(() => {
    if (wallet?.vl_balance !== undefined) form.setValue("balance", wallet.vl_balance);
    form.setValue("receivables", totalReceivables);
    form.setValue("expenses", totalExpenses);
  }, [wallet?.vl_balance, totalReceivables, totalExpenses, form]);

  const onSubmit = async (data: QuickTransactionData) => {
    if (!wallet?.id_user_wallet) return;
    await updateBalance(wallet.id_user_wallet, data.balance);
  };

  const closeDialog = () => setDialogConfig(null);

  const handleOpenInvoices = () => {
    setDialogConfig({
      title: "Categorizar: Fatura",
      content: (
        <Category
          targetLabel="Fatura"
          onSubmit={(data) => {
            console.log("Fatura categorizada:", data);
            closeDialog();
          }}
        />
      ),
    });
  };

  const handleOpenExpenses = () => {
    setDialogConfig({
      title: "Categorizar: Contas",
      description: <>Gerenciar <strong>Contas</strong>.</>,
      content: (
        <Expenses
          targetLabel="Contas"
          idUserWallet={wallet?.id_user_wallet}
          onEditChange={(isEditing, item, onCancel) => {
            setDialogConfig((prev) => prev ? { 
              ...prev, 
              editMode: { isEditing, itemName: item?.ds_description, onCancel } 
            } : null);
          }}
        />
      ),
    });
  };

  const handleOpenReceivables = () => {
    setDialogConfig({
      title: "Categorizar: Recebíveis",
      description: <>Gerenciar <strong>Recebíveis</strong>.</>,
      content: (
        <Receivables
          targetLabel="Recebíveis"
          idUserWallet={wallet?.id_user_wallet}
          onClose={closeDialog}
          onEditChange={(isEditing, item, onCancel) => {
            setDialogConfig((prev) => prev ? { 
              ...prev, 
              editMode: { isEditing, itemName: item?.ds_description, onCancel } 
            } : null);
          }}
        />
      ),
    });
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
          <Input
            control={form.control}
            name="balance"
            label="Saldo"
            type="currency"
            submitProps={{
              loading: isSubmitting,
              disabled: !dirtyFields.balance || isSubmitting,
            }}
          />
          <Input
            control={form.control}
            name="invoice"
            label="Fatura"
            type="currency"
            actionInput
            readOnlyInput
            onAction={handleOpenInvoices}
          />
          <Input
            control={form.control}
            name="expenses"
            label="Contas"
            type="currency"
            actionInput
            readOnlyInput
            onAction={handleOpenExpenses}
          />
          <Input
            control={form.control}
            name="receivables"
            label="Recebíveis"
            type="currency"
            actionInput
            readOnlyInput
            onAction={handleOpenReceivables}
          />
        </form>
      </Form>
      <BaseDialog
        config={dialogConfig}
        onClose={closeDialog}
      />
    </div>
  );
}