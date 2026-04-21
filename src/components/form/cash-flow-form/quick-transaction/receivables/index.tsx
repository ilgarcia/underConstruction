import { ReceivablesFormProps } from "./types";
import {
  useReceivableList,
  useReceivableDelete,
  useReceivableCreate,
  useReceivableUpdate,
} from "@/hooks/use-receivable";
import { TransactionManager } from "@/components/custom/transaction-manager";

export function Receivables({ targetLabel, idUserWallet, onSubmit, onClose }: ReceivablesFormProps) {
  const { receivables, isLoading, refresh } = useReceivableList(idUserWallet);
  const { deleteReceivables } = useReceivableDelete();
  const { createReceivable } = useReceivableCreate();
  const { updateReceivable } = useReceivableUpdate();

  return (
    <TransactionManager
      targetLabel={targetLabel || "Recebíveis"}
      idUserWallet={idUserWallet}
      idKey="id_receivable"
      items={receivables}
      isLoading={isLoading}
      refresh={refresh}
      onCreate={createReceivable}
      onUpdate={updateReceivable}
      onDelete={deleteReceivables}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}
