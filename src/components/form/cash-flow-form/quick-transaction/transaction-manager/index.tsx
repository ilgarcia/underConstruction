import { useState, useEffect, useCallback } from "react";
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
import { describeFrequency, toMonthKey } from "@/helpers/month";
import { FrequencyFields } from "./frequency-fields";
import { TransactionItem, TransactionManagerProps, TransactionPayload } from "./types";

const baseColumns: ListColumn<TransactionItem>[] = [
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

const frequencyColumn: ListColumn<TransactionItem> = {
  header: "Frequência",
  render: ({ dt_start_month, nr_months }) =>
    dt_start_month && describeFrequency({ dt_start_month, nr_months: nr_months ?? null }),
  className: "text-xs text-muted-foreground whitespace-nowrap",
};

// Frequency goes between the description and the amount
const frequencyColumns = [...baseColumns.slice(0, 2), frequencyColumn, baseColumns[2]];

const getDefaultValues = (): TransactionInput => ({
  day_picker: new Date().getDate(),
  description: "",
  value: 0,
  frequency: "always",
  nr_months: 1,
  dt_start_month: toMonthKey(new Date()),
});

const errorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

export function TransactionManager<
  T extends TransactionItem & Record<K, string>,
  K extends string,
>({
  targetLabel,
  listTitle,
  idKey,
  manager,
  withFrequency = false,
  onSubmit,
  onEditChange
}: TransactionManagerProps<T, K>) {
  const {
    items,
    isLoading,
    idUserWallet,
    onCreate,
    onUpdate,
    onDelete
  } = manager;

  const [editItem, setEditItem] = useState<T | null>(null);
  const isEditing = !!editItem;

  type TransactionFields = Omit<TransactionPayload, "id_user_wallet">;

  const mapToTransaction = (data: TransactionData): TransactionFields => ({
    ds_description: data.description,
    vl_amount: data.value,
    vl_day: data.day_picker,
    ...(withFrequency && {
      dt_start_month: data.dt_start_month,
      nr_months: data.frequency === "months" ? data.nr_months : null,
    }),
  });

  const form = useForm<TransactionInput, undefined, TransactionData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaultValues(),
  });

  const handleCancelEdit = useCallback(() => {
    setEditItem(null);
    form.reset(getDefaultValues());
  }, [form]);

  useEffect(() => {
    if (onEditChange) {
      onEditChange(isEditing, editItem, handleCancelEdit);
    }
  }, [isEditing, editItem, onEditChange, handleCancelEdit]);

  const handleSubmit = async (data: TransactionData) => {
    try {
      const transactionData = mapToTransaction(data);

      if (isEditing && editItem) {
        // A computed key widens to `string`, so restore the id's key type
        const id = { [idKey]: editItem[idKey] } as Record<K, T[K]>;
        await onUpdate({ ...id, ...transactionData });
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

      form.reset(getDefaultValues());
    } catch (err) {
      toast.error(errorMessage(err, `Erro ao salvar ${targetLabel.toLowerCase()}.`));
    }
  };

  const handleRowClick = (item: T) => {
    setEditItem(item);
    form.reset({
      ...getDefaultValues(),
      day_picker: item.vl_day,
      description: item.ds_description,
      value: item.vl_amount,
      ...(withFrequency && {
        frequency: item.nr_months ? "months" : "always",
        nr_months: item.nr_months ?? 1,
        dt_start_month: item.dt_start_month,
      }),
    });
  };

  const isSubmitting = form.formState.isSubmitting;

  const handleDelete = async (ids: string[]) => {
    try {
      await onDelete(ids);
      if (editItem && ids.includes(editItem[idKey])) {
        handleCancelEdit();
      }
    } catch (err) {
      toast.error(errorMessage(err, "Erro ao excluir itens."));
    }
  };

  const handleUndo = async (deletedItems: T[]) => {
    try {
      await onCreate(
        deletedItems.map((item) => ({
          // Card charges have no wallet: the manager's id (the card) owns them
          id_user_wallet: item.id_user_wallet ?? idUserWallet ?? "",
          ds_description: item.ds_description,
          vl_amount: item.vl_amount,
          vl_day: item.vl_day,
          ...(withFrequency && {
            dt_start_month: item.dt_start_month,
            nr_months: item.nr_months,
          }),
        })),
      );
    } catch (err) {
      toast.error(errorMessage(err, "Erro ao desfazer exclusão."));
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
          {withFrequency && (
            <FrequencyFields
              control={form.control}
              editingStartMonth={editItem?.dt_start_month}
            />
          )}
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

      <CustomList<T>
        title={listTitle ?? `${targetLabel} Cadastrados`}
        items={items}
        idKey={idKey}
        columns={withFrequency ? frequencyColumns : baseColumns}
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
