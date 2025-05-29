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

interface Category {
  id: string
  nome: string
  totalProdutos: number
}

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onConfirm: (categoryId: string) => void
  isLoading?: boolean
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
  isLoading
}: DeleteCategoryDialogProps) {
  if (!category) return null

  const handleConfirm = () => {
    onConfirm(category.id)
    onOpenChange(false)
  }

  const hasProducts = category.totalProdutos > 0

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
                  ⚠️ Atenção! Esta categoria possui {category.totalProdutos} produto(s) associado(s).
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
