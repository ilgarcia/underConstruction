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
import {
  Form,
} from "@/components/ui/form";
import { quickTransactionSchema, QuickTransactionData, QuickTransactionInput } from "./schema";
import { useQuickTransactionStore } from "@/store/quick-transaction-store";

/**
 * QuickTransaction - A scoped component for the Cash Flow functional area.
 * Manages four financial inputs with categorization support, using react-hook-form.
 */
export function QuickTransaction({ className, labels }: QuickTransactionFormProps) {
  const [dialogConfig, setDialogConfig] = React.useState<{
    title: string;
    description?: React.ReactNode;
    content: React.ReactNode;
  } | null>(null);

  const { initialData, setInitialData, syncExternalData } = useQuickTransactionStore();

  const form = useForm<QuickTransactionInput, any, QuickTransactionData>({
    resolver: zodResolver(quickTransactionSchema),
    defaultValues: initialData,
  });

  // Watch for external data changes to react (if not dirty)
  React.useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (data: QuickTransactionData) => {
    // Mock delay to simulate async save — remove when wiring real API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Saving transaction data...", data);
    setInitialData(data);
    form.reset(data);

    // Simulate updating external data
    const backendData = { balance: data.balance + 10, invoice: data.invoice };
    syncExternalData(backendData, form.formState.isDirty);
  };

  const openDialog = (config: {
    title: string;
    description?: React.ReactNode;
    content: React.ReactNode
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

  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-6 text-foreground uppercase tracking-tight">
        Lançamentos Rápidos
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                loading={form.formState.isSubmitting}
                disabled={!form.formState.dirtyFields.balance || form.formState.isSubmitting}
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
            onAction={() => openDialog({
              title: `Categorizar: ${fieldLabels.invoice}`,
              content: (
                <Category
                  targetLabel={fieldLabels.invoice}
                  onSubmit={(data) => {
                    console.log("Fatura categorizada:", data);
                    closeDialog();
                  }}
                />
              )
            })}
          />

          {/* 3. Contas (With button) */}
          <Input
            control={form.control}
            name="accounts"
            label={fieldLabels.accounts}
            type="currency"
            actionInput
            readOnlyInput
            onAction={() => openDialog({
              title: `Categorizar: ${fieldLabels.accounts}`,
              content: (
                <Accounts
                  targetLabel={fieldLabels.accounts}
                  onSubmit={(data) => {
                    console.log("Contas categorizadas:", data);
                    closeDialog();
                  }}
                />
              )
            })}
          />

          {/* 4. Recebíveis (With button, readOnly input) */}
          <Input
            control={form.control}
            name="receivables"
            label={fieldLabels.receivables}
            type="currency"
            actionInput
            readOnlyInput
            onAction={() => openDialog({
              title: `Categorizar: ${fieldLabels.receivables}`,
              content: (
                <Receivables
                  targetLabel={fieldLabels.receivables}
                  onSubmit={(data) => {
                    console.log("Recebível categorizado:", data);
                    closeDialog();
                  }}
                />
              )
            })}
          />


        </form>
      </Form>

      {/* Modular Base Dialog */}
      <BaseDialog
        isOpen={!!dialogConfig}
        onOpenChange={(open) => !open && closeDialog()}
        title={dialogConfig?.title || ""}
        description={dialogConfig?.description}
      >
        {dialogConfig?.content}
      </BaseDialog>
    </div>
  );
}
