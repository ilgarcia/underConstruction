import type { MonthlyFrequency } from "@/helpers/month";
import type { TransactionData } from "./schema";

/** Fields every item handled by TransactionManager has. */
export interface TransactionItem extends Partial<MonthlyFrequency> {
  /** Missing on card charges, whose owner is the card (see `idUserWallet`). */
  id_user_wallet?: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
}

/** Body sent to `onCreate`. Frequency fields only go out when the manager has a frequency. */
export interface TransactionPayload extends Partial<MonthlyFrequency> {
  id_user_wallet: string;
  ds_description: string;
  vl_amount: number;
  vl_day: number;
}

/** Body sent to `onUpdate`: the item's id under its own key plus the edited fields. */
export type TransactionUpdate<K extends string> = Omit<TransactionPayload, "id_user_wallet"> &
  Record<K, string>;

export interface TransactionManagerStore<
  T extends TransactionItem = TransactionItem,
  K extends string = string,
> {
  items: T[];
  isLoading: boolean;
  idUserWallet?: string;
  onCreate: (data: TransactionPayload | TransactionPayload[]) => Promise<unknown>;
  onUpdate: (data: TransactionUpdate<K>) => Promise<unknown>;
  onDelete: (ids: string[]) => Promise<void>;
}

export type EditChangeHandler<T> = (
  isEditing: boolean,
  editItem: T | null,
  handleCancel: () => void,
) => void;

export interface TransactionManagerProps<
  T extends TransactionItem & Record<K, string>,
  K extends string,
> {
  targetLabel: string;
  /** Title above the list. Defaults to "<targetLabel> Cadastrados". */
  listTitle?: string;
  idKey: K;
  manager: TransactionManagerStore<T, K>;
  /** Adds "Frequência / Quantidade de meses / A partir de" (receivables, extra expenses). */
  withFrequency?: boolean;
  onSubmit?: (data: TransactionData) => void;
  onEditChange?: EditChangeHandler<T>;
}
