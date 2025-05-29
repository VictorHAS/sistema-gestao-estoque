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
import { Package, DollarSign, BarChart, Building, Tag, FileText, Calendar } from "lucide-react"

interface Product {
  id: string
  nome: string
  descricao?: string
  codigo: string
  preco: number
  categoriaId: string
  categoria: string
  estoque: number
  fornecedor: string
  fornecedorIds?: string[]
  status: string
  dataCriacao?: string
  dataAtualizacao?: string
}

// Mock fornecedores para mapear IDs para nomes
const fornecedoresMap = {
  "1": "Dell Brasil Ltda",
  "2": "Logitech do Brasil",
  "3": "Razer Inc",
  "4": "Samsung Electronics",
  "5": "TechCorp Distribuidora",
  "6": "HP Brasil",
  "7": "Lenovo",
}

interface ProductDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function ProductDetailsDialog({ open, onOpenChange, product }: ProductDetailsDialogProps) {
  if (!product) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "default"
      case "Baixo Estoque":
        return "secondary"
      case "Sem Estoque":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getEstoqueStatus = (estoque: number) => {
    if (estoque === 0) return "Sem Estoque"
    if (estoque < 10) return "Baixo Estoque"
    return "Estoque Normal"
  }

  const getEstoqueColor = (estoque: number) => {
    if (estoque === 0) return "destructive"
    if (estoque < 10) return "secondary"
    return "default"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalhes do Produto
          </DialogTitle>
          <DialogDescription>
            Informações completas do produto selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Nome:</span>
                    <span>{product.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Código:</span>
                    <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{product.codigo}</span>
                  </div>
                </div>

                {product.descricao && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <span className="font-medium">Descrição:</span>
                      <p className="text-muted-foreground mt-1">{product.descricao}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Categoria:</span>
                  <Badge variant="outline">{product.categoria}</Badge>
                </div>

                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="font-medium">Fornecedores:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.fornecedorIds && product.fornecedorIds.length > 0 ? (
                        product.fornecedorIds.map((fornecedorId) => (
                          <Badge key={fornecedorId} variant="secondary">
                            {fornecedoresMap[fornecedorId as keyof typeof fornecedoresMap] || "Fornecedor desconhecido"}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">{product.fornecedor}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-blue-600">📊</span>
                    <span>Relatório de vendas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-green-600">📦</span>
                    <span>Histórico de estoque</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-purple-600">📋</span>
                    <span>Editar produto</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <span className="text-orange-600">🔄</span>
                    <span>Movimentar estoque</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Informações Comerciais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Comerciais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Preço:</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {product.preco.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Estoque:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{product.estoque} un.</span>
                      <Badge variant={getEstoqueColor(product.estoque)}>
                        {getEstoqueStatus(product.estoque)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Indicadores de Performance */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-3">Indicadores de Performance</h4>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor Total:</span>
                      <div className="font-medium">
                        R$ {(product.preco * product.estoque).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2
                        })}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <div>
                        <Badge variant={getStatusColor(product.status)} className="text-xs">
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo de Giro:</span>
                      <div className="font-medium">
                        {product.estoque > 50 ? "Alto Giro" :
                         product.estoque > 20 ? "Médio Giro" : "Baixo Giro"}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prioridade:</span>
                      <div className="font-medium">
                        {product.estoque === 0 ? "Crítica" :
                         product.estoque < 10 ? "Alta" : "Normal"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Movimentações Recentes (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Movimentações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">↗️</span>
                      <span className="text-sm">Entrada - Compra #001</span>
                    </div>
                    <span className="text-sm text-muted-foreground">+10 un.</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">↘️</span>
                      <span className="text-sm">Saída - Venda #123</span>
                    </div>
                    <span className="text-sm text-muted-foreground">-2 un.</span>
                  </div>
                  <div className="text-center text-sm text-muted-foreground pt-2">
                    <button className="text-blue-600 hover:underline">
                      Ver histórico completo
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dados de Criação (rodapé) */}
        {(product.dataCriacao || product.dataAtualizacao) && (
          <>
            <Separator />
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              {product.dataCriacao && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Criado em: {new Date(product.dataCriacao).toLocaleDateString('pt-BR')}
                </div>
              )}
              {product.dataAtualizacao && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Atualizado em: {new Date(product.dataAtualizacao).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
