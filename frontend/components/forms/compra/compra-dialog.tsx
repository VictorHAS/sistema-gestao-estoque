"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CompraForm } from "./compra-form"

interface Compra {
  id: string
  fornecedorId: string
  fornecedor: string
  itens: Array<{
    produtoId: string
    quantidade: number
    precoUnitario: number
  }>
  total: number
  status: string
  dataCompra: string
  dataEntrega: string
  observacoes?: string
}

interface CompraFormData {
  fornecedorId: string
  itens: Array<{
    produtoId: string
    quantidade: number
    precoUnitario: number
  }>
  dataEntrega: string
  observacoes?: string
}

interface CompraDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  compra?: Compra | null
  onSubmit: (data: CompraFormData) => void
  isLoading?: boolean
}

export function CompraDialog({ open, onOpenChange, compra, onSubmit, isLoading }: CompraDialogProps) {
  const handleSubmit = (data: CompraFormData) => {
    onSubmit(data)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {compra ? "Editar Compra" : "Nova Compra"}
          </DialogTitle>
          <DialogDescription>
            {compra ? "Atualize os dados da compra" : "Registre uma nova compra no sistema"}
          </DialogDescription>
        </DialogHeader>
        <CompraForm
          initialData={compra || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
