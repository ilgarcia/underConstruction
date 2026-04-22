import { InputHTMLAttributes, ReactNode } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export interface ActionInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  readOnlyInput?: boolean;
  prefix?: ReactNode;
  type?: "text" | "currency" | "day_picker" | string & {};
  maxDigits?: number;
  isFinancial?: boolean;
  actionLabel?: ReactNode;
  actionIcon?: ReactNode;
  onAction?: () => void;
  showButton?: boolean;
  actionInput?: boolean;
  containerClassName?: string;
  rightAction?: ReactNode;
  submitProps?: {
    loading?: boolean;
    disabled?: boolean;
  };
}

export interface FormActionInputProps<T extends FieldValues> extends ActionInputProps {
  control: Control<T, any>;
  name: Path<T>;
}
