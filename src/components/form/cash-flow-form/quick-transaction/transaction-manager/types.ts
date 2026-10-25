export interface TransactionManagerStore {
  items: any[];
  isLoading: boolean;
  idUserWallet?: string;
  refresh: () => Promise<void>;
  onCreate: (data: any) => Promise<any>;
  onUpdate: (data: any) => Promise<any>;
  onDelete: (ids: string[]) => Promise<any>;
}

export interface TransactionManagerProps {
  targetLabel: string;
  /** Title above the list. Defaults to "<targetLabel> Cadastrados". */
  listTitle?: string;
  idKey: string;
  manager: TransactionManagerStore;
  /** Adds "Frequência / Quantidade de meses / A partir de" (receivables, extra expenses). */
  withFrequency?: boolean;
  onSubmit?: (data: any) => void;
  onEditChange?: (isEditing: boolean, editItem: any, handleCancel: () => void) => void;
}
