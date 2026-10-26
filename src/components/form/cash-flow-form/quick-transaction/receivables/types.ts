export interface ReceivablesFormProps {
  targetLabel: string;
  listTitle?: string;
  idUserWallet?: string;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
  onEditChange?: (isEditing: boolean, editItem: any, handleCancel: () => void) => void;
}
