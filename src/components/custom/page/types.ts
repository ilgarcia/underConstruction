import { ReactNode } from "react";

export interface PageProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  onOptionChange?: (selectedIds: string[]) => void;
}
