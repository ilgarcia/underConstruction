"use client";

import * as React from "react";
import { AccountsFormProps } from "./types";
import { Button } from "@/components/ui/button";

export function Accounts({ targetLabel, onSubmit }: AccountsFormProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Gerenciar contas para <strong>{targetLabel}</strong>.
        </p>
      </div>

      {/* Mock Accounts Selection */}
      <div className="grid grid-cols-2 gap-2">
        {["Luz", "Água", "Internet", "Aluguel", "Fornecedores", "Impostos"].map((acc) => (
          <Button
            key={acc}
            variant="outline"
            className="rounded-none justify-start h-10 text-xs font-semibold uppercase tracking-wider"
            onClick={() => onSubmit?.(acc)}
          >
            {acc}
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
