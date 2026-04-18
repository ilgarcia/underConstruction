import { InputHTMLAttributes, ReactNode } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

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
   * Type of the input. Supports standard types plus "currency" and "day_picker".
   */
  type?: "text" | "currency" | "day_picker" | string & {};

  /**
   * Maximum integer digits acceptable (if type="currency"), e.g., 10 for "9999999999,99".
   */
  maxDigits?: number;

  /**
   * If true, sets prefix to "R$" by default.
   * @deprecated use type="currency" instead.
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
   * If true, shows an action button with a default Plus icon.
   */
  actionInput?: boolean;
  
  /**
   * Container class names.
   */
  containerClassName?: string;
}

export interface FormActionInputProps<T extends FieldValues> extends ActionInputProps {
  control: Control<T, any>;
  name: Path<T>;
}
