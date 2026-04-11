"use client";

import * as React from "react";
import { ActionInput } from "@/components/custom/action-input/action-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuickTransactionFormProps } from "./types";

/**
 * QuickTransactionForm - A client component that manages four financial inputs.
 * Recebíveis is read-only, while others are editable.
 */
export function QuickTransactionForm({ className, labels }: QuickTransactionFormProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [activeDialogLabel, setActiveDialogLabel] = React.useState("");

  const handleAction = (label: string) => {
    setActiveDialogLabel(label);
    setIsDialogOpen(true);
  };

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
          onAction={() => handleAction(fieldLabels.invoice)}
        />

        {/* 3. Contas (With button) */}
        <ActionInput
          label={fieldLabels.accounts}
          isFinancial
          placeholder="0,00"
          actionLabel="Categorizar"
          readOnlyInput
          onAction={() => handleAction(fieldLabels.accounts)}
        />

        {/* 4. Recebíveis (With button, readOnly input) */}
        <ActionInput
          label={fieldLabels.receivables}
          isFinancial
          placeholder="0,00"
          actionLabel="Categorizar"
          readOnlyInput
          onAction={() => handleAction(fieldLabels.receivables)}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Categorizar: {activeDialogLabel}</DialogTitle>
            <DialogDescription>
              Escolha uma categoria para o lançamento de <strong>{activeDialogLabel}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 hidden">
            {/* Visual content is now inside DialogDescription for accessibility */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
