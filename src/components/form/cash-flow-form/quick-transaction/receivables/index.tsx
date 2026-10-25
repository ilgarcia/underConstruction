import { ReceivablesFormProps } from "./types";
import { useReceivablesManager } from "@/hooks";
import { TransactionManager } from "@/components/form/cash-flow-form/quick-transaction/transaction-manager";

export function Receivables({ targetLabel, listTitle, idUserWallet, onSubmit, onEditChange }: ReceivablesFormProps) {
  const manager = useReceivablesManager(idUserWallet);

  return (
    <TransactionManager
      targetLabel={targetLabel || "Recebíveis"}
      listTitle={listTitle}
      idKey="id_receivable"
      manager={manager}
      onSubmit={onSubmit}
      onEditChange={onEditChange}
    />
  );
}
