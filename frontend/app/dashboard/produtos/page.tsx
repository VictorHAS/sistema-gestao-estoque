"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Package, DollarSign, TrendingUp } from "lucide-react"
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
import { ProductDialog } from "@/components/forms/produtos/product-dialog"
import { ProductDetailsDialog } from "@/components/forms/produtos/product-details-dialog"
import { DeleteProductDialog } from "@/components/forms/produtos/delete-product-dialog"

// Mock data - in a real app, this would come from your API
const initialProdutos = [
  {
    id: "1",
    nome: "Notebook Dell Inspiron",
    descricao: "Notebook para uso corporativo com processador Intel Core i5",
    codigo: "NB001",
    categoria: "Informática",
    categoriaId: "1",
    preco: 2599.99,
    estoque: 15,
    fornecedor: "Dell Brasil, HP Brasil",
    fornecedorId: "1",
    fornecedorIds: ["1", "6"],
    status: "Ativo",
    dataCriacao: "2025-01-01",
    dataAtualizacao: "2025-01-15"
  },
  {
    id: "2",
    nome: "Mouse Logitech MX",
    descricao: "Mouse sem fio com sensor óptico de alta precisão",
    codigo: "MS002",
    categoria: "Periféricos",
    categoriaId: "2",
    preco: 299.90,
    estoque: 45,
    fornecedor: "Logitech",
    fornecedorId: "2",
    fornecedorIds: ["2"],
    status: "Ativo",
    dataCriacao: "2025-01-02",
    dataAtualizacao: "2025-01-10"
  },
  {
    id: "3",
    nome: "Teclado Mecânico RGB",
    descricao: "Teclado gamer com switches mecânicos e iluminação RGB",
    codigo: "KB003",
    categoria: "Periféricos",
    categoriaId: "2",
    preco: 189.90,
    estoque: 8,
    fornecedor: "Razer",
    fornecedorId: "3",
    fornecedorIds: ["3"],
    status: "Baixo Estoque",
    dataCriacao: "2025-01-03",
    dataAtualizacao: "2025-01-12"
  },
  {
    id: "4",
    nome: "Monitor Samsung 24''",
    descricao: "Monitor LED Full HD 24 polegadas",
    codigo: "MN004",
    categoria: "Monitores",
    categoriaId: "3",
    preco: 899.00,
    estoque: 0,
    fornecedor: "Samsung, TechCorp",
    fornecedorId: "4",
    fornecedorIds: ["4", "5"],
    status: "Sem Estoque",
    dataCriacao: "2025-01-04",
    dataAtualizacao: "2025-01-08"
  },
  {
    id: "5",
    nome: "Cabo HDMI 2m",
    descricao: "Cabo HDMI 2.0 de alta velocidade",
    codigo: "CB005",
    categoria: "Cabos",
    categoriaId: "4",
    preco: 29.90,
    estoque: 120,
    fornecedor: "TechCorp, Dell Brasil, HP Brasil",
    fornecedorId: "5",
    fornecedorIds: ["5", "1", "6"],
    status: "Ativo",
    dataCriacao: "2025-01-05",
    dataAtualizacao: "2025-01-06"
  },
  {
    id: "6",
    nome: "Produto Sem Estoque",
    descricao: "Produto de teste para validar exclusão",
    codigo: "TST001",
    categoria: "Acessórios",
    categoriaId: "5",
    preco: 19.90,
    estoque: 0,
    fornecedor: "TechCorp",
    fornecedorId: "5",
    fornecedorIds: ["5"],
    status: "Sem Estoque",
    dataCriacao: "2025-01-06",
    dataAtualizacao: "2025-01-07"
  },
]

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

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState(initialProdutos)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("TODAS")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof initialProdutos[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFilter === "TODAS" || produto.categoria === categoriaFilter
    const matchesStatus = statusFilter === "TODOS" || produto.status === statusFilter
    return matchesSearch && matchesCategoria && matchesStatus
  })

  const getStatusBadge = (status: string, estoque: number) => {
    if (estoque === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    } else if (estoque < 10) {
      return <Badge variant="secondary">Baixo Estoque</Badge>
    }
    return <Badge variant="default">Ativo</Badge>
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: typeof initialProdutos[0]) => {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleViewProduct = (product: typeof initialProdutos[0]) => {
    setSelectedProduct(product)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteProduct = (product: typeof initialProdutos[0]) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleProductSubmit = async (data: {
    nome: string;
    descricao?: string;
    codigo: string;
    preco: number;
    categoriaId: string;
    fornecedorIds: string[];
  }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Map categoria ID to name (in real app, this would come from API)
      const categoriaMap: Record<string, string> = {
        "1": "Informática",
        "2": "Periféricos",
        "3": "Monitores",
        "4": "Cabos",
        "5": "Acessórios",
      }

      // Convert fornecedor IDs to names
      const fornecedorNomes = data.fornecedorIds
        .map(id => fornecedoresMap[id as keyof typeof fornecedoresMap])
        .filter(Boolean)
        .join(", ")

      if (selectedProduct) {
        // Update existing product
        setProdutos(prev => prev.map(produto =>
          produto.id === selectedProduct.id
            ? {
                ...produto,
                ...data,
                categoria: categoriaMap[data.categoriaId] || produto.categoria,
                fornecedor: fornecedorNomes,
                dataAtualizacao: new Date().toISOString()
              }
            : produto
        ))
        toast.success("Produto atualizado", {
          description: "As informações do produto foram atualizadas com sucesso.",
        })
      } else {
        // Create new product
        const newProduct = {
          id: Date.now().toString(),
          ...data,
          descricao: data.descricao || "",
          categoria: categoriaMap[data.categoriaId] || "Outros",
          fornecedor: fornecedorNomes || "A definir",
          fornecedorId: data.fornecedorIds[0] || "1",
          estoque: 0,
          status: "Ativo",
          dataCriacao: new Date().toISOString(),
          dataAtualizacao: new Date().toISOString()
        }
        setProdutos(prev => [...prev, newProduct])
        toast.success("Produto criado", {
          description: "O novo produto foi criado com sucesso.",
        })
      }
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar o produto.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async (productId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setProdutos(prev => prev.filter(produto => produto.id !== productId))
      toast.success("Produto excluído", {
        description: "O produto foi excluído com sucesso.",
      })
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao excluir o produto.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Statistics calculations
  const totalProdutos = produtos.length
  const valorTotalEstoque = produtos.reduce((acc, produto) => acc + (produto.preco * produto.estoque), 0)
  const produtosSemEstoque = produtos.filter(p => p.estoque === 0).length
  const produtosBaixoEstoque = produtos.filter(p => p.estoque > 0 && p.estoque < 10).length
  const precoMedio = produtos.length > 0 ? produtos.reduce((acc, produto) => acc + produto.preco, 0) / produtos.length : 0

  // Categories for filter
  const categorias = [...new Set(produtos.map(p => p.categoria))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        <Button onClick={handleCreateProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
            <p className="text-xs text-muted-foreground">
              {produtosSemEstoque} sem estoque, {produtosBaixoEstoque} baixo estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor dos produtos em estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {precoMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Preço médio dos produtos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {produtos.reduce((acc, produto) => acc + produto.estoque, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de unidades disponíveis
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os produtos do seu estoque
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="TODAS">Todas as Categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Baixo Estoque">Baixo Estoque</option>
              <option value="Sem Estoque">Sem Estoque</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium font-mono text-sm bg-muted/30 rounded px-2 py-1">
                    {produto.codigo}
                  </TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{produto.categoria}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <span className={produto.estoque === 0 ? "text-destructive font-medium" :
                                   produto.estoque < 10 ? "text-amber-600 font-medium" : ""}>
                      {produto.estoque} un.
                    </span>
                  </TableCell>
                  <TableCell>{produto.fornecedor}</TableCell>
                  <TableCell>
                    {getStatusBadge(produto.status, produto.estoque)}
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
                        <DropdownMenuItem onClick={() => handleViewProduct(produto)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProduct(produto)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteProduct(produto)}
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
        product={selectedProduct}
        onSubmit={handleProductSubmit}
        isLoading={isLoading}
      />

      <ProductDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        product={selectedProduct}
      />

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={selectedProduct}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
