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
  ShoppingCart,
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Package,
  FileText,
  Hash
} from "lucide-react"

interface Venda {
  id: string
  clienteNome: string
  clienteEmail?: string
  clienteTelefone: string
  itens: Array<{
    produtoId: string
    produto: string
    codigo: string
    quantidade: number
    precoUnitario: number
  }>
  total: number
  formaPagamento: "DINHEIRO" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "PIX" | "BOLETO"
  status: "PENDENTE" | "PAGA" | "CANCELADA"
  dataVenda: string
  observacoes?: string
  vendedor: string
}

interface VendaDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venda: Venda | null
}

const formasPagamentoMap = {
  DINHEIRO: { label: "Dinheiro", icon: "💵" },
  CARTAO_CREDITO: { label: "Cartão de Crédito", icon: "💳" },
  CARTAO_DEBITO: { label: "Cartão de Débito", icon: "💳" },
  PIX: { label: "PIX", icon: "📱" },
  BOLETO: { label: "Boleto", icon: "📄" },
}

export function VendaDetailsDialog({ open, onOpenChange, venda }: VendaDetailsDialogProps) {
  if (!venda) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAGA":
        return "default"
      case "PENDENTE":
        return "secondary"
      case "CANCELADA":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAGA":
        return "✅"
      case "PENDENTE":
        return "⏳"
      case "CANCELADA":
        return "❌"
      default:
        return "❓"
    }
  }

  const getFormaPagamentoInfo = (forma: string) => {
    return formasPagamentoMap[forma as keyof typeof formasPagamentoMap] || { label: forma, icon: "💳" }
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
                  <span className="text-sm sm:text-base">{new Date(venda.dataVenda).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Vendedor:</span>
                  <span className="break-words">{venda.vendedor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(venda.status)} className="flex items-center gap-1">
                    <span>{getStatusIcon(venda.status)}</span>
                    {venda.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Nome:</span>
                  <span className="break-words">{venda.clienteNome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Telefone:</span>
                  <span>{venda.clienteTelefone}</span>
                </div>
                {venda.clienteEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span className="break-all text-sm">{venda.clienteEmail}</span>
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
                    <span>Contatar cliente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Produtos Vendidos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Produtos Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venda.itens.map((item, index) => (
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
                          <div className="font-bold text-green-600">
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
                <CardTitle className="text-lg">Informações Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Forma de Pagamento:</span>
                  <div className="flex items-center gap-1">
                    <span>{getFormaPagamentoInfo(venda.formaPagamento).icon}</span>
                    <span>{getFormaPagamentoInfo(venda.formaPagamento).label}</span>
                  </div>
                </div>

                <Separator />

                {/* Resumo Financeiro */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {venda.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto:</span>
                    <span>R$ 0,00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {venda.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Informações Adicionais */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Resumo da Venda</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Itens:</span>
                      <div className="font-medium">{venda.itens.length} produto(s)</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantidade:</span>
                      <div className="font-medium">
                        {venda.itens.reduce((acc, item) => acc + item.quantidade, 0)} un.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            {venda.observacoes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-sm text-muted-foreground">{venda.observacoes}</p>
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
