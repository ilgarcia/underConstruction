import { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonBase = {
  loading?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
} & ButtonHTMLAttributes<HTMLButtonElement>;

type WithIcon = ActionButtonBase & { icon: ReactNode; label?: ReactNode };
type WithLabel = ActionButtonBase & { icon?: ReactNode; label: ReactNode };

export type ActionButtonProps = WithIcon | WithLabel;
