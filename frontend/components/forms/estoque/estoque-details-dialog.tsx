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
import { Package, ArrowUpCircle, ArrowDownCircle, Calendar, User, FileText, Tag } from "lucide-react"

interface MovimentacaoEstoque {
  id: string
  produtoId: string
  produto: string
  codigo: string
  tipo: "ENTRADA" | "SAIDA"
  quantidade: number
  motivo: string
  observacoes?: string
  dataMovimentacao: string
  usuario: string
  estoqueAnterior: number
  estoqueAtual: number
}

interface EstoqueDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movimentacao: MovimentacaoEstoque | null
}

export function EstoqueDetailsDialog({ open, onOpenChange, movimentacao }: EstoqueDetailsDialogProps) {
  if (!movimentacao) return null

  const getTipoColor = (tipo: string) => {
    return tipo === "ENTRADA" ? "default" : "destructive"
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === "ENTRADA" ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />
  }

  const getVariacaoEstoque = () => {
    return movimentacao.tipo === "ENTRADA"
      ? `+${movimentacao.quantidade}`
      : `-${movimentacao.quantidade}`
  }

  const getVariacaoColor = () => {
    return movimentacao.tipo === "ENTRADA" ? "text-green-600" : "text-red-600"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalhes da Movimentação
          </DialogTitle>
          <DialogDescription>
            Informações completas da movimentação de estoque
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Movimentação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Movimentação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">ID:</span>
                <span className="font-mono bg-muted px-2 py-1 rounded text-sm">#{movimentacao.id}</span>
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
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Data:</span>
                <span className="text-sm sm:text-base">{new Date(movimentacao.dataMovimentacao).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Usuário:</span>
                <span>{movimentacao.usuario}</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Informações do Produto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produto Movimentado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Nome:</span>
                <span className="break-words">{movimentacao.produto}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Código:</span>
                <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{movimentacao.codigo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Quantidade Movimentada:</span>
                <span className={`text-lg font-bold ${getVariacaoColor()}`}>
                  {getVariacaoEstoque()} unidades
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Impacto no Estoque */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impacto no Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Estoque Anterior</p>
                  <p className="text-2xl font-bold">{movimentacao.estoqueAnterior}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className={`text-3xl font-bold ${getVariacaoColor()}`}>
                    {movimentacao.tipo === "ENTRADA" ? "+" : "-"}
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Estoque Atual</p>
                  <p className="text-2xl font-bold">{movimentacao.estoqueAtual}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivo e Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes da Operação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <span className="font-medium">Motivo:</span>
                  <p className="text-muted-foreground mt-1 break-words">{movimentacao.motivo}</p>
                </div>
              </div>
              {movimentacao.observacoes && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <span className="font-medium">Observações:</span>
                    <p className="text-muted-foreground mt-1 break-words">{movimentacao.observacoes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações Relacionadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Relacionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <span className="text-blue-600">📦</span>
                  <span>Ver produto completo</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <span className="text-green-600">📊</span>
                  <span>Histórico do produto</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <span className="text-purple-600">📋</span>
                  <span>Relatório de estoque</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <span className="text-orange-600">🔄</span>
                  <span>Nova movimentação</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
