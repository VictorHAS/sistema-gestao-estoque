"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import type { Produto } from "@/lib/api/types"

interface ProductFormData {
  nome: string
  descricao?: string
  codigo: string
  preco: number
  categoriaId: string
  fornecedorIds: string[]
}

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Produto | null
  onSubmit: (data: ProductFormData) => void
  isLoading?: boolean
}

export function ProductDialog({ open, onOpenChange, product, onSubmit, isLoading }: ProductDialogProps) {
  const handleSubmit = (data: ProductFormData) => {
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
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {product ? "Atualize as informações do produto" : "Adicione um novo produto ao catálogo"}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          initialData={product ? {
            ...product,
            fornecedorIds: [] // TODO: Get from product-supplier relation
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
