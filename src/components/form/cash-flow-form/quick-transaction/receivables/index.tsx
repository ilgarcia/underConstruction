"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceivablesFormProps } from "./types";
import {
  Form,
} from "@/components/ui/form";
import { FormActionInput as Input } from "@/components/custom/input";
import { ActionButton } from "@/components/custom/buttons/action-button";
import { receivablesSchema, ReceivablesData, ReceivablesInput } from "./schema";
import { useReceivableList } from "@/hooks/use-receivable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export function Receivables({ targetLabel, idUserWallet, onSubmit }: ReceivablesFormProps) {
  const { receivables, isLoading, refresh } = useReceivableList(idUserWallet);

  const form = useForm<ReceivablesInput, undefined, ReceivablesData>({
    resolver: zodResolver(receivablesSchema),
    defaultValues: {
      day_picker: new Date().getDate(),
      description: "",
      value: 0,
    },
  });

  const handleSubmit = async (data: ReceivablesData) => {
    await onSubmit?.(data);
    await refresh(); // Reload data after submission
    form.reset(); // clear the form to add new ones more easily
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Gerenciar recebíveis para <strong>{targetLabel}</strong>.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-12 gap-3 items-start">
          <div className="col-span-2">
            <Input
              control={form.control}
              name="day_picker"
              label="Data"
              type="day_picker"
            />
          </div>

          <div className="col-span-5">
            <Input
              control={form.control}
              name="description"
              label="Descrição"
              type="text"
              placeholder="Ex: Recebimento de Vendas"
            />
          </div>

          <div className="col-span-3">
            <Input
              control={form.control}
              name="value"
              label="Valor"
              type="currency"
            />
          </div>

          <div className="col-span-2 pt-[22px]">
            <ActionButton
              type="submit"
              label="Confirmar"
              loading={isSubmitting}
              className="w-full rounded-none h-9"
            />
          </div>
        </form>
      </Form>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Recebíveis Cadastrados
        </h3>

        <div className="border border-zinc-200 dark:border-zinc-800 h-[200px] overflow-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50 sticky top-0">
              <TableRow>
                <TableHead className="w-[40px] px-4">
                  <Checkbox className="border-zinc-300 pointer-events-none" />
                </TableHead>
                <TableHead className="w-[60px]">Dia</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right pr-4">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-zinc-500">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : receivables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-zinc-500">
                    Nenhum recebível cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                receivables.map((item) => (
                  <TableRow key={item.id_receivable}>
                    <TableCell className="px-4">
                      <Checkbox className="border-zinc-300" />
                    </TableCell>
                    <TableCell className="font-medium text-xs">{item.vl_day_receivable}</TableCell>
                    <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[150px]">
                      {item.ds_receivable}
                    </TableCell>
                    <TableCell className="text-right text-xs pr-4">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.vl_receivable)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
