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
import { Package, AlertTriangle, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

interface MovimentacaoEstoque {
  id: string
  produtoId: string
  produto: string
  tipo: "ENTRADA" | "SAIDA"
  quantidade: number
  motivo: string
  dataMovimentacao: string
  usuario: string
}

interface DeleteEstoqueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movimentacao: MovimentacaoEstoque | null
  onConfirm: (id: string) => void
  isLoading?: boolean
}

export function DeleteEstoqueDialog({
  open,
  onOpenChange,
  movimentacao,
  onConfirm,
  isLoading
}: DeleteEstoqueDialogProps) {
  if (!movimentacao) return null

  const handleConfirm = () => {
    onConfirm(movimentacao.id)
  }

  const getTipoColor = (tipo: string) => {
    return tipo === "ENTRADA" ? "default" : "destructive"
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === "ENTRADA" ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Excluir Movimentação de Estoque
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita.
              </p>

              {/* Detalhes da movimentação a ser excluída */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Produto:</span>
                  <span>{movimentacao.produto}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTipoIcon(movimentacao.tipo)}
                  <span className="font-medium">Tipo:</span>
                  <Badge variant={getTipoColor(movimentacao.tipo)} className="flex items-center gap-1">
                    {getTipoIcon(movimentacao.tipo)}
                    {movimentacao.tipo}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Quantidade:</span>
                  <span className="font-bold">{movimentacao.quantidade} unidades</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Motivo:</span>
                  <span>{movimentacao.motivo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Data:</span>
                  <span>{new Date(movimentacao.dataMovimentacao).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Usuário:</span>
                  <span>{movimentacao.usuario}</span>
                </div>
              </div>

              {/* Aviso sobre impactos */}
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Atenção:</p>
                    <p className="text-muted-foreground mt-1">
                      A exclusão desta movimentação pode afetar o histórico de estoque e relatórios.
                      Certifique-se de que esta ação é necessária.
                    </p>
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
            {isLoading ? "Excluindo..." : "Excluir Movimentação"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
