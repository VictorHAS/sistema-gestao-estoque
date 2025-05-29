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
import {
  Warehouse,
  MapPin,
  Calendar,
  Package,
  BarChart3,
  Hash
} from "lucide-react"

interface Deposito {
  id: string
  nome: string
  localizacao: string
  dataCriacao: string
  estoque: Array<{
    id: string
    produto: string
    codigo: string
    quantidade: number
  }>
}

interface DepositoDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deposito: Deposito | null
}

export function DepositoDetailsDialog({ open, onOpenChange, deposito }: DepositoDetailsDialogProps) {
  if (!deposito) return null

  const totalItens = deposito.estoque.length
  const totalQuantidade = deposito.estoque.reduce((acc, item) => acc + item.quantidade, 0)
  const itensComEstoqueBaixo = deposito.estoque.filter(item => item.quantidade < 10).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Detalhes do Depósito
          </DialogTitle>
          <DialogDescription>
            Informações completas e estoque do depósito selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Informações do Depósito */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Depósito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ID:</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded text-sm">#{deposito.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Nome:</span>
                  <span>{deposito.nome}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="font-medium">Localização:</span>
                    <p className="text-sm text-muted-foreground mt-1">{deposito.localizacao}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data de Criação:</span>
                  <span>{new Date(deposito.dataCriacao).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalItens}</div>
                    <div className="text-sm text-muted-foreground">Produtos</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalQuantidade}</div>
                    <div className="text-sm text-muted-foreground">Unidades</div>
                  </div>
                </div>

                {itensComEstoqueBaixo > 0 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-700 dark:text-orange-400">
                        {itensComEstoqueBaixo} produto(s) com estoque baixo
                      </span>
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
                    <span className="text-blue-600">📊</span>
                    <span>Relatório de estoque</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-green-600">📦</span>
                    <span>Transferir produtos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-purple-600">🔄</span>
                    <span>Inventário geral</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Estoque do Depósito */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estoque do Depósito</CardTitle>
              </CardHeader>
              <CardContent>
                {deposito.estoque.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum produto em estoque</p>
                    <p className="text-sm">Este depósito ainda não possui produtos cadastrados</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deposito.estoque.map((item, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{item.produto}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Código: {item.codigo}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Badge variant={item.quantidade < 10 ? "destructive" : item.quantidade < 20 ? "secondary" : "default"}>
                                {item.quantidade} un.
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alertas e Notificações */}
            {itensComEstoqueBaixo > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-orange-600">Alertas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deposito.estoque
                      .filter(item => item.quantidade < 10)
                      .map((item, index) => (
                        <div key={index} className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-orange-600" />
                            <div>
                              <span className="font-medium">{item.produto}</span>
                              <div className="text-sm text-muted-foreground">
                                Apenas {item.quantidade} unidades restantes
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
