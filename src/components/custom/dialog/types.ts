import { ReactNode } from "react";

export interface EditModeConfig {
  isEditing: boolean;
  itemName?: string;
  onCancel: () => void;
}

export interface BaseDialogProps {
  title?: string;
  hideHeader?: boolean;
  description?: ReactNode;
  headerAction?: ReactNode;
  subtitleNode?: ReactNode;
  isOpen?: boolean;
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  editMode?: EditModeConfig;
  config?: DialogConfig | null;
}

export interface DialogConfig {
  title: string;
  description?: ReactNode;
  content: ReactNode;
  hideHeader?: boolean;
  subtitleNode?: ReactNode;
  headerAction?: ReactNode;
  editMode?: EditModeConfig;
}
