"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Categoria } from "@/lib/api/types"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Categoria | null
  onConfirm: () => void
  isLoading?: boolean
  productCount?: number
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
  isLoading,
  productCount = 0
}: DeleteCategoryDialogProps) {
  if (!category) return null

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const hasProducts = productCount > 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza de que deseja excluir a categoria <strong>{category.nome}</strong>?
            </p>

            {hasProducts ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive font-medium">
                  ⚠️ Atenção! Esta categoria possui {productCount} produto(s) associado(s).
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  Você deve remover ou reatribuir todos os produtos antes de excluir esta categoria.
                </p>
              </div>
            ) : (
              <p className="text-destructive font-medium">
                Esta ação não pode ser desfeita.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || hasProducts}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
