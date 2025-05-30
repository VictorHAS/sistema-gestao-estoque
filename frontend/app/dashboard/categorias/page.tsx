"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag } from "lucide-react"
import { toast } from "sonner"

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
import { CategoryDialog } from "@/components/forms/categoria/category-dialog"
import { DeleteCategoryDialog } from "@/components/forms/categoria/delete-category-dialog"

// Import real hooks
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from "@/hooks/queries/useCategorias"
import { useProdutos } from "@/hooks/queries/useProdutos"
import type { Categoria, Produto } from "@/lib/api/types"

export default function CategoriasPage() {
  // Use real hooks instead of mock data
  const { data: categorias = [], isLoading, error } = useCategorias()
  const { data: produtos = [] } = useProdutos()

  // Mutation hooks
  const createCategoriaMutation = useCreateCategoria()
  const updateCategoriaMutation = useUpdateCategoria()
  const deleteCategoriaMutation = useDeleteCategoria()

  const [searchTerm, setSearchTerm] = useState("")
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredCategorias = categorias.filter((categoria: Categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate products per category
  const getCategoryProductCount = (categoriaId: string) => {
    return produtos.filter((produto: Produto) => produto.categoriaId === categoriaId).length
  }

  const totalProdutosCategorias = categorias.reduce((acc: number, cat: Categoria) =>
    acc + getCategoryProductCount(cat.id), 0
  )

  const handleCreateCategory = () => {
    setSelectedCategory(null)
    setIsCategoryDialogOpen(true)
  }

  const handleEditCategory = (category: Categoria) => {
    setSelectedCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = (category: Categoria) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleCategorySubmit = async (data: { nome: string }) => {
    try {
      setIsSubmitting(true)

      if (selectedCategory) {
        // Update existing category
        await updateCategoriaMutation.mutateAsync({ id: selectedCategory.id, data })
        toast.success("Categoria atualizada com sucesso!")
      } else {
        // Create new category
        await createCategoriaMutation.mutateAsync(data)
        toast.success("Categoria criada com sucesso!")
      }

      setIsCategoryDialogOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      toast.error(selectedCategory ? "Erro ao atualizar categoria" : "Erro ao criar categoria")
      console.error("Category submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return

    try {
      setIsSubmitting(true)
      await deleteCategoriaMutation.mutateAsync(selectedCategory.id)
      toast.success("Categoria excluída com sucesso!")
      setIsDeleteDialogOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      toast.error("Erro ao excluir categoria")
      console.error("Delete category error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando categorias...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive">Erro ao carregar categorias: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Organize seus produtos por categorias
          </p>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias.length}</div>
            <p className="text-xs text-muted-foreground">
              {categorias.filter(cat => getCategoryProductCount(cat.id) === 0).length} categorias vazias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutosCategorias}</div>
            <p className="text-xs text-muted-foreground">
              Distribuídos entre as categorias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Categoria</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categorias.length > 0 ? Math.round(totalProdutosCategorias / categorias.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Produtos por categoria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>
            {filteredCategorias.length} categoria(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => {
                const productCount = getCategoryProductCount(categoria.id)
                return (
                  <TableRow key={categoria.id}>
                    <TableCell className="font-medium">{categoria.nome}</TableCell>
                    <TableCell>{productCount} produtos</TableCell>
                    <TableCell>
                      {new Date(categoria.dataCriacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {productCount === 0 ? (
                        <Badge variant="secondary">Vazia</Badge>
                      ) : (
                        <Badge variant="default">Ativa</Badge>
                      )}
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditCategory(categoria)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(categoria)}
                            className="text-destructive"
                            disabled={productCount > 0}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredCategorias.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma categoria encontrada.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        category={selectedCategory}
        onSubmit={handleCategorySubmit}
        isLoading={isSubmitting}
      />

      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={selectedCategory}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        productCount={selectedCategory ? getCategoryProductCount(selectedCategory.id) : 0}
      />
    </div>
  )
}
