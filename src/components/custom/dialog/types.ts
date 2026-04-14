import { ReactNode } from "react";

export interface BaseDialogProps {
  /**
   * Title of the dialog.
   */
  title: string;
  
  /**
   * Optional description for the dialog.
   */
  description?: ReactNode;
  
  /**
   * Whether the dialog is open.
   */
  isOpen: boolean;
  
  /**
   * Callback when the open state changes.
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * The content (form) to be displayed inside the dialog.
   */
  children: ReactNode;
  
  /**
   * Optional additional class names for the dialog content.
   */
  className?: string;
}
