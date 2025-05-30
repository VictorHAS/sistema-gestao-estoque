"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar, User, CreditCard, Package, DollarSign, FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import type { Venda } from "@/lib/api/types"

interface VendaDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venda: Venda | null
}

export function VendaDetailsDialog({ open, onOpenChange, venda }: VendaDetailsDialogProps) {
  if (!venda) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONCLUIDO":
        return "default"
      case "PENDENTE":
        return "secondary"
      case "APROVADO":
        return "outline"
      case "RECEBIDO":
        return "default"
      case "CANCELADO":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONCLUIDO":
        return "✅"
      case "PENDENTE":
        return "⏳"
      case "APROVADO":
        return "🔄"
      case "RECEBIDO":
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
            <ShoppingCart className="h-5 w-5" />
            Detalhes da Venda
          </DialogTitle>
          <DialogDescription>
            Informações completas da venda selecionada
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Informações da Venda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Venda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ID:</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded text-sm">#{venda.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data:</span>
                  <span className="text-sm sm:text-base">{new Date(venda.dataCriacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Vendedor:</span>
                  <span className="break-words">{venda.usuario?.nome || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(venda.status)} className="flex items-center gap-1">
                    <span>{getStatusIcon(venda.status)}</span>
                    {venda.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Valor Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    R$ {venda.valorTotal.toFixed(2)}
                  </span>
                </div>
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
                    <span className="text-blue-600">🧾</span>
                    <span>Imprimir nota fiscal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-green-600">📧</span>
                    <span>Enviar por email</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-purple-600">🔄</span>
                    <span>Processar devolução</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-orange-600">📱</span>
                    <span>Atualizar status</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Itens da Venda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Itens da Venda</CardTitle>
              </CardHeader>
              <CardContent>
                {venda.itens && venda.itens.length > 0 ? (
                  <div className="space-y-4">
                    {venda.itens.map((item, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{item.produto?.nome || 'Produto não encontrado'}</span>
                            </div>
                            {item.produto?.codigo && (
                              <div className="text-sm text-muted-foreground mt-1">
                                Código: {item.produto.codigo}
                              </div>
                            )}
                            <div className="text-sm mt-1">
                              {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum item encontrado</p>
                    <p className="text-sm">Esta venda não possui itens cadastrados</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações Financeiras */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {venda.itens && venda.itens.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Itens:</span>
                        <span>{venda.itens.length} produto(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantidade Total:</span>
                        <span>{venda.itens.reduce((acc, item) => acc + item.quantidade, 0)} unidades</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>R$ {venda.itens.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0).toFixed(2)}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {venda.valorTotal.toFixed(2)}</span>
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
                  <span className="text-sm">{new Date(venda.dataCriacao).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Atualizado em:</span>
                  <span className="text-sm">{new Date(venda.dataAtualizacao).toLocaleString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
