"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SupplierForm } from "./supplier-form"
import type { Supplier } from "@/lib/api/types"

interface SupplierFormData {
  nome: string
  email: string
  telefone?: string
  endereco?: string
}

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier | null
  onSubmit: (data: SupplierFormData) => void
  isLoading?: boolean
}

export function SupplierDialog({ open, onOpenChange, supplier, onSubmit, isLoading }: SupplierDialogProps) {
  const handleSubmit = (data: SupplierFormData) => {
    onSubmit(data)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {supplier ? "Editar Fornecedor" : "Novo Fornecedor"}
          </DialogTitle>
          <DialogDescription>
            {supplier ? "Atualize as informações do fornecedor" : "Adicione um novo fornecedor ao sistema"}
          </DialogDescription>
        </DialogHeader>
        <SupplierForm
          initialData={supplier || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
