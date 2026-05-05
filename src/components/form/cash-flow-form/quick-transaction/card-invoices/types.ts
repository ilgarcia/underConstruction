import { ReactNode } from "react";

export interface CategoryFormProps {
  /**
   * The current label or entity being categorized (e.g., "Fatura", "Contas").
   */
  targetLabel: string;
  
  /**
   * Optional callback when the form is submitted.
   */
  onSubmit?: (data: any) => void;
  
  /**
   * Optional initial category value.
   */
  initialValue?: string;

  /**
   * Optional id for user wallet.
   */
  idUserWallet?: string;
}
