"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DepositoForm } from "./deposito-form"

interface Deposito {
  id: string
  nome: string
  localizacao: string
  dataCriacao: string
  estoqueTotal?: number
}

interface DepositoFormData {
  nome: string
  localizacao: string
}

interface DepositoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deposito?: Deposito | null
  onSubmit: (data: DepositoFormData) => void
  isLoading?: boolean
}

export function DepositoDialog({ open, onOpenChange, deposito, onSubmit, isLoading }: DepositoDialogProps) {
  const handleSubmit = (data: DepositoFormData) => {
    onSubmit(data)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {deposito ? "Editar Depósito" : "Novo Depósito"}
          </DialogTitle>
          <DialogDescription>
            {deposito ? "Atualize as informações do depósito" : "Cadastre um novo depósito"}
          </DialogDescription>
        </DialogHeader>
        <DepositoForm
          initialData={deposito || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
