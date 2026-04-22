"use client";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { BaseDialogProps } from "./types";
import { cn } from "@/lib/utils";
import { ActionButton } from "../buttons/action-button";

export function BaseDialog({
  onOpenChange,
  onClose,
  children,
  config,
  ...props
}: BaseDialogProps) {
  const internalIsOpen = props.isOpen ?? !!config;

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose?.();
    onOpenChange?.(open);
  };

  const title = config?.title ?? props.title;
  const description = config?.description ?? props.description;
  const hideHeader = config?.hideHeader ?? props.hideHeader;
  const subtitleNode = config?.subtitleNode ?? props.subtitleNode;
  const headerAction = config?.headerAction ?? props.headerAction;
  const editMode = config?.editMode ?? props.editMode;
  const content = children ?? config?.content;

  const showHeaderAction = headerAction || (editMode?.isEditing);

  return (
    <Dialog open={internalIsOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={"sm:max-w-[425px] md:min-w-4xl rounded-none border-zinc-200 dark:border-zinc-800"}>
        {!hideHeader && (
          <DialogHeader className={cn(showHeaderAction ? "flex flex-row items-end justify-between space-y-0" : "")}>
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                Transaction details and categorization form.
              </DialogDescription>
            )}
            
            {editMode?.isEditing && (
              <p className={cn(
                "text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 transition-all duration-300 opacity-100 translate-x-0"
              )}>
                Editando: <span className="text-blue-600 dark:text-blue-400 font-bold">{editMode.itemName}</span>
              </p>
            )}
            
            {subtitleNode}
          </div>
          
          {showHeaderAction && (
            <div className="mt-0 space-y-0">
              {headerAction}
              {editMode?.isEditing && (
                <div className="opacity-100 scale-100 transition-all duration-300">
                  <ActionButton
                    label="Cancelar Edição"
                    onClick={editMode.onCancel}
                    className="text-xs w-fit"
                    variant="outline"
                  />
                </div>
              )}
            </div>
          )}
        </DialogHeader>
        )}
        
        <div className={cn("min-h-0", hideHeader && "pt-6")}>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
