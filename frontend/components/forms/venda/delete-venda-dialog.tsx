"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, AlertTriangle, User, CreditCard } from "lucide-react"

interface Venda {
  id: string
  clienteNome: string
  clienteTelefone: string
  total: number
  formaPagamento: "DINHEIRO" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "PIX" | "BOLETO"
  status: "PENDENTE" | "PAGA" | "CANCELADA"
  dataVenda: string
  vendedor: string
}

interface DeleteVendaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venda: Venda | null
  onConfirm: (id: string) => void
  isLoading?: boolean
}

const formasPagamentoMap = {
  DINHEIRO: { label: "Dinheiro", icon: "💵" },
  CARTAO_CREDITO: { label: "Cartão de Crédito", icon: "💳" },
  CARTAO_DEBITO: { label: "Cartão de Débito", icon: "💳" },
  PIX: { label: "PIX", icon: "📱" },
  BOLETO: { label: "Boleto", icon: "📄" },
}

export function DeleteVendaDialog({
  open,
  onOpenChange,
  venda,
  onConfirm,
  isLoading
}: DeleteVendaDialogProps) {
  if (!venda) return null

  const handleConfirm = () => {
    onConfirm(venda.id)
  }

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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Excluir Venda
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
              </p>

              {/* Detalhes da venda a ser excluída */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ID da Venda:</span>
                  <span className="font-mono">#{venda.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Cliente:</span>
                  <span>{venda.clienteNome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-green-600">R$ {venda.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Pagamento:</span>
                  <div className="flex items-center gap-1">
                    <span>{getFormaPagamentoInfo(venda.formaPagamento).icon}</span>
                    <span>{getFormaPagamentoInfo(venda.formaPagamento).label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(venda.status)} className="flex items-center gap-1">
                    <span>{getStatusIcon(venda.status)}</span>
                    {venda.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Data:</span>
                  <span>{new Date(venda.dataVenda).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Vendedor:</span>
                  <span>{venda.vendedor}</span>
                </div>
              </div>

              {/* Aviso sobre impactos */}
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Atenção:</p>
                    <p className="text-muted-foreground mt-1">
                      A exclusão desta venda afetará:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                      <li>Histórico de vendas e relatórios</li>
                      <li>Estoque dos produtos (não será revertido automaticamente)</li>
                      <li>Dados de faturamento</li>
                      {venda.status === "PAGA" && (
                        <li className="text-destructive">⚠️ Esta venda já está PAGA</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Excluindo..." : "Excluir Venda"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
