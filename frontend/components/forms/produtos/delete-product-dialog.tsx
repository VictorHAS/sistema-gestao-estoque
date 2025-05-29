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

interface Product {
  id: string
  nome: string
  codigo: string
  estoque: number
  categoria: string
  preco: number
}

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onConfirm: (productId: string) => void
  isLoading?: boolean
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
  isLoading
}: DeleteProductDialogProps) {
  if (!product) return null

  const handleConfirm = () => {
    onConfirm(product.id)
    onOpenChange(false)
  }

  const hasStock = product.estoque > 0
  // Em um sistema real, você também verificaria se há movimentações (vendas/compras)
  const hasTransactions = false // Simulado - seria verificado via API

  const canDelete = !hasStock && !hasTransactions

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza de que deseja excluir o produto <strong>{product.nome}</strong>?
            </p>
            <p className="text-sm">
              <strong>Código:</strong> {product.codigo} | <strong>Categoria:</strong> {product.categoria}
            </p>

            {hasStock && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive font-medium">
                  ⚠️ Este produto possui {product.estoque} unidades em estoque.
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  Você deve zerar o estoque antes de excluir este produto.
                </p>
              </div>
            )}

            {hasTransactions && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive font-medium">
                  ⚠️ Este produto possui movimentações (vendas/compras) registradas.
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  Produtos com histórico não podem ser excluídos para manter a integridade dos dados.
                </p>
              </div>
            )}

            {canDelete && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-amber-800 font-medium">
                  💰 Valor de referência: R$ {product.preco.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}
                </p>
                <p className="text-destructive font-medium mt-2">
                  Esta ação não pode ser desfeita. Todas as informações do produto
                  serão permanentemente removidas.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || !canDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
