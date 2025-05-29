"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VendaForm } from "./venda-form"

interface Venda {
  id: string
  clienteNome: string
  clienteEmail?: string
  clienteTelefone: string
  itens: Array<{
    produtoId: string
    quantidade: number
    precoUnitario: number
  }>
  total: number
  formaPagamento: "DINHEIRO" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "PIX" | "BOLETO"
  status: string
  dataVenda: string
  observacoes?: string
}

interface VendaFormData {
  clienteNome: string
  clienteEmail?: string
  clienteTelefone: string
  itens: Array<{
    produtoId: string
    quantidade: number
    precoUnitario: number
  }>
  formaPagamento: "DINHEIRO" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "PIX" | "BOLETO"
  observacoes?: string
}

interface VendaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venda?: Venda | null
  onSubmit: (data: VendaFormData) => void
  isLoading?: boolean
}

export function VendaDialog({ open, onOpenChange, venda, onSubmit, isLoading }: VendaDialogProps) {
  const handleSubmit = (data: VendaFormData) => {
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
            {venda ? "Editar Venda" : "Nova Venda"}
          </DialogTitle>
          <DialogDescription>
            {venda ? "Atualize os dados da venda" : "Registre uma nova venda no sistema"}
          </DialogDescription>
        </DialogHeader>
        <VendaForm
          initialData={venda || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
