"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, UserCheck, Calendar, Mail, User } from "lucide-react"

interface User {
  id: string
  nome: string
  email: string
  cargo: "ADMIN" | "GERENTE" | "FUNCIONARIO"
  dataCriacao: string
  status: string
}

interface UserDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function UserDetailsDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
  if (!user) return null

  const getCargoColor = (cargo: string) => {
    switch (cargo) {
      case "ADMIN":
        return "destructive"
      case "GERENTE":
        return "default"
      case "FUNCIONARIO":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getCargoIcon = (cargo: string) => {
    switch (cargo) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />
      case "GERENTE":
        return <UserCheck className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getCargoDescription = (cargo: string) => {
    switch (cargo) {
      case "ADMIN":
        return "Acesso total ao sistema, pode gerenciar usuários e todas as funcionalidades"
      case "GERENTE":
        return "Pode gerenciar produtos, fornecedores, categorias, compras e visualizar relatórios"
      case "FUNCIONARIO":
        return "Pode realizar vendas e consultar produtos e estoque"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getCargoIcon(user.cargo)}
            Detalhes do Usuário
          </DialogTitle>
          <DialogDescription>
            Informações completas do usuário selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Nome:</span>
                <span>{user.nome}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Data de Criação:</span>
                <span>{new Date(user.dataCriacao).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge variant={user.status === "Ativo" ? "default" : "secondary"}>
                  {user.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Informações do Cargo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {getCargoIcon(user.cargo)}
                Cargo e Permissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Cargo:</span>
                <Badge variant={getCargoColor(user.cargo)} className="flex items-center gap-1">
                  {getCargoIcon(user.cargo)}
                  {user.cargo}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Descrição:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {getCargoDescription(user.cargo)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Permissões do Cargo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Permissões do Cargo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.cargo === "ADMIN" && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Gerenciar usuários
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Todas as permissões
                    </div>
                  </>
                )}
                {(user.cargo === "ADMIN" || user.cargo === "GERENTE") && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Gerenciar produtos
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Gerenciar fornecedores
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Realizar compras
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Visualizar relatórios
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  Realizar vendas
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  Consultar estoque
                </div>
                {user.cargo === "FUNCIONARIO" && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-500">✗</span>
                      Gerenciar produtos
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-500">✗</span>
                      Realizar compras
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
