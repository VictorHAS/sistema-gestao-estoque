"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Package, DollarSign, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ProductDialog } from "@/components/forms/produtos/product-dialog"

// Import React Query hooks
import { useProdutos, useCreateProduto, useUpdateProduto, useDeleteProduto } from "@/hooks/queries/useProdutos"
import { useCategorias } from "@/hooks/queries/useCategorias"
import type { Produto, Categoria } from "@/lib/api/types"

// Stats Card Component
function StatsCards() {
  const { data: produtos = [], isLoading: produtosLoading } = useProdutos()
  const { data: categorias = [], isLoading: categoriasLoading } = useCategorias()

  if (produtosLoading || categoriasLoading) {
    return <StatsCardsSkeleton />
  }

  const totalProdutos = produtos.length
  const totalValue = produtos.reduce((acc, produto) => acc + produto.preco, 0)
  const totalCategorias = (categorias as Categoria[]).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProdutos}</div>
          <p className="text-xs text-muted-foreground">
            produtos cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            valor do catálogo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorias</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCategorias}</div>
          <p className="text-xs text-muted-foreground">
            categorias disponíveis
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ProdutosClient() {
  // React Query hooks
  const { data: produtos = [], isLoading, error } = useProdutos()
  const { data: categorias = [] } = useCategorias()
  const createMutation = useCreateProduto()
  const updateMutation = useUpdateProduto()
  const deleteMutation = useDeleteProduto()

  // Local state
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("TODAS")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)

  // Create map for displaying category names
  const categoriasTyped = categorias as Categoria[]
  const categoriasMap = categoriasTyped.reduce((acc: Record<string, string>, cat: Categoria) => ({
    ...acc,
    [cat.id]: cat.nome
  }), {})

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         categoriasMap[produto.categoriaId]?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFilter === "TODAS" || produto.categoriaId === categoriaFilter
    return matchesSearch && matchesCategoria
  })

  const getStatusBadge = () => {
    return <Badge variant="default">Ativo</Badge>
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: Produto) => {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleViewProduct = (product: Produto) => {
    // TODO: Implement view functionality when dialog is fixed
    console.log("View product:", product)
  }

  const handleDeleteProduct = (product: Produto) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${product.nome}"?`)) {
      deleteMutation.mutate(product.id)
    }
  }

  const handleProductSubmit = async (data: {
    nome: string;
    descricao?: string;
    codigo: string;
    preco: number;
    categoriaId: string;
    fornecedorIds: string[];
  }) => {
    try {
      if (selectedProduct) {
        // Update existing product
        await updateMutation.mutateAsync({ id: selectedProduct.id, data })
      } else {
        // Create new product
        await createMutation.mutateAsync(data)
      }

      setIsProductDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("Product submit error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive">Erro ao carregar produtos: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreateProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="TODAS">Todas as Categorias</option>
              {categoriasTyped.map((categoria: Categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            {filteredProdutos.length} produto(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.codigo}</TableCell>
                  <TableCell>{categoriasMap[produto.categoriaId] || 'Categoria não encontrada'}</TableCell>
                  <TableCell>
                    R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{getStatusBadge()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewProduct(produto)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProduct(produto)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(produto)}
                          className="text-destructive"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProdutos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto encontrado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProductDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        onSubmit={handleProductSubmit}
        product={selectedProduct}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

// Export StatsCards for use in the server component
export { StatsCards }
