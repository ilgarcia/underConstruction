import { ReactNode } from "react";

export interface ListColumn<T> {
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

export interface CustomListProps<T> {
  title: string;
  items: T[];
  idKey: keyof T;
  columns: ListColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onDeleteBatch?: (ids: string[]) => Promise<void>;
  onUndo?: (items: T[]) => Promise<void>;
  showConfirmation?: boolean;
  enableUndo?: boolean;
  onRowClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  highlightedId?: string;
  pageSize?: number;
  className?: string;
}
