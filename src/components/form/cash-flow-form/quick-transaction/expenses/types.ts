export interface ExpensesFormProps {
  targetLabel: string;
  idUserWallet?: string;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
  onEditChange?: (isEditing: boolean, editItem: any, handleCancel: () => void) => void;
}
