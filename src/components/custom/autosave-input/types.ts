export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export interface AutoSaveInputProps {
  label: string;
  value: number | string;
  type?: "currency" | "text";
  /** Persists the new value. Called on blur only when the value changed. */
  onSave: (value: number | string) => Promise<void>;
  disabled?: boolean;
  containerClassName?: string;
  /** Hides the "Salvo" status line under the field. */
  hideStatus?: boolean;
}
