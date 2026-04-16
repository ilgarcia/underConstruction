"use client";

import * as React from "react";
import { ReceivablesFormProps } from "./types";
import { Button } from "@/components/ui/button";

export function Receivables({ targetLabel, onSubmit }: ReceivablesFormProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Gerenciar recebíveis para <strong>{targetLabel}</strong>.
        </p>
      </div>

      {/* Mock Receivables Selection */}
      <div className="grid grid-cols-2 gap-2">
        {["Clientes", "Cartão de Crédito", "Boletos", "Pix", "Transferências", "Rendimentos"].map((rec) => (
          <Button
            key={rec}
            variant="outline"
            className="rounded-none justify-start h-10 text-xs font-semibold uppercase tracking-wider"
            onClick={() => onSubmit?.(rec)}
          >
            {rec}
          </Button>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="ghost" className="rounded-none">Cancelar</Button>
        <Button className="rounded-none px-8">Confirmar</Button>
      </div>
    </div>
  );
}
