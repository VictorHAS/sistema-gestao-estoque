"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import type { Supplier } from "@/lib/api/types"

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
  }

  const hasProducts = supplier.produtosAtivos > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <p>
                Tem certeza de que deseja excluir o fornecedor <strong>{supplier.nome}</strong>?
              </p>
              <div className="text-sm text-muted-foreground">
                <strong>Email:</strong> {supplier.email}
              </div>

              {hasProducts && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ Atenção! Este fornecedor possui {supplier.produtosAtivos} produto(s) associado(s).
                    A exclusão pode afetar outros registros do sistema.
                  </p>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
