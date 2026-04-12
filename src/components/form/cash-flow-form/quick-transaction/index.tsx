"use client";

import * as React from "react";
import {
  ActionInput,
  BaseDialog
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Category } from "../category";
import { QuickTransactionFormProps } from "./types";

/**
 * QuickTransaction - A scoped component for the Cash Flow functional area.
 * Manages four financial inputs with categorization support.
 */
export function QuickTransaction({ className, labels }: QuickTransactionFormProps) {
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
        <ActionInput
          label={fieldLabels.accounts}
          isFinancial
          placeholder="0,00"
          actionLabel="Categorizar"
          readOnlyInput
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
        <ActionInput
          label={fieldLabels.receivables}
          isFinancial
          placeholder="0,00"
          actionLabel="Categorizar"
          readOnlyInput
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
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <Button
          className="w-full h-11 text-xs font-bold uppercase tracking-[0.2em] bg-secondary text-secondary-foreground hover:opacity-90 transition-all duration-300 rounded-none shadow-sm"
          onClick={() => console.log("Saving transaction data...")}
        >
          <Save className="w-3.5 h-3.5 mr-2" />
          Salvar Dados
        </Button>
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
