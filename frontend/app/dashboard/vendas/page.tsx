"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, TrendingUp, DollarSign } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PermissionGuard } from "@/components/permission-guard"

// Mock data - in a real app, this would come from your API
const vendas = [
  {
    id: "1",
    numero: "VND-001",
    usuario: "João Silva",
    dataVenda: "2025-01-20",
    status: "CONCLUIDO",
    valorTotal: 4599.98,
    itens: [
      { produto: "Notebook Dell", quantidade: 2, precoUnitario: 2299.99 }
    ]
  },
  {
    id: "2",
    numero: "VND-002",
    usuario: "Maria Santos",
    dataVenda: "2025-01-19",
    status: "PENDENTE",
    valorTotal: 299.95,
    itens: [
      { produto: "Mouse Logitech", quantidade: 5, precoUnitario: 59.99 }
    ]
  },
  {
    id: "3",
    numero: "VND-003",
    usuario: "Pedro Costa",
    dataVenda: "2025-01-18",
    status: "CONCLUIDO",
    valorTotal: 189.90,
    itens: [
      { produto: "Teclado Mecânico", quantidade: 1, precoUnitario: 189.90 }
    ]
  },
  {
    id: "4",
    numero: "VND-004",
    usuario: "Ana Lima",
    dataVenda: "2025-01-17",
    status: "CANCELADO",
    valorTotal: 2997.00,
    itens: [
      { produto: "Monitor Samsung", quantidade: 3, precoUnitario: 999.00 }
    ]
  },
  {
    id: "5",
    numero: "VND-005",
    usuario: "Carlos Oliveira",
    dataVenda: "2025-01-16",
    status: "CONCLUIDO",
    valorTotal: 149.50,
    itens: [
      { produto: "Cabo HDMI", quantidade: 5, precoUnitario: 29.90 }
    ]
  },
]

const statusOptions = [
  "Todos os Status",
  "PENDENTE",
  "CONCLUIDO",
  "CANCELADO"
]

export default function VendasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Todos os Status")

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = venda.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.usuario.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "Todos os Status" || venda.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONCLUIDO":
        return <Badge variant="default">Concluído</Badge>
      case "PENDENTE":
        return <Badge variant="secondary">Pendente</Badge>
      case "CANCELADO":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Estatísticas
  const totalVendas = filteredVendas.length
  const vendasConcluidas = filteredVendas.filter(v => v.status === "CONCLUIDO").length
  const vendasPendentes = filteredVendas.filter(v => v.status === "PENDENTE").length
  const faturamentoTotal = filteredVendas
    .filter(v => v.status === "CONCLUIDO")
    .reduce((acc, venda) => acc + venda.valorTotal, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie as vendas e acompanhe o faturamento
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Concluídas</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{vendasConcluidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{vendasPendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as vendas realizadas
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Data da Venda</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="font-medium">{venda.numero}</TableCell>
                  <TableCell>{venda.usuario}</TableCell>
                  <TableCell>
                    {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {venda.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {venda.itens.length} item(s)
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(venda.status)}
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
                        <PermissionGuard permission="vendas:read">

                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission="vendas:update_status">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Atualizar Status
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <DropdownMenuSeparator />
                        <PermissionGuard permission="vendas:delete">
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancelar
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
