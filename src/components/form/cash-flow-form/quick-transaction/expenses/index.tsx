import { ExpensesFormProps } from "./types";
import {
  useExpensesList,
  useExpensesDelete,
  useExpensesCreate,
  useExpensesUpdate,
} from "@/hooks/use-expenses";
import { TransactionManager } from "@/components/custom/transaction-manager";

export function Expenses({ targetLabel, idUserWallet, onSubmit, onClose }: ExpensesFormProps) {
  const { expenses, isLoading, refresh } = useExpensesList(idUserWallet);
  const { deleteExpenses } = useExpensesDelete();
  const { createExpenses } = useExpensesCreate();
  const { updateExpenses } = useExpensesUpdate();

  return (
    <TransactionManager
      targetLabel={targetLabel || "Despesas"}
      idUserWallet={idUserWallet}
      idKey="id_expense"
      items={expenses}
      isLoading={isLoading}
      refresh={refresh}
      onCreate={createExpenses}
      onUpdate={updateExpenses}
      onDelete={deleteExpenses}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}
