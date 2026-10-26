import { ExpensesFormProps } from "./types";
import { useExpensesManager } from "@/hooks";
import { TransactionManager } from "@/components/form/cash-flow-form/quick-transaction/transaction-manager";

export function Expenses({ targetLabel, listTitle, idUserWallet, onSubmit, onEditChange }: ExpensesFormProps) {
  const manager = useExpensesManager(idUserWallet);

  return (
    <TransactionManager
      targetLabel={targetLabel || "Despesas"}
      listTitle={listTitle}
      idKey="id_expense"
      manager={manager}
      onSubmit={onSubmit}
      onEditChange={onEditChange}
    />
  );
}
