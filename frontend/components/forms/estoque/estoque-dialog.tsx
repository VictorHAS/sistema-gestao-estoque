"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EstoqueForm } from "./estoque-form"

interface MovimentacaoEstoque {
  id: string
  produtoId: string
  produto: string
  tipo: "ENTRADA" | "SAIDA"
  quantidade: number
  motivo: string
  observacoes?: string
  dataMovimentacao: string
  usuario: string
}

interface EstoqueFormData {
  produtoId: string
  tipo: "ENTRADA" | "SAIDA"
  quantidade: number
  motivo: string
  observacoes?: string
}

interface EstoqueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movimentacao?: MovimentacaoEstoque | null
  onSubmit: (data: EstoqueFormData) => void
  isLoading?: boolean
}

export function EstoqueDialog({ open, onOpenChange, movimentacao, onSubmit, isLoading }: EstoqueDialogProps) {
  const handleSubmit = (data: EstoqueFormData) => {
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
            {movimentacao ? "Editar Movimentação" : "Nova Movimentação"}
          </DialogTitle>
          <DialogDescription>
            {movimentacao ? "Atualize os dados da movimentação de estoque" : "Registre uma nova movimentação de estoque"}
          </DialogDescription>
        </DialogHeader>
        <EstoqueForm
          initialData={movimentacao || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
