export interface ExpensesFormProps {
  targetLabel: string;
  idUserWallet?: string;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}
