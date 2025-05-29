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
  FileText,
  Hash,
  Truck
} from "lucide-react"

interface Compra {
  id: string
  fornecedorId: string
  fornecedor: string
  fornecedorEmail: string
  fornecedorTelefone: string
  itens: Array<{
    produtoId: string
    produto: string
    codigo: string
    quantidade: number
    precoUnitario: number
  }>
  total: number
  status: "PENDENTE" | "APROVADA" | "RECEBIDA" | "CANCELADA"
  dataCompra: string
  dataEntrega: string
  dataRecebimento?: string
  responsavel: string
  observacoes?: string
}

interface CompraDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  compra: Compra | null
}

export function CompraDetailsDialog({ open, onOpenChange, compra }: CompraDetailsDialogProps) {
  if (!compra) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEBIDA":
        return "default"
      case "APROVADA":
        return "secondary"
      case "PENDENTE":
        return "outline"
      case "CANCELADA":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RECEBIDA":
        return "✅"
      case "APROVADA":
        return "🔄"
      case "PENDENTE":
        return "⏳"
      case "CANCELADA":
        return "❌"
      default:
        return "❓"
    }
  }

  const isAtrasada = () => {
    if (compra.status === "RECEBIDA" || compra.status === "CANCELADA") return false
    const hoje = new Date()
    const dataEntrega = new Date(compra.dataEntrega)
    return hoje > dataEntrega
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
                  <span className="text-sm sm:text-base">{new Date(compra.dataCompra).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Entrega Prevista:</span>
                  <span className="text-sm sm:text-base">{new Date(compra.dataEntrega).toLocaleDateString('pt-BR')}</span>
                  {isAtrasada() && (
                    <Badge variant="destructive" className="ml-2 text-xs">Atrasada</Badge>
                  )}
                </div>
                {compra.dataRecebimento && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Data Recebimento:</span>
                    <span className="text-sm sm:text-base">{new Date(compra.dataRecebimento).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(compra.status)} className="flex items-center gap-1">
                    <span>{getStatusIcon(compra.status)}</span>
                    {compra.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Responsável:</span>
                  <span className="break-words">{compra.responsavel}</span>
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
                  <span className="break-words">{compra.fornecedor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span className="break-all text-sm">{compra.fornecedorEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Telefone:</span>
                  <span>{compra.fornecedorTelefone}</span>
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
            {/* Produtos Comprados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Produtos Comprados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compra.itens.map((item, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.produto}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Código: {item.codigo}
                          </div>
                          <div className="text-sm mt-1">
                            {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">
                            R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Informações Financeiras */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resumo Financeiro */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {compra.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete:</span>
                    <span>R$ 0,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impostos:</span>
                    <span>R$ 0,00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">R$ {compra.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Informações Adicionais */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Resumo da Compra</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Itens:</span>
                      <div className="font-medium">{compra.itens.length} produto(s)</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantidade:</span>
                      <div className="font-medium">
                        {compra.itens.reduce((acc, item) => acc + item.quantidade, 0)} un.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimativa de Impacto no Estoque */}
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 text-green-700 dark:text-green-400">Impacto no Estoque</h4>
                  <div className="text-sm text-green-600 dark:text-green-300">
                    <div>• Aumento total: {compra.itens.reduce((acc, item) => acc + item.quantidade, 0)} unidades</div>
                    <div>• Valor adicionado: R$ {compra.total.toFixed(2)}</div>
                    <div>• Status: {compra.status === "RECEBIDA" ? "Já incorporado" : "Pendente"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            {compra.observacoes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-sm text-muted-foreground">{compra.observacoes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
