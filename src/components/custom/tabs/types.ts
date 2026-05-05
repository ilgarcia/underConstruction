import { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface CustomTabsProps {
  items: TabItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  vertical?: boolean;
  className?: string;
}
