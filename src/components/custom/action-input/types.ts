import { InputHTMLAttributes, ReactNode } from "react";

export interface ActionInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  /**
   * Optional label to display above the input.
   */
  label?: string;

  /**
   * If true, the input field will be read-only but the action button stays active.
   */
  readOnlyInput?: boolean;

  /**
   * Optional prefix to display on the left (e.g., "R$").
   */
  prefix?: ReactNode;
  
  /**
   * If true, sets prefix to "R$" by default.
   */
  isFinancial?: boolean;

  /**
   * Label for the action button on the right.
   */
  actionLabel?: ReactNode;

  /**
   * Icon for the action button.
   */
  actionIcon?: ReactNode;

  /**
   * Callback for the action button.
   */
  onAction?: () => void;

  /**
   * If false, the button will not be rendered even if onAction is provided.
   */
  showButton?: boolean;
  
  /**
   * Container class names.
   */
  containerClassName?: string;
}
