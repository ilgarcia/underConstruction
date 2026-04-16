import { ButtonHTMLAttributes, ReactNode } from "react";

/** Requires at least one of `icon` or `label` */
type ActionButtonBase = {
  /** Loading state — renders a spinner in place of the icon */
  loading?: boolean;
  /** Extra classes for the button */
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type WithIcon = ActionButtonBase & { icon: ReactNode; label?: ReactNode };
type WithLabel = ActionButtonBase & { icon?: ReactNode; label: ReactNode };

export type ActionButtonProps = WithIcon | WithLabel;
