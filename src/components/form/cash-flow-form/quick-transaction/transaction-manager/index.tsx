import { useState, useEffect } from "react";
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
import { formatCurrency } from "@/helpers/currency";

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
    render: (item) => formatCurrency(item.vl_amount),
    className: "text-right text-xs pr-4",
  },
];

import { TransactionManagerProps } from "./types";

export function TransactionManager({
  targetLabel,
  listTitle,
  idKey,
  manager,
  onSubmit,
  onEditChange
}: TransactionManagerProps) {
  const {
    items,
    isLoading,
    idUserWallet,
    refresh,
    onCreate,
    onUpdate,
    onDelete
  } = manager;

  const [editItem, setEditItem] = useState<any | null>(null);
  const isEditing = !!editItem;

  const mapToTransaction = (data: TransactionData) => ({
    ds_description: data.description,
    vl_amount: data.value,
    vl_day: data.day_picker,
  });

  const getDefaultValues = () => ({
    day_picker: new Date().getDate(),
    description: "",
    value: 0,
  });

  const handleCancelEdit = () => {
    setEditItem(null);
    form.reset(getDefaultValues());
  };

  useEffect(() => {
    if (onEditChange) {
      onEditChange(isEditing, editItem, handleCancelEdit);
    }
  }, [isEditing, editItem, onEditChange]);

  const form = useForm<TransactionInput, undefined, TransactionData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaultValues(),
  });

  const handleSubmit = async (data: TransactionData) => {
    try {
      const transactionData = mapToTransaction(data);

      if (isEditing && editItem) {
        await onUpdate({
          [idKey]: editItem[idKey],
          ...transactionData,
        });
        toast.success(`${targetLabel} atualizado com sucesso!`);
        setEditItem(null);
      } else {
        await onCreate({
          id_user_wallet: idUserWallet || "",
          ...transactionData,
        });
        await onSubmit?.(data);
        toast.success(`${targetLabel} adicionado com sucesso!`);
      }

      await refresh();
      form.reset(getDefaultValues());
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
    try {
      await onDelete(ids);
      if (editItem && ids.includes(editItem[idKey])) {
        handleCancelEdit();
      }
      await refresh();
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir itens.");
    }
  };

  const handleUndo = async (deletedItems: any[]) => {
    try {
      await onCreate(
        deletedItems.map(({ id_user_wallet, ds_description, vl_amount, vl_day }) => ({
          id_user_wallet,
          ds_description,
          vl_amount,
          vl_day,
        })),
      );
      await refresh();
    } catch (err: any) {
      toast.error(err.message || "Erro ao desfazer exclusão.");
    }
  };


  return (
    <div className="space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <Input
              control={form.control}
              name="day_picker"
              label="Dia"
              type="day_picker"
              containerClassName="flex-[0_1_120px]"
            />
            <Input
              control={form.control}
              name="description"
              label="Descrição"
              type="text"
              placeholder="Ex: Recebimento ou Gasto"
              containerClassName="flex-[3_1_220px] min-w-0"
            />
            <Input
              control={form.control}
              name="value"
              label="Valor"
              type="currency"
              containerClassName="flex-[1_1_160px] min-w-0"
            />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {isEditing && (
              <ActionButton
                type="button"
                variant="outline"
                label="Cancelar"
                onClick={handleCancelEdit}
                className="w-auto px-4 bg-transparent border border-input"
              />
            )}
            <ActionButton
              type="submit"
              label={isEditing ? "Salvar" : "Confirmar"}
              loading={isSubmitting}
              className="w-auto px-6 bg-primary text-primary-foreground font-bold"
            />
          </div>
        </form>
      </Form>

      <hr className="border-border" />

      <CustomList<any>
        title={listTitle ?? `${targetLabel} Cadastrados`}
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
  );
}
