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
import { ShoppingBag, AlertTriangle, Building2, Calendar, Truck } from "lucide-react"

interface Compra {
  id: string
  fornecedor: string
  total: number
  status: "PENDENTE" | "APROVADA" | "RECEBIDA" | "CANCELADA"
  dataCompra: string
  dataEntrega: string
  responsavel: string
  itens: Array<{
    produto: string
    quantidade: number
  }>
}

interface DeleteCompraDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  compra: Compra | null
  onConfirm: (id: string) => void
  isLoading?: boolean
}

export function DeleteCompraDialog({
  open,
  onOpenChange,
  compra,
  onConfirm,
  isLoading
}: DeleteCompraDialogProps) {
  if (!compra) return null

  const handleConfirm = () => {
    onConfirm(compra.id)
  }

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

  const getTotalItens = () => {
    return compra.itens.reduce((acc, item) => acc + item.quantidade, 0)
  }

  const isCompraRecebida = compra.status === "RECEBIDA"
  const isCompraAprovada = compra.status === "APROVADA"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Excluir Compra
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.
              </p>

              {/* Detalhes da compra a ser excluída */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ID da Compra:</span>
                  <span className="font-mono">#{compra.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Fornecedor:</span>
                  <span>{compra.fornecedor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-blue-600">R$ {compra.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Produtos:</span>
                  <span>{compra.itens.length} itens ({getTotalItens()} unidades)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(compra.status)} className="flex items-center gap-1">
                    <span>{getStatusIcon(compra.status)}</span>
                    {compra.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data da Compra:</span>
                  <span>{new Date(compra.dataCompra).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Entrega Prevista:</span>
                  <span>{new Date(compra.dataEntrega).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Responsável:</span>
                  <span>{compra.responsavel}</span>
                </div>
              </div>

              {/* Lista de produtos */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="font-medium text-sm mb-2">Produtos na compra:</p>
                <div className="text-sm space-y-1">
                  {compra.itens.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.produto}</span>
                      <span>{item.quantidade} un.</span>
                    </div>
                  ))}
                  {compra.itens.length > 3 && (
                    <div className="text-muted-foreground text-xs">
                      ... e mais {compra.itens.length - 3} produto(s)
                    </div>
                  )}
                </div>
              </div>

              {/* Avisos sobre impactos */}
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Atenção:</p>
                    <p className="text-muted-foreground mt-1">
                      A exclusão desta compra afetará:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                      <li>Histórico de compras e relatórios</li>
                      <li>Controle de fornecedores</li>
                      <li>Dados de custo dos produtos</li>
                      {isCompraRecebida && (
                        <li className="text-destructive">⚠️ Esta compra já foi RECEBIDA - o estoque pode ter sido atualizado</li>
                      )}
                      {isCompraAprovada && (
                        <li className="text-orange-600">⚠️ Esta compra está APROVADA - pode estar em processo de entrega</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Aviso especial para compras recebidas */}
              {isCompraRecebida && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Compra já recebida: considere cancelar ao invés de excluir!
                    </span>
                  </div>
                </div>
              )}
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
            {isLoading ? "Excluindo..." : "Excluir Compra"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
