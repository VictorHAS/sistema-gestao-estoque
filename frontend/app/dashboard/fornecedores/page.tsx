"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Mail, Phone, Building } from "lucide-react"
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
import { SupplierDialog } from "@/components/forms/fornecedor/supplier-dialog"
import { SupplierDetailsDialog } from "@/components/forms/fornecedor/supplier-details-dialog"
import { DeleteSupplierDialog } from "@/components/forms/fornecedor/delete-supplier-dialog"

// Mock data - in a real app, this would come from your API
const initialFornecedores = [
  {
    id: "1",
    nome: "Dell Brasil Ltda",
    email: "comercial@dell.com.br",
    telefone: "(11) 3456-7890",
    endereco: "São Paulo, SP",
    produtosAtivos: 15,
    ultimaCompra: "2025-01-15",
    status: "Ativo"
  },
  {
    id: "2",
    nome: "Logitech do Brasil",
    email: "vendas@logitech.com.br",
    telefone: "(11) 2345-6789",
    endereco: "Rio de Janeiro, RJ",
    produtosAtivos: 28,
    ultimaCompra: "2025-01-20",
    status: "Ativo"
  },
  {
    id: "3",
    nome: "Razer Inc",
    email: "sales@razer.com",
    telefone: "+1 (555) 123-4567",
    endereco: "Irvine, CA - USA",
    produtosAtivos: 12,
    ultimaCompra: "2025-01-10",
    status: "Ativo"
  },
  {
    id: "4",
    nome: "Samsung Electronics",
    email: "b2b@samsung.com.br",
    telefone: "(11) 4567-8901",
    endereco: "Campinas, SP",
    produtosAtivos: 35,
    ultimaCompra: "2025-01-25",
    status: "Ativo"
  },
  {
    id: "5",
    nome: "TechCorp Distribuidora",
    email: "contato@techcorp.com.br",
    telefone: "(11) 5678-9012",
    endereco: "Belo Horizonte, MG",
    produtosAtivos: 8,
    ultimaCompra: "2023-12-15",
    status: "Inativo"
  },
  {
    id: "6",
    nome: "Fornecedor Sem Produtos",
    email: "teste@fornecedor.com",
    telefone: "(11) 9999-9999",
    endereco: "Cidade, Estado",
    produtosAtivos: 0,
    ultimaCompra: "2024-06-01",
    status: "Ativo"
  },
]

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState(initialFornecedores)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<typeof initialFornecedores[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredFornecedores = fornecedores.filter(fornecedor => {
    const matchesSearch = fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.endereco.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "TODOS" || fornecedor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    return status === "Ativo"
      ? <Badge variant="default">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>
  }

  const handleCreateSupplier = () => {
    setSelectedSupplier(null)
    setIsSupplierDialogOpen(true)
  }

  const handleEditSupplier = (supplier: typeof initialFornecedores[0]) => {
    setSelectedSupplier(supplier)
    setIsSupplierDialogOpen(true)
  }

  const handleViewSupplier = (supplier: typeof initialFornecedores[0]) => {
    setSelectedSupplier(supplier)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteSupplier = (supplier: typeof initialFornecedores[0]) => {
    setSelectedSupplier(supplier)
    setIsDeleteDialogOpen(true)
  }

  const handleSupplierSubmit = async (data: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
  }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (selectedSupplier) {
        // Update existing supplier
        setFornecedores(prev => prev.map(fornecedor =>
          fornecedor.id === selectedSupplier.id
            ? { ...fornecedor, ...data }
            : fornecedor
        ))
        toast.success("Fornecedor atualizado", {
          description: "As informações do fornecedor foram atualizadas com sucesso.",
        })
      } else {
        // Create new supplier
        const newSupplier = {
          id: Date.now().toString(),
          ...data,
          produtosAtivos: 0,
          ultimaCompra: new Date().toISOString(),
          status: "Ativo"
        }
        setFornecedores(prev => [...prev, newSupplier])
        toast.success("Fornecedor criado", {
          description: "O novo fornecedor foi criado com sucesso.",
        })
      }
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar o fornecedor.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async (supplierId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setFornecedores(prev => prev.filter(fornecedor => fornecedor.id !== supplierId))
      toast.success("Fornecedor excluído", {
        description: "O fornecedor foi excluído com sucesso.",
      })
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao excluir o fornecedor.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalProdutos = fornecedores.reduce((acc, fornecedor) => acc + fornecedor.produtosAtivos, 0)
  const fornecedoresAtivos = fornecedores.filter(f => f.status === "Ativo").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie seus fornecedores e parcerias
          </p>
        </div>
        <Button onClick={handleCreateSupplier}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fornecedores.length}</div>
            <p className="text-xs text-muted-foreground">
              {fornecedoresAtivos} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Fornecidos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
            <p className="text-xs text-muted-foreground">
              Entre todos os fornecedores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Fornecedor</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fornecedores.length > 0 ? Math.round(totalProdutos / fornecedores.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              produtos por fornecedor
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os seus fornecedores
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar fornecedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Produtos Ativos</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {fornecedor.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-1 h-3 w-3" />
                        {fornecedor.telefone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{fornecedor.endereco}</TableCell>
                  <TableCell>
                    <Badge variant={fornecedor.produtosAtivos === 0 ? "secondary" : "outline"}>
                      {fornecedor.produtosAtivos} produto{fornecedor.produtosAtivos !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(fornecedor.ultimaCompra).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(fornecedor.status)}
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
                        <DropdownMenuItem onClick={() => handleViewSupplier(fornecedor)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditSupplier(fornecedor)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteSupplier(fornecedor)}
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

          {filteredFornecedores.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum fornecedor encontrado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <SupplierDialog
        open={isSupplierDialogOpen}
        onOpenChange={setIsSupplierDialogOpen}
        supplier={selectedSupplier}
        onSubmit={handleSupplierSubmit}
        isLoading={isLoading}
      />

      <SupplierDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        supplier={selectedSupplier}
      />

      <DeleteSupplierDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        supplier={selectedSupplier}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
