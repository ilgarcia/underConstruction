import { ExtraExpensesFormProps } from "./types";
import { useExtraExpensesManager } from "@/hooks";
import { TransactionManager } from "../transaction-manager";

/** Extra expenses: every month or for a number of months (cat food, a one-off transfer). */
export function ExtraExpenses({ targetLabel, listTitle, idUserWallet }: ExtraExpensesFormProps) {
  const manager = useExtraExpensesManager(idUserWallet);

  return (
    <TransactionManager
      targetLabel={targetLabel || "Gasto extra"}
      listTitle={listTitle}
      idKey="id_extra_expense"
      withFrequency
      manager={manager}
    />
  );
}
