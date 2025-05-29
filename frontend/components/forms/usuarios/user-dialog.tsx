"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserForm } from "./user-form"

interface User {
  id: string
  nome: string
  email: string
  cargo: "ADMIN" | "GERENTE" | "FUNCIONARIO"
  dataCriacao: string
  status: string
}

interface UserFormData {
  nome: string
  email: string
  senha?: string
  cargo: "ADMIN" | "GERENTE" | "FUNCIONARIO"
}

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSubmit: (data: UserFormData) => void
  isLoading?: boolean
}

export function UserDialog({ open, onOpenChange, user, onSubmit, isLoading }: UserDialogProps) {
  const handleSubmit = (data: UserFormData) => {
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
            {user ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {user ? "Atualize as informações do usuário" : "Adicione um novo usuário ao sistema"}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          initialData={user || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
