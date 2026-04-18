"use client"

import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ActionButton } from "@/components/custom/buttons/action-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CustomListProps } from "./types";
import { useState } from "react";

/**
 * CustomList - A reusable list component with built-in selection, batch deletion, and pagination.
 */
export function CustomList<T>({
  title,
  items,
  idKey,
  columns,
  isLoading = false,
  emptyMessage = "Nenhum item encontrado.",
  onDeleteBatch,
  onUndo,
  showConfirmation = true,
  enableUndo = false,
  onRowClick,
  onEdit,
  highlightedId,
  pageSize = 5,
  className,
}: CustomListProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out hidden items (optimistic deletion)
  const visibleItems = items.filter((item) => !hiddenIds.has(String(item[idKey])));

  // Pagination logic
  const totalItems = visibleItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page is valid after deletions
  const activePage = Math.min(currentPage, totalPages);
  if (activePage !== currentPage && totalItems > 0) {
    setCurrentPage(activePage);
  }

  const startIndex = (activePage - 1) * pageSize;
  const paginatedItems = visibleItems.slice(startIndex, startIndex + pageSize);

  const canDelete = !!onDeleteBatch;

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map((item) => String(item[idKey]))));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const executeDelete = async (ids: string[]) => {
    setIsDeleting(true);
    try {
      await onDeleteBatch?.(ids);
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir itens.");
      setHiddenIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteBatch) return;

    const idsToRemove = Array.from(selectedIds);

    if (showConfirmation) {
      setIsConfirmOpen(true);
      return;
    }

    setHiddenIds((prev) => new Set([...prev, ...idsToRemove]));
    setSelectedIds(new Set());

    await executeDelete(idsToRemove);

    if (enableUndo && onUndo) {
      const deletedItems = items.filter((item) => idsToRemove.includes(String(item[idKey])));

      toast("Itens excluídos", {
        action: {
          label: "Desfazer",
          onClick: async () => {
            setHiddenIds((prev) => {
              const next = new Set(prev);
              idsToRemove.forEach((id) => next.delete(id));
              return next;
            });
            try {
              await onUndo(deletedItems);
              toast.success("Ação desfeita com sucesso!");
            } catch (err: any) {
              toast.error("Erro ao desfazer exclusão.");
            }
          },
        },
      });
    } else {
      toast.success("Itens excluídos com sucesso!");
    }
  };

  const handleConfirmDelete = async () => {
    const idsToRemove = Array.from(selectedIds);
    await executeDelete(idsToRemove);
    setSelectedIds(new Set());
    setIsConfirmOpen(false);
    toast.success("Itens excluídos com sucesso!");
  };

  const hasNextPage = activePage < totalPages;
  const hasPrevPage = activePage > 1;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        {canDelete && (
          <ActionButton
            icon={<Trash2 className="h-4 w-4" />}
            className="hover:text-destructive hover:bg-destructive/10 w-fit"
            disabled={selectedIds.size === 0 || isDeleting}
            onClick={handleDelete}
            title="Excluir selecionados"
          />
        )}
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 overflow-hidden rounded-md bg-white dark:bg-zinc-950">
        <div className="min-h-[226px]"> {/* Approx height for header + 5 rows */}
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50 sticky top-0">
              <TableRow className="h-8 hover:bg-transparent">
                {canDelete && (
                  <TableHead className="w-[40px] px-4 py-1.5">
                    <Checkbox
                      className="border-zinc-300"
                      checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((col, idx) => (
                  <TableHead key={idx} className={cn(col.className, "py-1.5")}>
                    {col.header}
                  </TableHead>
                ))}
                {onEdit && <TableHead className="w-[40px] py-1.5" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="h-[200px]">
                  <TableCell
                    colSpan={columns.length + (canDelete ? 1 : 0) + (onEdit ? 1 : 0)}
                    className="text-center text-zinc-500"
                  >
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : totalItems === 0 ? (
                <TableRow className="h-[200px]">
                  <TableCell
                    colSpan={columns.length + (canDelete ? 1 : 0) + (onEdit ? 1 : 0)}
                    className="text-center text-zinc-500"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {paginatedItems.map((item, rowIdx) => {
                    const id = String(item[idKey]);
                    const isHighlighted = id === highlightedId;

                    return (
                      <TableRow
                        key={id || rowIdx}
                        onClick={() => onRowClick?.(item)}
                        className={cn(
                          "h-8 transition-colors",
                          onRowClick && "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                          isHighlighted &&
                          "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-[inset_4px_0_0_0_#18181b] dark:shadow-[inset_4px_0_0_0_#f4f4f5]",
                        )}
                      >
                        {canDelete && (
                          <TableCell className="px-4 py-1.5" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              className="border-zinc-300"
                              checked={selectedIds.has(id)}
                              onCheckedChange={() => toggleSelect(id)}
                            />
                          </TableCell>
                        )}
                        {columns.map((col, colIdx) => (
                          <TableCell key={colIdx} className={cn(col.className, "py-1.5")}>
                            {col.render(item)}
                          </TableCell>
                        ))}
                        {onEdit && (
                          <TableCell className="w-[40px] px-2 py-1.5 text-right">
                            <ActionButton
                              icon={<Pencil className="h-3 w-3" />}
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item);
                              }}
                              className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                              title="Editar"
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                  {/* Empty rows to maintain height */}
                  {Array.from({ length: Math.max(0, pageSize - paginatedItems.length) }).map((_, idx) => (
                    <TableRow key={`empty-${idx}`} className="h-8 border-none hover:bg-transparent">
                      <TableCell colSpan={columns.length + (canDelete ? 1 : 0) + (onEdit ? 1 : 0)} />
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-xs">
          <div className="text-zinc-500 font-medium">
            {totalItems > 0 ? (
              <>
                Mostrando <span className="text-zinc-900 dark:text-zinc-100">{startIndex + 1}</span>-
                <span className="text-zinc-900 dark:text-zinc-100">{Math.min(startIndex + pageSize, totalItems)}</span> de{" "}
                <span className="text-zinc-900 dark:text-zinc-100">{totalItems}</span> itens
              </>
            ) : (
              "Sem itens"
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 hidden sm:inline-block">
              Página {activePage} de {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <ActionButton
                icon={<ChevronLeft className="h-4 w-4" />}
                variant="outline"
                onClick={() => setCurrentPage(activePage - 1)}
                disabled={!hasPrevPage}
                className="h-8 w-8 p-0"
              />
              <ActionButton
                icon={<ChevronRight className="h-4 w-4" />}
                variant="outline"
                onClick={() => setCurrentPage(activePage + 1)}
                disabled={!hasNextPage}
                className="h-8 w-8 p-0"
              />
            </div>
          </div>
        </div>
      </div>

      {canDelete && (
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir os itens selecionados? Essa ação é permanente e não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <ActionButton
                label="Cancelar"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isDeleting}
                className="w-24 px-4"
              />
              <ActionButton
                variant="destructive"
                label="Excluir"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                loading={isDeleting}
                className="w-24"
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
