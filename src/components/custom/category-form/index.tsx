"use client";

import * as React from "react";
import { CategoryFormProps } from "./types";
import { Button } from "@/components/ui/button";

/**
 * CategoryForm - A dedicated form component for categorizing transactions.
 * This can be expanded with real select fields, tag pickers, etc.
 */
export function CategoryForm({ targetLabel, onSubmit }: CategoryFormProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Escolha uma categoria para o lançamento de <strong>{targetLabel}</strong>.
        </p>
      </div>

      {/* Mock Category Selection */}
      <div className="grid grid-cols-2 gap-2">
        {["Alimentação", "Transporte", "Lazer", "Contas Fixas", "Saúde", "Outros"].map((cat) => (
          <Button
            key={cat}
            variant="outline"
            className="rounded-none justify-start h-10 text-xs font-semibold uppercase tracking-wider"
            onClick={() => onSubmit?.(cat)}
          >
            {cat}
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
