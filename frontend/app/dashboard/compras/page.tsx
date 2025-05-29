"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, ShoppingBag, DollarSign, Clock, TrendingUp } from "lucide-react"
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
import { CompraDialog } from "@/components/forms/compra/compra-dialog"
import { CompraDetailsDialog } from "@/components/forms/compra/compra-details-dialog"
import { DeleteCompraDialog } from "@/components/forms/compra/delete-compra-dialog"

// Mock data - in a real app, this would come from your API
const initialCompras = [
  {
    id: "1",
    fornecedorId: "1",
    fornecedor: "TechDistribuidor Ltda",
    fornecedorEmail: "compras@techdist.com",
    fornecedorTelefone: "(11) 3333-1111",
    itens: [
      {
        produtoId: "1",
        produto: "Notebook Dell Inspiron 15",
        codigo: "NB001",
        quantidade: 10,
        precoUnitario: 2500.00
      },
      {
        produtoId: "2",
        produto: "Mouse Logitech MX Master 3",
        codigo: "MS001",
        quantidade: 20,
        precoUnitario: 320.00
      }
    ],
    total: 31400.00,
    status: "RECEBIDO" as const,
    dataCompra: "2025-01-15T09:30:00",
    dataEntrega: "2025-01-18T00:00:00",
    dataRecebimento: "2025-01-17T14:30:00",
    responsavel: "João Silva",
    observacoes: "Entrega antecipada. Produtos em perfeito estado."
  },
  {
    id: "2",
    fornecedorId: "2",
    fornecedor: "Eletrônicos Silva",
    fornecedorEmail: "vendas@eletronicos.com",
    fornecedorTelefone: "(11) 3333-2222",
    itens: [
      {
        produtoId: "3",
        produto: "Teclado Razer BlackWidow V3",
        codigo: "TC001",
        quantidade: 15,
        precoUnitario: 150.00
      }
    ],
    total: 2250.00,
    status: "APROVADO" as const,
    dataCompra: "2025-01-18T11:15:00",
    dataEntrega: "2025-01-22T00:00:00",
    responsavel: "Maria Silva",
    observacoes: "Pagamento via boleto, prazo de 30 dias."
  },
  {
    id: "3",
    fornecedorId: "3",
    fornecedor: "InfoParts Brasil",
    fornecedorEmail: "atendimento@infoparts.com",
    fornecedorTelefone: "(11) 3333-3333",
    itens: [
      {
        produtoId: "4",
        produto: "Monitor Samsung 24\"",
        codigo: "MT001",
        quantidade: 8,
        precoUnitario: 650.00
      },
      {
        produtoId: "5",
        produto: "Cabo HDMI 2m",
        codigo: "CB001",
        quantidade: 30,
        precoUnitario: 20.00
      }
    ],
    total: 5800.00,
    status: "PENDENTE" as const,
    dataCompra: "2025-01-20T16:45:00",
    dataEntrega: "2025-01-25T00:00:00",
    responsavel: "Ana Costa",
    observacoes: "Aguardando aprovação do orçamento."
  },
  {
    id: "4",
    fornecedorId: "1",
    fornecedor: "TechDistribuidor Ltda",
    fornecedorEmail: "compras@techdist.com",
    fornecedorTelefone: "(11) 3333-1111",
    itens: [
      {
        produtoId: "2",
        produto: "Mouse Logitech MX Master 3",
        codigo: "MS001",
        quantidade: 50,
        precoUnitario: 300.00
      }
    ],
    total: 15000.00,
    status: "CANCELADO" as const,
    dataCompra: "2025-01-19T10:00:00",
    dataEntrega: "2025-01-24T00:00:00",
    responsavel: "João Silva",
    observacoes: "Cancelada devido a problemas de fornecimento."
  },
]

// Type definitions
type CompraFormData = {
  fornecedorId: string
  itens: Array<{
    produtoId: string
    quantidade: number
    precoUnitario: number
  }>
  dataEntrega: string
  observacoes?: string
}

export default function ComprasPage() {
  const [compras, setCompras] = useState(initialCompras)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const [isCompraDialogOpen, setIsCompraDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCompra, setSelectedCompra] = useState<typeof initialCompras[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredCompras = compras.filter(compra => {
    const matchesSearch = compra.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         compra.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         compra.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "TODOS" || compra.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculando estatísticas
  const totalCompras = compras.length
  const comprasRecebidas = compras.filter(c => c.status === "RECEBIDO")
  const valorInvestido = comprasRecebidas.reduce((acc, c) => acc + c.total, 0)
  const comprasPendentes = compras.filter(c => c.status === "PENDENTE" || c.status === "APROVADO").length
  const comprasHoje = compras.filter(c => {
    const hoje = new Date().toDateString()
    const dataCompra = new Date(c.dataCompra).toDateString()
    return hoje === dataCompra
  }).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEBIDO":
        return "default"
      case "APROVADO":
        return "secondary"
      case "PENDENTE":
        return "outline"
      case "CANCELADO":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RECEBIDO":
        return "✅"
      case "APROVADO":
        return "🔄"
      case "PENDENTE":
        return "⏳"
      case "CANCELADO":
        return "❌"
      default:
        return "❓"
    }
  }

  const isAtrasada = (compra: typeof initialCompras[0]) => {
    if (compra.status === "RECEBIDO" || compra.status === "CANCELADO") return false
    const hoje = new Date()
    const dataEntrega = new Date(compra.dataEntrega)
    return hoje > dataEntrega
  }

  const handleCreateCompra = () => {
    setSelectedCompra(null)
    setIsCompraDialogOpen(true)
  }

  const handleEditCompra = (compra: typeof initialCompras[0]) => {
    setSelectedCompra(compra)
    setIsCompraDialogOpen(true)
  }

  const handleViewCompra = (compra: typeof initialCompras[0]) => {
    setSelectedCompra(compra)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteCompra = (compra: typeof initialCompras[0]) => {
    setSelectedCompra(compra)
    setIsDeleteDialogOpen(true)
  }

  const handleCompraSubmit = async (data: CompraFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const total = data.itens.reduce((acc: number, item: { quantidade: number; precoUnitario: number }) => acc + (item.quantidade * item.precoUnitario), 0)

      if (selectedCompra) {
        // Update existing compra
        setCompras(prev => prev.map(compra =>
          compra.id === selectedCompra.id
            ? {
                ...compra,
                ...data,
                total,
                itens: data.itens.map((item: { produtoId: string; quantidade: number; precoUnitario: number }) => ({
                  ...item,
                  produto: "Produto Atualizado", // This would come from the API
                  codigo: "PROD001" // This would come from the API
                }))
              }
            : compra
        ))
        toast.success("Compra atualizada", {
          description: "A compra foi atualizada com sucesso.",
        })
      } else {
        // Create new compra
        const newCompra = {
          id: Date.now().toString(),
          ...data,
          fornecedor: "Fornecedor Selecionado", // This would come from the API
          fornecedorEmail: "email@fornecedor.com", // This would come from the API
          fornecedorTelefone: "(11) 9999-9999", // This would come from the API
          itens: data.itens.map((item: { produtoId: string; quantidade: number; precoUnitario: number }) => ({
            ...item,
            produto: "Produto Selecionado", // This would come from the API
            codigo: "PROD001" // This would come from the API
          })),
          total,
          status: "PENDENTE" as const,
          dataCompra: new Date().toISOString(),
          responsavel: "Usuário Atual", // This would come from auth
          observacoes: data.observacoes || ""
        }
        setCompras(prev => [newCompra, ...prev])
        toast.success("Compra registrada", {
          description: "A nova compra foi registrada com sucesso.",
        })
      }
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar a compra.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async (compraId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setCompras(prev => prev.filter(compra => compra.id !== compraId))
      toast.success("Compra excluída", {
        description: "A compra foi excluída com sucesso.",
      })
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao excluir a compra.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compras</h1>
          <p className="text-muted-foreground">
            Gerencie compras e reposição de estoque
          </p>
        </div>
        <PermissionGuard permission="compras:create">
          <Button onClick={handleCreateCompra}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Compra
          </Button>
        </PermissionGuard>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Compras</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompras}</div>
            <p className="text-xs text-muted-foreground">
              compras registradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ {valorInvestido.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              em compras recebidas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{comprasPendentes}</div>
            <p className="text-xs text-muted-foreground">
              aguardando recebimento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{comprasHoje}</div>
            <p className="text-xs text-muted-foreground">
              realizadas hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Compras</CardTitle>
          <CardDescription>
            Histórico completo de compras e reposições
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar compras..."
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
              <option value="PENDENTE">Pendentes</option>
              <option value="APROVADO">Aprovadas</option>
              <option value="RECEBIDO">Recebidas</option>
              <option value="CANCELADO">Canceladas</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Compra</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompras.map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell>
                    <span className="font-mono">#{compra.id}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{compra.fornecedor}</div>
                      <div className="text-sm text-muted-foreground">{compra.itens.length} item(s)</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-blue-600">
                      R$ {compra.total.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(compra.status)} className="flex items-center gap-1 w-fit">
                        <span>{getStatusIcon(compra.status)}</span>
                        {compra.status}
                      </Badge>
                      {isAtrasada(compra) && (
                        <Badge variant="destructive" className="text-xs">Atrasada</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(compra.dataCompra).toLocaleDateString('pt-BR')}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(compra.dataCompra).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(compra.dataEntrega).toLocaleDateString('pt-BR')}</div>
                      {compra.dataRecebimento && (
                        <div className="text-sm text-green-600">
                          Recebida: {new Date(compra.dataRecebimento).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{compra.responsavel}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewCompra(compra)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <PermissionGuard permission="vendas:read">
                          <DropdownMenuItem onClick={() => handleEditCompra(compra)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission="compras:delete">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteCompra(compra)}
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

          {filteredCompras.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma compra encontrada.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CompraDialog
        open={isCompraDialogOpen}
        onOpenChange={setIsCompraDialogOpen}
        compra={selectedCompra}
        onSubmit={handleCompraSubmit}
        isLoading={isLoading}
      />

      <CompraDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        compra={selectedCompra as any}
      />

      <DeleteCompraDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        compra={selectedCompra as any}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
