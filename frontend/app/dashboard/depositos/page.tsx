"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Warehouse, Package, MapPin, BarChart3 } from "lucide-react"
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
import { PermissionGuard } from "@/components/permission-guard"
import { DepositoDialog } from "@/components/forms/deposito/deposito-dialog"
import { DepositoDetailsDialog } from "@/components/forms/deposito/deposito-details-dialog"
import { DeleteDepositoDialog } from "@/components/forms/deposito/delete-deposito-dialog"

// Mock data - in a real app, this would come from your API
const initialDepositos = [
  {
    id: "1",
    nome: "Depósito Central",
    localizacao: "Rua das Indústrias, 123 - Zona Industrial, São Paulo - SP, 01234-567",
    dataCriacao: "2025-01-01T08:00:00",
    estoque: [
      {
        id: "1",
        produto: "Notebook Dell Inspiron 15",
        codigo: "NB001",
        quantidade: 25
      },
      {
        id: "2",
        produto: "Mouse Logitech MX Master 3",
        codigo: "MS001",
        quantidade: 45
      },
      {
        id: "3",
        produto: "Teclado Razer BlackWidow V3",
        codigo: "TC001",
        quantidade: 18
      },
      {
        id: "4",
        produto: "Monitor Samsung 24\"",
        codigo: "MT001",
        quantidade: 12
      }
    ]
  },
  {
    id: "2",
    nome: "Filial Norte",
    localizacao: "Av. Paulista, 456 - Bela Vista, São Paulo - SP, 05678-901",
    dataCriacao: "2025-01-05T10:30:00",
    estoque: [
      {
        id: "1",
        produto: "Notebook Dell Inspiron 15",
        codigo: "NB001",
        quantidade: 8
      },
      {
        id: "5",
        produto: "Cabo HDMI 2m",
        codigo: "CB001",
        quantidade: 50
      }
    ]
  },
  {
    id: "3",
    nome: "Loja Centro",
    localizacao: "Rua Augusta, 789 - Centro, São Paulo - SP, 01234-123",
    dataCriacao: "2025-01-10T14:15:00",
    estoque: [
      {
        id: "2",
        produto: "Mouse Logitech MX Master 3",
        codigo: "MS001",
        quantidade: 15
      },
      {
        id: "3",
        produto: "Teclado Razer BlackWidow V3",
        codigo: "TC001",
        quantidade: 5
      }
    ]
  },
  {
    id: "4",
    nome: "Depósito Sul",
    localizacao: "Rua das Flores, 321 - Vila Olímpia, São Paulo - SP, 09876-543",
    dataCriacao: "2025-01-15T16:45:00",
    estoque: []
  }
]

export default function DepositosPage() {
  const [depositos, setDepositos] = useState(initialDepositos)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDepositoDialogOpen, setIsDepositoDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDeposito, setSelectedDeposito] = useState<typeof initialDepositos[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredDepositos = depositos.filter(deposito =>
    deposito.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposito.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculando estatísticas
  const totalDepositos = depositos.length
  const depositosComEstoque = depositos.filter(d => d.estoque.length > 0).length
  const totalProdutos = depositos.reduce((acc, d) => {
    const produtosUnicos = new Set(d.estoque.map(e => e.id))
    return acc + produtosUnicos.size
  }, 0)
  const totalUnidades = depositos.reduce((acc, d) =>
    acc + d.estoque.reduce((subAcc, e) => subAcc + e.quantidade, 0), 0
  )

  const getEstoqueTotal = (deposito: typeof initialDepositos[0]) => {
    return deposito.estoque.reduce((acc, item) => acc + item.quantidade, 0)
  }

  const getEstoqueBaixo = (deposito: typeof initialDepositos[0]) => {
    return deposito.estoque.filter(item => item.quantidade < 10).length
  }

  const handleCreateDeposito = () => {
    setSelectedDeposito(null)
    setIsDepositoDialogOpen(true)
  }

  const handleEditDeposito = (deposito: typeof initialDepositos[0]) => {
    setSelectedDeposito(deposito)
    setIsDepositoDialogOpen(true)
  }

  const handleViewDeposito = (deposito: typeof initialDepositos[0]) => {
    setSelectedDeposito(deposito)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteDeposito = (deposito: typeof initialDepositos[0]) => {
    setSelectedDeposito(deposito)
    setIsDeleteDialogOpen(true)
  }

  const handleDepositoSubmit = async (data: { nome: string; localizacao: string }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (selectedDeposito) {
        // Update existing deposito
        setDepositos(prev => prev.map(deposito =>
          deposito.id === selectedDeposito.id
            ? { ...deposito, ...data }
            : deposito
        ))
        toast.success("Depósito atualizado", {
          description: "As informações do depósito foram atualizadas com sucesso.",
        })
      } else {
        // Create new deposito
        const newDeposito = {
          id: Date.now().toString(),
          ...data,
          dataCriacao: new Date().toISOString(),
          estoque: []
        }
        setDepositos(prev => [newDeposito, ...prev])
        toast.success("Depósito criado", {
          description: "O novo depósito foi criado com sucesso.",
        })
      }
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar o depósito.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async (depositoId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setDepositos(prev => prev.filter(deposito => deposito.id !== depositoId))
      toast.success("Depósito excluído", {
        description: "O depósito foi excluído com sucesso.",
      })
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao excluir o depósito.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Depósitos</h1>
          <p className="text-muted-foreground">
            Gerencie depósitos e localizações de estoque
          </p>
        </div>
        <PermissionGuard permission="depositos:create">
          <Button onClick={handleCreateDeposito}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Depósito
          </Button>
        </PermissionGuard>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Depósitos</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepositos}</div>
            <p className="text-xs text-muted-foreground">
              localizações cadastradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Estoque</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{depositosComEstoque}</div>
            <p className="text-xs text-muted-foreground">
              depósitos ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Únicos</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalProdutos}</div>
            <p className="text-xs text-muted-foreground">
              produtos distribuídos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unidades</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalUnidades}</div>
            <p className="text-xs text-muted-foreground">
              em todos depósitos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Depósitos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os depósitos e suas localizações
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar depósitos..."
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
                <TableHead>Nome</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Estoque Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepositos.map((deposito) => (
                <TableRow key={deposito.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{deposito.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-xs">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate" title={deposito.localizacao}>
                        {deposito.localizacao}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{deposito.estoque.length}</span>
                    <span className="text-sm text-muted-foreground ml-1">produto(s)</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-blue-600">
                      {getEstoqueTotal(deposito)} un.
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {deposito.estoque.length > 0 ? (
                        <Badge variant="default">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Vazio</Badge>
                      )}
                      {getEstoqueBaixo(deposito) > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {getEstoqueBaixo(deposito)} baixo
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(deposito.dataCriacao).toLocaleDateString('pt-BR')}
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
                        <DropdownMenuItem onClick={() => handleViewDeposito(deposito)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <PermissionGuard permission="depositos:update">
                          <DropdownMenuItem onClick={() => handleEditDeposito(deposito)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission="depositos:delete">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteDeposito(deposito)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDepositos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum depósito encontrado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DepositoDialog
        open={isDepositoDialogOpen}
        onOpenChange={setIsDepositoDialogOpen}
        deposito={selectedDeposito}
        onSubmit={handleDepositoSubmit}
        isLoading={isLoading}
      />

      <DepositoDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        deposito={selectedDeposito}
      />

      <DeleteDepositoDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        deposito={selectedDeposito}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
