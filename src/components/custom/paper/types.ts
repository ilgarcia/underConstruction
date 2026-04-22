import { ReactNode } from "react";

export interface PaperProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}
