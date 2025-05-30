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

// Import real hooks
import { useFornecedores, useCreateFornecedor, useUpdateFornecedor, useDeleteFornecedor } from "@/hooks/queries/useFornecedores"
import type { Fornecedor, Supplier } from "@/lib/api/types"

export default function FornecedoresPage() {
  // Use real hooks instead of mock data
  const { data: fornecedores = [], isLoading, error } = useFornecedores()

  // Mutation hooks
  const createFornecedorMutation = useCreateFornecedor()
  const updateFornecedorMutation = useUpdateFornecedor()
  const deleteFornecedorMutation = useDeleteFornecedor()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Fornecedor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredFornecedores = fornecedores.filter((fornecedor: Fornecedor) =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = () => {
    return <Badge variant="default">Ativo</Badge>
  }

  const handleCreateSupplier = () => {
    setSelectedSupplier(null)
    setIsSupplierDialogOpen(true)
  }

  const handleEditSupplier = (supplier: Fornecedor) => {
    setSelectedSupplier(supplier)
    setIsSupplierDialogOpen(true)
  }

  const handleViewSupplier = (supplier: Fornecedor) => {
    setSelectedSupplier(supplier)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteSupplier = (supplier: Fornecedor) => {
    setSelectedSupplier(supplier)
    setIsDeleteDialogOpen(true)
  }

  const handleSupplierSubmit = async (data: {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: string;
  }) => {
    try {
      setIsSubmitting(true)

      if (selectedSupplier) {
        // Update existing supplier
        await updateFornecedorMutation.mutateAsync({ id: selectedSupplier.id, data })
        toast.success("Fornecedor atualizado com sucesso!")
      } else {
        // Create new supplier
        await createFornecedorMutation.mutateAsync(data)
        toast.success("Fornecedor criado com sucesso!")
      }

      setIsSupplierDialogOpen(false)
      setSelectedSupplier(null)
    } catch (error) {
      toast.error(selectedSupplier ? "Erro ao atualizar fornecedor" : "Erro ao criar fornecedor")
      console.error("Supplier submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSupplier) return

    try {
      setIsSubmitting(true)
      await deleteFornecedorMutation.mutateAsync(selectedSupplier.id)
      toast.success("Fornecedor excluído com sucesso!")
      setIsDeleteDialogOpen(false)
      setSelectedSupplier(null)
    } catch (error) {
      toast.error("Erro ao excluir fornecedor")
      console.error("Delete supplier error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to convert Fornecedor to Supplier for components that expect Supplier
  const convertToSupplier = (fornecedor: Fornecedor): Supplier => ({
    ...fornecedor,
    produtosAtivos: fornecedor.produtos?.length || 0,
    ultimaCompra: undefined,
    status: 'ATIVO' as const,
    dataAtualizacao: fornecedor.dataAtualizacao || fornecedor.dataCriacao
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando fornecedores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive">Erro ao carregar fornecedores: {error.message || 'Erro desconhecido'}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const totalFornecedores = fornecedores.length
  const fornecedoresAtivos = fornecedores.length // All are active

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie sua rede de fornecedores e parceiros
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
            <div className="text-2xl font-bold">{totalFornecedores}</div>
            <p className="text-xs text-muted-foreground">
              fornecedores cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores Ativos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fornecedoresAtivos}</div>
            <p className="text-xs text-muted-foreground">
              100% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fornecedores.filter(f =>
                new Date(f.dataCriacao).getMonth() === new Date().getMonth() &&
                new Date(f.dataCriacao).getFullYear() === new Date().getFullYear()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              cadastrados recentemente
            </p>
          </CardContent>
        </Card>
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
                  placeholder="Buscar fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="Ativo">Ativos</option>
              <option value="Inativo">Inativos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>
            {filteredFornecedores.length} fornecedor(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                  <TableCell>
                    {fornecedor.email ? (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{fornecedor.email}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {fornecedor.telefone ? (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{fornecedor.telefone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{fornecedor.endereco || '-'}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewSupplier(fornecedor)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditSupplier(fornecedor)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteSupplier(fornecedor)}
                          className="text-destructive"
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
        supplier={selectedSupplier ? convertToSupplier(selectedSupplier) : null}
        onSubmit={handleSupplierSubmit}
        isLoading={isSubmitting}
      />

      {selectedSupplier && (
        <>
          <SupplierDetailsDialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
            supplier={selectedSupplier}
          />

          <DeleteSupplierDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            supplier={convertToSupplier(selectedSupplier)}
            onConfirm={handleDeleteConfirm}
            isLoading={isSubmitting}
          />
        </>
      )}
    </div>
  )
}
