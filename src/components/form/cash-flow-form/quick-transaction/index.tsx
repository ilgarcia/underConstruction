"use client";

import * as React from "react";
import {
  FormActionInput as Input,
  BaseDialog
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Category } from "../category";
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

  const onSubmit = (data: QuickTransactionData) => {
    console.log("Saving transaction data...", data);
    setInitialData(data);
    form.reset(data);

    // Simulate updating external data
    const backendData = { balance: data.balance + 10, invoice: data.invoice };
    // This allows testing the external data sync
    setTimeout(() => {
      syncExternalData(backendData, form.formState.isDirty);
    }, 2000);
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
          {/* 1. Saldo (No button) */}
          <Input
            control={form.control}
            name="balance"
            label={fieldLabels.balance}
            type="currency"
            maxDigits={10}
          />

          {/* 2. Fatura (With button) */}
          <Input
            control={form.control}
            name="invoice"
            label={fieldLabels.invoice}
            type="currency"
            maxDigits={10}
            actionLabel="Categorizar"
            showButton={true}
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
            maxDigits={10}
            actionLabel="Categorizar"
            readOnlyInput
            showButton={true}
            onAction={() => openDialog({
              title: `Categorizar: ${fieldLabels.accounts}`,
              content: (
                <Category
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
            maxDigits={10}
            actionLabel="Categorizar"
            readOnlyInput
            showButton={true}
            onAction={() => openDialog({
              title: `Categorizar: ${fieldLabels.receivables}`,
              content: (
                <Category
                  targetLabel={fieldLabels.receivables}
                  onSubmit={(data) => {
                    console.log("Recebível categorizado:", data);
                    closeDialog();
                  }}
                />
              )
            })}
          />

          <div className="mt-8 pt-6 border-t border-border">
            <Button
              type="submit"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              className="w-full h-11 text-xs font-bold uppercase tracking-[0.2em] bg-secondary text-secondary-foreground hover:opacity-90 transition-all duration-300 rounded-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-3.5 h-3.5 mr-2" />
              Salvar Dados
            </Button>
          </div>
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
