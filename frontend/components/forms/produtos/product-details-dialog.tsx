"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProduto } from "@/hooks/queries/useProdutos"
import { Loader2, Package, DollarSign, Hash, Tag, Building2 } from "lucide-react"

interface ProductDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string | null
}

export function ProductDetailsDialog({
  open,
  onOpenChange,
  productId
}: ProductDetailsDialogProps) {
  const { data: produto, isLoading, error } = useProduto(productId || "")

  if (!productId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalhes do Produto
          </DialogTitle>
          <DialogDescription>
            Informações completas do produto selecionado
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando detalhes...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">Erro ao carregar produto: {error.message}</p>
          </div>
        )}

        {produto && (
          <div className="space-y-6">
            {/* Header com Nome e Status */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{produto.nome}</h3>
                {produto.descricao && (
                  <p className="text-muted-foreground mt-1">{produto.descricao}</p>
                )}
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>

            <Separator />

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Identificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Código
                    </label>
                    <p className="text-sm">{produto.codigo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      ID
                    </label>
                    <p className="text-xs font-mono text-muted-foreground">
                      {produto.id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Preço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    R$ {produto.preco.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Preço unitário
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Categoria */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                {produto.categoria ? (
                  <div>
                    <p className="font-medium">{produto.categoria.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      Criada em {new Date(produto.categoria.dataCriacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Categoria não encontrada</p>
                )}
              </CardContent>
            </Card>

            {/* Fornecedores */}
            {produto.fornecedores && produto.fornecedores.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Fornecedores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {produto.fornecedores.map((produtoFornecedor) => (
                      <div
                        key={produtoFornecedor.fornecedor.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {produtoFornecedor.fornecedor.nome}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {produtoFornecedor.fornecedor.email}
                          </p>
                          {produtoFornecedor.fornecedor.telefone && (
                            <p className="text-sm text-muted-foreground">
                              {produtoFornecedor.fornecedor.telefone}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Datas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informações de Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Data de Criação
                  </label>
                  <p className="text-sm">
                    {new Date(produto.dataCriacao).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Última Atualização
                  </label>
                  <p className="text-sm">
                    {new Date(produto.dataAtualizacao).toLocaleString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
