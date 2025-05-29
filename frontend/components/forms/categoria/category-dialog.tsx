"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CategoryForm } from "./category-form"

interface Category {
  id: string
  nome: string
  totalProdutos: number
  dataCriacao: string
}

interface CategoryFormData {
  nome: string
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSubmit: (data: CategoryFormData) => void
  isLoading?: boolean
}

export function CategoryDialog({ open, onOpenChange, category, onSubmit, isLoading }: CategoryDialogProps) {
  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {category ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            {category ? "Atualize as informações da categoria" : "Adicione uma nova categoria ao sistema"}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          initialData={category || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
