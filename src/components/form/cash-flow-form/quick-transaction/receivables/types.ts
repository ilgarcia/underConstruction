import type { ReceivableRecord } from "@/hooks";
import type { TransactionData } from "../transaction-manager/schema";
import type { EditChangeHandler } from "../transaction-manager/types";

export interface ReceivablesFormProps {
  targetLabel: string;
  listTitle?: string;
  idUserWallet?: string;
  onSubmit?: (data: TransactionData) => void;
  onClose?: () => void;
  onEditChange?: EditChangeHandler<ReceivableRecord>;
}
