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

interface Supplier {
  id: string
  nome: string
  email: string
  produtosAtivos: number
}

interface DeleteSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
  onConfirm: (supplierId: string) => void
  isLoading?: boolean
}

export function DeleteSupplierDialog({
  open,
  onOpenChange,
  supplier,
  onConfirm,
  isLoading
}: DeleteSupplierDialogProps) {
  if (!supplier) return null

  const handleConfirm = () => {
    onConfirm(supplier.id)
    onOpenChange(false)
  }

  const hasProducts = supplier.produtosAtivos > 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza de que deseja excluir o fornecedor <strong>{supplier.nome}</strong>?
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {supplier.email}
            </p>

            {hasProducts ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive font-medium">
                  ⚠️ Atenção! Este fornecedor possui {supplier.produtosAtivos} produto(s) associado(s).
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  Você deve remover ou reatribuir todos os produtos antes de excluir este fornecedor.
                </p>
              </div>
            ) : (
              <p className="text-destructive font-medium">
                Esta ação não pode ser desfeita. Todas as informações do fornecedor
                serão permanentemente removidas.
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
