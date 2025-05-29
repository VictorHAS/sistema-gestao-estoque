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

// Mock data - in a real app, this would come from your API
const initialCategorias = [
  {
    id: "1",
    nome: "Informática",
    totalProdutos: 45,
    dataCriacao: "2025-01-15",
  },
  {
    id: "2",
    nome: "Periféricos",
    totalProdutos: 67,
    dataCriacao: "2025-01-10",
  },
  {
    id: "3",
    nome: "Monitores",
    totalProdutos: 23,
    dataCriacao: "2025-01-08",
  },
  {
    id: "4",
    nome: "Cabos",
    totalProdutos: 156,
    dataCriacao: "2025-01-05",
  },
  {
    id: "5",
    nome: "Acessórios",
    totalProdutos: 89,
    dataCriacao: "2025-01-03",
  },
  {
    id: "6",
    nome: "Categoria Vazia",
    totalProdutos: 0,
    dataCriacao: "2025-01-20",
  },
]

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState(initialCategorias)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<typeof initialCategorias[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalProdutosCategorias = categorias.reduce((acc, cat) => acc + cat.totalProdutos, 0)

  const handleCreateCategory = () => {
    setSelectedCategory(null)
    setIsCategoryDialogOpen(true)
  }

  const handleEditCategory = (category: typeof initialCategorias[0]) => {
    setSelectedCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = (category: typeof initialCategorias[0]) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleCategorySubmit = async (data: { nome: string }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (selectedCategory) {
        // Update existing category
        setCategorias(prev => prev.map(cat =>
          cat.id === selectedCategory.id
            ? { ...cat, ...data }
            : cat
        ))
        toast.success("Categoria atualizada", {
          description: "A categoria foi atualizada com sucesso.",
        })
      } else {
        // Create new category
        const newCategory = {
          id: Date.now().toString(),
          ...data,
          totalProdutos: 0,
          dataCriacao: new Date().toISOString(),
        }
        setCategorias(prev => [...prev, newCategory])
        toast.success("Categoria criada", {
          description: "A nova categoria foi criada com sucesso.",
        })
      }
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar a categoria.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async (categoryId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setCategorias(prev => prev.filter(cat => cat.id !== categoryId))
      toast.success("Categoria excluída", {
        description: "A categoria foi excluída com sucesso.",
      })
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao excluir a categoria.",
      })
    } finally {
      setIsLoading(false)
    }
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
              {categorias.filter(cat => cat.totalProdutos === 0).length} categorias vazias
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
              produtos por categoria
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>
            Gerencie as categorias dos seus produtos
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Categoria</TableHead>
                <TableHead>Total de Produtos</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{categoria.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={categoria.totalProdutos === 0 ? "secondary" : "outline"}
                    >
                      {categoria.totalProdutos} produto{categoria.totalProdutos !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(categoria.dataCriacao).toLocaleDateString('pt-BR')}
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
                          className="text-destructive"
                          onClick={() => handleDeleteCategory(categoria)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
        isLoading={isLoading}
      />

      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={selectedCategory}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
