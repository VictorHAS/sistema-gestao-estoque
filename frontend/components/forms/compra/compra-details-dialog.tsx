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
import {
  ShoppingBag,
  Building2,
  Phone,
  Mail,
  Calendar,
  Package,
  Hash,
  User
} from "lucide-react"
import type { Compra } from "@/lib/api/types"

interface CompraDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  compra: Compra | null
}

export function CompraDetailsDialog({ open, onOpenChange, compra }: CompraDetailsDialogProps) {
  if (!compra) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEBIDO":
        return "default"
      case "APROVADO":
        return "secondary"
      case "PENDENTE":
        return "outline"
      case "CONCLUIDO":
        return "default"
      case "CANCELADO":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RECEBIDO":
        return "✅"
      case "APROVADO":
        return "🔄"
      case "PENDENTE":
        return "⏳"
      case "CONCLUIDO":
        return "✅"
      case "CANCELADO":
        return "❌"
      default:
        return "❓"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Detalhes da Compra
          </DialogTitle>
          <DialogDescription>
            Informações completas da compra selecionada
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Informações da Compra */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ID:</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded text-sm">#{compra.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data da Compra:</span>
                  <span className="text-sm sm:text-base">{new Date(compra.dataCriacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(compra.status)} className="flex items-center gap-1">
                    <span>{getStatusIcon(compra.status)}</span>
                    {compra.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Responsável:</span>
                  <span className="break-words">{compra.usuario?.nome || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Valor Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    R$ {compra.valorTotal.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Fornecedor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fornecedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Nome:</span>
                  <span className="break-words">{compra.fornecedor?.nome || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span className="break-all text-sm">{compra.fornecedor?.email || 'N/A'}</span>
                </div>
                {compra.fornecedor?.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Telefone:</span>
                    <span>{compra.fornecedor.telefone}</span>
                  </div>
                )}
                {compra.fornecedor?.endereco && (
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <span className="font-medium">Endereço:</span>
                      <p className="text-sm text-muted-foreground mt-1">{compra.fornecedor.endereco}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-blue-600">📧</span>
                    <span>Entrar em contato</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-green-600">✅</span>
                    <span>Marcar como recebida</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-purple-600">🧾</span>
                    <span>Gerar ordem de compra</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-orange-600">📱</span>
                    <span>Acompanhar entrega</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Produto Principal da Compra */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Produto da Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{compra.produto?.nome || 'Produto não encontrado'}</span>
                      </div>
                      {compra.produto?.codigo && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Código: {compra.produto.codigo}
                        </div>
                      )}
                      <div className="text-sm mt-1">
                        {compra.quantidade}x R$ {compra.precoUnitario.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        R$ {(compra.quantidade * compra.precoUnitario).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Financeiras */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span>{compra.quantidade} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço Unitário:</span>
                    <span>R$ {compra.precoUnitario.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {(compra.quantidade * compra.precoUnitario).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">R$ {compra.valorTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Estimativa de Impacto no Estoque */}
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 text-green-700 dark:text-green-400">Impacto no Estoque</h4>
                  <div className="text-sm text-green-600 dark:text-green-300">
                    <div>• Aumento total: {compra.quantidade} unidades</div>
                    <div>• Valor adicionado: R$ {compra.valorTotal.toFixed(2)}</div>
                    <div>• Status: {compra.status === "RECEBIDO" ? "Já incorporado" : "Pendente"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Auditoria */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Auditoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Criado em:</span>
                  <span className="text-sm">{new Date(compra.dataCriacao).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Atualizado em:</span>
                  <span className="text-sm">{new Date(compra.dataAtualizacao).toLocaleString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
