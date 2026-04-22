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
  idKey: string;
  manager: TransactionManagerStore;
  onSubmit?: (data: any) => void;
  onEditChange?: (isEditing: boolean, editItem: any, handleCancel: () => void) => void;
}
