"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, ShoppingCart, DollarSign, TrendingUp, Users } from "lucide-react"
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
import { VendaDialog } from "@/components/forms/venda/venda-dialog"
import { VendaDetailsDialog } from "@/components/forms/venda/venda-details-dialog"
import { DeleteVendaDialog } from "@/components/forms/venda/delete-venda-dialog"

// Import types
import type { VendaType, VendaFormData, VendaItem } from "@/lib/api/types"

// Mock data - in a real app, this would come from your API
const initialVendas: VendaType[] = [
  {
    id: "1",
    clienteNome: "Maria Santos",
    clienteEmail: "maria.santos@email.com",
    clienteTelefone: "(11) 99999-1111",
    itens: [
      {
        produtoId: "1",
        produto: "Notebook Dell Inspiron 15",
        codigo: "NB001",
        quantidade: 1,
        precoUnitario: 2899.99
      },
      {
        produtoId: "2",
        produto: "Mouse Logitech MX Master 3",
        codigo: "MS001",
        quantidade: 1,
        precoUnitario: 399.99
      }
    ],
    total: 3299.98,
    formaPagamento: "CARTAO_CREDITO",
    status: "PAGA",
    dataVenda: "2025-01-20T10:30:00",
    vendedor: "João Silva",
    observacoes: "Cliente preferencial"
  },
  {
    id: "2",
    clienteNome: "Carlos Oliveira",
    clienteEmail: "",
    clienteTelefone: "(11) 99999-2222",
    itens: [
      {
        produtoId: "3",
        produto: "Teclado Razer BlackWidow V3",
        codigo: "TC001",
        quantidade: 2,
        precoUnitario: 189.99
      }
    ],
    total: 379.98,
    formaPagamento: "PIX",
    status: "PAGA",
    dataVenda: "2025-01-20T14:15:00",
    vendedor: "Ana Costa",
    observacoes: ""
  },
  {
    id: "3",
    clienteNome: "Fernanda Lima",
    clienteEmail: "fernanda@email.com",
    clienteTelefone: "(11) 99999-3333",
    itens: [
      {
        produtoId: "4",
        produto: "Monitor Samsung 24\"",
        codigo: "MT001",
        quantidade: 1,
        precoUnitario: 799.99
      },
      {
        produtoId: "5",
        produto: "Cabo HDMI 2m",
        codigo: "CB001",
        quantidade: 2,
        precoUnitario: 29.99
      }
    ],
    total: 859.97,
    formaPagamento: "DINHEIRO",
    status: "PENDENTE",
    dataVenda: "2025-01-19T16:45:00",
    vendedor: "João Silva",
    observacoes: "Aguardando confirmação do pagamento"
  },
  {
    id: "4",
    clienteNome: "Roberto Mendes",
    clienteEmail: "",
    clienteTelefone: "(11) 99999-4444",
    itens: [
      {
        produtoId: "1",
        produto: "Notebook Dell Inspiron 15",
        codigo: "NB001",
        quantidade: 1,
        precoUnitario: 2899.99
      }
    ],
    total: 2899.99,
    formaPagamento: "BOLETO",
    status: "CANCELADA",
    dataVenda: "2025-01-18T11:00:00",
    vendedor: "Maria Silva",
    observacoes: "Cliente desistiu da compra"
  },
]

const formasPagamentoMap = {
  DINHEIRO: { label: "Dinheiro", icon: "💵" },
  CARTAO_CREDITO: { label: "Cartão de Crédito", icon: "💳" },
  CARTAO_DEBITO: { label: "Cartão de Débito", icon: "💳" },
  PIX: { label: "PIX", icon: "📱" },
  BOLETO: { label: "Boleto", icon: "📄" },
}

export default function VendasPage() {
  const [vendas, setVendas] = useState<VendaType[]>(initialVendas)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const [isVendaDialogOpen, setIsVendaDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedVenda, setSelectedVenda] = useState<VendaType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = venda.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "TODOS" || venda.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculando estatísticas
  const totalVendas = vendas.length
  const vendasPagas = vendas.filter(v => v.status === "PAGA")
  const faturamentoTotal = vendasPagas.reduce((acc, v) => acc + v.total, 0)
  const vendasHoje = vendas.filter(v => {
    const hoje = new Date().toDateString()
    const dataVenda = new Date(v.dataVenda).toDateString()
    return hoje === dataVenda
  }).length
  const clientesUnicos = new Set(vendas.map(v => v.clienteNome)).size

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAGA":
        return "default"
      case "PENDENTE":
        return "secondary"
      case "CANCELADA":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAGA":
        return "✅"
      case "PENDENTE":
        return "⏳"
      case "CANCELADA":
        return "❌"
      default:
        return "❓"
    }
  }

  const getFormaPagamentoInfo = (forma: string) => {
    return formasPagamentoMap[forma as keyof typeof formasPagamentoMap] || { label: forma, icon: "💳" }
  }

  const handleCreateVenda = () => {
    setSelectedVenda(null)
    setIsVendaDialogOpen(true)
  }

  const handleEditVenda = (venda: VendaType) => {
    setSelectedVenda(venda)
    setIsVendaDialogOpen(true)
  }

  const handleViewVenda = (venda: VendaType) => {
    setSelectedVenda(venda)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteVenda = (venda: VendaType) => {
    setSelectedVenda(venda)
    setIsDeleteDialogOpen(true)
  }

  const handleVendaSubmit = async (data: VendaFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const total = data.itens.reduce((acc: number, item: VendaItem) => acc + (item.quantidade * item.precoUnitario), 0)

      if (selectedVenda) {
        // Update existing venda
        setVendas(prev => prev.map(venda =>
          venda.id === selectedVenda.id
            ? {
                ...venda,
                ...data,
                total,
                itens: data.itens.map((item: VendaItem) => ({
                  ...item,
                  produto: "Produto Atualizado", // This would come from the API
                  codigo: "PROD001" // This would come from the API
                }))
              }
            : venda
        ) as VendaType[])
        toast.success("Venda atualizada", {
          description: "A venda foi atualizada com sucesso.",
        })
      } else {
        // Create new venda
        const newVenda: VendaType = {
          id: Date.now().toString(),
          ...data,
          clienteEmail: data.clienteEmail || "",
          itens: data.itens.map((item: VendaItem) => ({
            ...item,
            produto: "Produto Selecionado", // This would come from the API
            codigo: "PROD001" // This would come from the API
          })),
          total,
          status: "PENDENTE",
          dataVenda: new Date().toISOString(),
          vendedor: "Usuário Atual", // This would come from auth
          observacoes: data.observacoes || ""
        }
        setVendas(prev => [newVenda, ...prev])
        toast.success("Venda registrada", {
          description: "A nova venda foi registrada com sucesso.",
        })
      }
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar a venda.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async (vendaId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setVendas(prev => prev.filter(venda => venda.id !== vendaId))
      toast.success("Venda excluída", {
        description: "A venda foi excluída com sucesso.",
      })
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao excluir a venda.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie vendas e controle o faturamento
          </p>
        </div>
        <PermissionGuard permission="vendas:create">
          <Button onClick={handleCreateVenda}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Venda
          </Button>
        </PermissionGuard>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendas}</div>
            <p className="text-xs text-muted-foreground">
              vendas registradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {faturamentoTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              em vendas pagas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{vendasHoje}</div>
            <p className="text-xs text-muted-foreground">
              realizadas hoje
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{clientesUnicos}</div>
            <p className="text-xs text-muted-foreground">
              clientes diferentes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
          <CardDescription>
            Histórico completo de vendas realizadas
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vendas..."
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
              <option value="PAGA">Pagas</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell>
                    <span className="font-mono">#{venda.id}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{venda.clienteNome}</div>
                      <div className="text-sm text-muted-foreground">{venda.clienteTelefone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-600">
                      R$ {venda.total.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{getFormaPagamentoInfo(venda.formaPagamento).icon}</span>
                      <span className="text-sm">{getFormaPagamentoInfo(venda.formaPagamento).label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(venda.status)} className="flex items-center gap-1 w-fit">
                      <span>{getStatusIcon(venda.status)}</span>
                      {venda.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(venda.dataVenda).toLocaleDateString('pt-BR')}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(venda.dataVenda).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{venda.vendedor}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewVenda(venda)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <PermissionGuard permission="vendas:read">
                          <DropdownMenuItem onClick={() => handleEditVenda(venda)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission="vendas:delete">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteVenda(venda)}
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

          {filteredVendas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma venda encontrada.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <VendaDialog
        open={isVendaDialogOpen}
        onOpenChange={setIsVendaDialogOpen}
        venda={selectedVenda}
        onSubmit={handleVendaSubmit}
        isLoading={isLoading}
      />

      <VendaDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        venda={selectedVenda}
      />

      <DeleteVendaDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        venda={selectedVenda}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
