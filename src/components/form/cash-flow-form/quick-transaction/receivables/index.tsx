import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceivablesFormProps } from "./types";
import {
  Form,
} from "@/components/ui/form";
import { FormActionInput as Input } from "@/components/custom/input";
import { ActionButton } from "@/components/custom/buttons/action-button";
import { receivablesSchema, ReceivablesData, ReceivablesInput } from "./schema";
import { 
  useReceivableList, 
  ReceivableRecord, 
  useReceivableDelete, 
  useReceivableCreate,
  useReceivableUpdate
} from "@/hooks/use-receivable";
import { CustomList, ListColumn } from "@/components/custom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Receivables({ targetLabel, idUserWallet, onSubmit, onClose }: ReceivablesFormProps) {
  const { receivables, isLoading, refresh } = useReceivableList(idUserWallet);
  const { deleteReceivables } = useReceivableDelete();
  const { createReceivable } = useReceivableCreate();
  const { updateReceivable } = useReceivableUpdate();

  const [editItem, setEditItem] = useState<ReceivableRecord | null>(null);
  const isEditing = !!editItem;

  const form = useForm<ReceivablesInput, undefined, ReceivablesData>({
    resolver: zodResolver(receivablesSchema),
    defaultValues: {
      day_picker: new Date().getDate(),
      description: "",
      value: 0,
    },
  });

  const handleCancelEdit = () => {
    setEditItem(null);
    form.reset({
      day_picker: new Date().getDate(),
      description: "",
      value: 0,
    });
  };

  const handleSubmit = async (data: ReceivablesData) => {
    try {
      if (isEditing && editItem) {
        await updateReceivable({
          id_receivable: editItem.id_receivable,
          ds_receivable: data.description,
          vl_receivable: data.value,
          vl_day_receivable: data.day_picker,
        });
        toast.success("Recebível atualizado com sucesso!");
        setEditItem(null);
      } else {
        await createReceivable({
          id_user_wallet: idUserWallet || "",
          ds_receivable: data.description,
          vl_receivable: data.value,
          vl_day_receivable: data.day_picker,
        });
        await onSubmit?.(data);
        toast.success("Recebível adicionado com sucesso!");
      }
      
      await refresh();
      form.reset({
        day_picker: new Date().getDate(),
        description: "",
        value: 0,
      });
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar recebível.");
    }
  };

  const handleRowClick = (item: ReceivableRecord) => {
    setEditItem(item);
    form.reset({
      day_picker: item.vl_day_receivable,
      description: item.ds_receivable,
      value: item.vl_receivable,
    });
  };

  const isSubmitting = form.formState.isSubmitting;

  const handleDelete = async (ids: string[]) => {
    await deleteReceivables(ids);
    if (editItem && ids.includes(editItem.id_receivable)) {
      handleCancelEdit();
    }
    await refresh();
  };

  const handleUndo = async (items: ReceivableRecord[]) => {
    await createReceivable(
      items.map((item) => ({
        id_user_wallet: item.id_user_wallet,
        ds_receivable: item.ds_receivable,
        vl_receivable: item.vl_receivable,
        vl_day_receivable: item.vl_day_receivable,
      })),
    );
    await refresh();
  };

  const columns: ListColumn<ReceivableRecord>[] = [
    {
      header: "Dia",
      render: (item) => item.vl_day_receivable,
      className: "w-[60px] font-medium text-xs text-center",
    },
    {
      header: "Descrição",
      render: (item) => item.ds_receivable,
      className: "text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[150px]",
    },
    {
      header: "Valor",
      render: (item) =>
        Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(item.vl_receivable),
      className: "text-right text-xs pr-4",
    },
  ];

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between min-h-[45px] transition-all duration-300">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Gerenciar recebíveis para <strong>{targetLabel}</strong>.
          </p>
          <p className={cn(
            "text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 transition-all duration-300",
            isEditing ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none h-0 sm:h-auto"
          )}>
             Editando: <span className="text-blue-600 dark:text-blue-400 font-bold">{editItem?.ds_receivable}</span>
          </p>
        </div>
        <div className={cn(
          "transition-all duration-300",
          isEditing ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}>
          <ActionButton
            label="Cancelar Edição"
            onClick={handleCancelEdit}
            className="text-xs w-fit"
            variant="outline"
          />
        </div>
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
              label={isEditing ? "Salvar alterações" : "Confirmar"}
              loading={isSubmitting}
              className="w-full rounded-none h-9"
            />
          </div>
        </form>
      </Form>

      <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
        <CustomList<ReceivableRecord>
          title="Recebíveis Cadastrados"
          items={receivables}
          idKey="id_receivable"
          columns={columns}
          isLoading={isLoading}
          onDeleteBatch={handleDelete}
          onUndo={handleUndo}
          onEdit={handleRowClick}
          highlightedId={editItem?.id_receivable}
          showConfirmation={false}
          enableUndo={true}
        />
      </div>
    </div>
  );
}
