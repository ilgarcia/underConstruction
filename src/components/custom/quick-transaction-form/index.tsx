"use client";

import * as React from "react";
import { 
  ActionInput, 
  BaseDialog, 
  CategoryForm 
} from "@/components/custom";
import { QuickTransactionFormProps } from "./types";

/**
 * QuickTransactionForm - A client component that manages four financial inputs.
 * Recebíveis is read-only, while others are editable.
 */
export function QuickTransactionForm({ className, labels }: QuickTransactionFormProps) {
  const [dialogConfig, setDialogConfig] = React.useState<{
    title: string;
    description?: React.ReactNode;
    content: React.ReactNode;
  } | null>(null);

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
      
      <div className="space-y-6">
        {/* 1. Saldo (No button) */}
        <ActionInput
          label={fieldLabels.balance}
          isFinancial
          placeholder="0,00"
          showButton={false}
        />

        {/* 2. Fatura (With button) */}
        <ActionInput
          label={fieldLabels.invoice}
          isFinancial
          placeholder="0,00"
          actionLabel="Categorizar"
          onAction={() => openDialog({
            title: `Categorizar: ${fieldLabels.invoice}`,
            content: (
              <CategoryForm 
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
        <ActionInput
          label={fieldLabels.accounts}
          isFinancial
          placeholder="0,00"
          actionLabel="Categorizar"
          readOnlyInput
          onAction={() => openDialog({
            title: `Categorizar: ${fieldLabels.accounts}`,
            content: (
              <CategoryForm 
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
        <ActionInput
          label={fieldLabels.receivables}
          isFinancial
          placeholder="0,00"
          actionLabel="Categorizar"
          readOnlyInput
          onAction={() => openDialog({
            title: `Categorizar: ${fieldLabels.receivables}`,
            content: (
              <CategoryForm 
                targetLabel={fieldLabels.receivables} 
                onSubmit={(data) => {
                  console.log("Recebível categorizado:", data);
                  closeDialog();
                }} 
              />
            )
          })}
        />
      </div>

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
