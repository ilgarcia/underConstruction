import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
} from "@/components/ui/form";
import { FormActionInput as Input } from "@/components/custom/input";
import { ActionButton } from "@/components/custom/buttons/action-button";
import { transactionSchema, TransactionData, TransactionInput } from "./schema";
import { CustomList, ListColumn } from "@/components/custom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TransactionManagerProps {
  targetLabel: string;
  idUserWallet?: string;
  idKey: string;
  items: any[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  onCreate: (data: any) => Promise<any>;
  onUpdate: (data: any) => Promise<any>;
  onDelete: (ids: string[]) => Promise<any>;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}

export function TransactionManager({
  targetLabel,
  idUserWallet,
  idKey,
  items,
  isLoading,
  refresh,
  onCreate,
  onUpdate,
  onDelete,
  onSubmit,
  onClose
}: TransactionManagerProps) {
  const [editItem, setEditItem] = useState<any | null>(null);
  const isEditing = !!editItem;

  const form = useForm<TransactionInput, undefined, TransactionData>({
    resolver: zodResolver(transactionSchema),
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

  const handleSubmit = async (data: TransactionData) => {
    try {
      if (isEditing && editItem) {
        await onUpdate({
          [idKey]: editItem[idKey],
          ds_description: data.description,
          vl_amount: data.value,
          vl_day: data.day_picker,
        });
        toast.success(`${targetLabel} atualizado com sucesso!`);
        setEditItem(null);
      } else {
        await onCreate({
          id_user_wallet: idUserWallet || "",
          ds_description: data.description,
          vl_amount: data.value,
          vl_day: data.day_picker,
        });
        await onSubmit?.(data);
        toast.success(`${targetLabel} adicionado com sucesso!`);
      }

      await refresh();
      form.reset({
        day_picker: new Date().getDate(),
        description: "",
        value: 0,
      });
    } catch (err: any) {
      toast.error(err.message || `Erro ao salvar ${targetLabel.toLowerCase()}.`);
    }
  };

  const handleRowClick = (item: any) => {
    setEditItem(item);
    form.reset({
      day_picker: item.vl_day,
      description: item.ds_description,
      value: item.vl_amount,
    });
  };

  const isSubmitting = form.formState.isSubmitting;

  const handleDelete = async (ids: string[]) => {
    await onDelete(ids);
    if (editItem && ids.includes(editItem[idKey])) {
      handleCancelEdit();
    }
    await refresh();
  };

  const handleUndo = async (deletedItems: any[]) => {
    await onCreate(
      deletedItems.map((item) => ({
        id_user_wallet: item.id_user_wallet,
        ds_description: item.ds_description,
        vl_amount: item.vl_amount,
        vl_day: item.vl_day,
      })),
    );
    await refresh();
  };

  const columns: ListColumn<any>[] = [
    {
      header: "Dia",
      render: (item) => item.vl_day,
      className: "w-[60px] font-medium text-xs text-center",
    },
    {
      header: "Descrição",
      render: (item) => item.ds_description,
      className: "text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[150px]",
    },
    {
      header: "Valor",
      render: (item) =>
        Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(item.vl_amount),
      className: "text-right text-xs pr-4",
    },
  ];

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between min-h-[45px] transition-all duration-300">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Gerenciar <strong>{targetLabel}</strong>.
          </p>
          <p className={cn(
            "text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 transition-all duration-300",
            isEditing ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none h-0 sm:h-auto"
          )}>
            Editando: <span className="text-blue-600 dark:text-blue-400 font-bold">{editItem?.ds_description}</span>
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
              placeholder="Ex: Recebimento ou Gasto"
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
              label={isEditing ? "Salvar" : "Confirmar"}
              loading={isSubmitting}
              className="w-full rounded-none h-9"
            />
          </div>
        </form>
      </Form>

      <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
        <CustomList<any>
          title={`${targetLabel} Cadastrados`}
          items={items}
          idKey={idKey}
          columns={columns}
          isLoading={isLoading}
          onDeleteBatch={handleDelete}
          onUndo={handleUndo}
          onEdit={handleRowClick}
          highlightedId={editItem?.[idKey]}
          showConfirmation={false}
          enableUndo={true}
        />
      </div>
    </div>
  );
}
