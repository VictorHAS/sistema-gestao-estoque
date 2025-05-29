"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, ArrowUpCircle, ArrowDownCircle, Package, Activity } from "lucide-react"
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
import { EstoqueDialog } from "@/components/forms/estoque/estoque-dialog"
import { EstoqueDetailsDialog } from "@/components/forms/estoque/estoque-details-dialog"
import { DeleteEstoqueDialog } from "@/components/forms/estoque/delete-estoque-dialog"

// Mock data - in a real app, this would come from your API
const initialMovimentacoes = [
  {
    id: "1",
    produtoId: "1",
    produto: "Notebook Dell Inspiron 15",
    codigo: "NB001",
    tipo: "ENTRADA" as const,
    quantidade: 10,
    motivo: "Compra de mercadoria",
    observacoes: "Primeira compra do mês",
    dataMovimentacao: "2025-01-20T10:30:00",
    usuario: "Maria Silva",
    estoqueAnterior: 5,
    estoqueAtual: 15
  },
  {
    id: "2",
    produtoId: "2",
    produto: "Mouse Logitech MX Master 3",
    codigo: "MS001",
    tipo: "SAIDA" as const,
    quantidade: 3,
    motivo: "Venda ao cliente",
    dataMovimentacao: "2025-01-20T14:15:00",
    usuario: "João Santos",
    estoqueAnterior: 28,
    estoqueAtual: 25
  },
  {
    id: "3",
    produtoId: "3",
    produto: "Teclado Razer BlackWidow V3",
    codigo: "TC001",
    tipo: "ENTRADA" as const,
    quantidade: 5,
    motivo: "Devolução de cliente",
    observacoes: "Cliente desistiu da compra",
    dataMovimentacao: "2025-01-19T16:45:00",
    usuario: "Ana Costa",
    estoqueAnterior: 3,
    estoqueAtual: 8
  },
  {
    id: "4",
    produtoId: "4",
    produto: "Monitor Samsung 24\"",
    codigo: "MT001",
    tipo: "SAIDA" as const,
    quantidade: 2,
    motivo: "Uso interno",
    observacoes: "Equipamentos para nova filial",
    dataMovimentacao: "2025-01-19T09:20:00",
    usuario: "Admin Sistema",
    estoqueAnterior: 7,
    estoqueAtual: 5
  },
  {
    id: "5",
    produtoId: "5",
    produto: "Cabo HDMI 2m",
    codigo: "CB001",
    tipo: "ENTRADA" as const,
    quantidade: 25,
    motivo: "Compra de mercadoria",
    dataMovimentacao: "2025-01-18T11:00:00",
    usuario: "Maria Silva",
    estoqueAnterior: 25,
    estoqueAtual: 50
  },
]

export default function EstoquePage() {
  const [movimentacoes, setMovimentacoes] = useState(initialMovimentacoes)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("TODOS")
  const [isEstoqueDialogOpen, setIsEstoqueDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMovimentacao, setSelectedMovimentacao] = useState<typeof initialMovimentacoes[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredMovimentacoes = movimentacoes.filter(movimentacao => {
    const matchesSearch = movimentacao.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movimentacao.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movimentacao.motivo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === "TODOS" || movimentacao.tipo === tipoFilter
    return matchesSearch && matchesTipo
  })

  // Calculando estatísticas
  const totalEntradas = movimentacoes.filter(m => m.tipo === "ENTRADA").reduce((acc, m) => acc + m.quantidade, 0)
  const totalSaidas = movimentacoes.filter(m => m.tipo === "SAIDA").reduce((acc, m) => acc + m.quantidade, 0)
  const totalMovimentacoes = movimentacoes.length
  const movimentacoesHoje = movimentacoes.filter(m => {
    const hoje = new Date().toDateString()
    const dataMovimentacao = new Date(m.dataMovimentacao).toDateString()
    return hoje === dataMovimentacao
  }).length

  const getTipoColor = (tipo: string) => {
    return tipo === "ENTRADA" ? "default" : "destructive"
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === "ENTRADA" ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />
  }

  const handleCreateMovimentacao = () => {
    setSelectedMovimentacao(null)
    setIsEstoqueDialogOpen(true)
  }

  const handleEditMovimentacao = (movimentacao: typeof initialMovimentacoes[0]) => {
    setSelectedMovimentacao(movimentacao)
    setIsEstoqueDialogOpen(true)
  }

  const handleViewMovimentacao = (movimentacao: typeof initialMovimentacoes[0]) => {
    setSelectedMovimentacao(movimentacao)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteMovimentacao = (movimentacao: typeof initialMovimentacoes[0]) => {
    setSelectedMovimentacao(movimentacao)
    setIsDeleteDialogOpen(true)
  }

  const handleMovimentacaoSubmit = async (data: {
    produtoId: string;
    tipo: "ENTRADA" | "SAIDA";
    quantidade: number;
    motivo: string;
    observacoes?: string;
  }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (selectedMovimentacao) {
        // Update existing movimentacao
        setMovimentacoes(prev => prev.map(mov =>
          mov.id === selectedMovimentacao.id
            ? { ...mov, ...data, dataMovimentacao: new Date().toISOString() }
            : mov
        ))
        toast.success("Movimentação atualizada", {
          description: "A movimentação de estoque foi atualizada com sucesso.",
        })
      } else {
        // Create new movimentacao
        const newMovimentacao = {
          id: Date.now().toString(),
          ...data,
          produto: "Produto Selecionado", // This would come from the API
          codigo: "PROD001", // This would come from the API
          dataMovimentacao: new Date().toISOString(),
          usuario: "Usuário Atual", // This would come from auth
          estoqueAnterior: 10, // This would be calculated
          estoqueAtual: data.tipo === "ENTRADA" ? 10 + data.quantidade : 10 - data.quantidade
        }
        setMovimentacoes(prev => [newMovimentacao, ...prev])
        toast.success("Movimentação registrada", {
          description: "A nova movimentação de estoque foi registrada com sucesso.",
        })
      }
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar a movimentação.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async (movimentacaoId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMovimentacoes(prev => prev.filter(mov => mov.id !== movimentacaoId))
      toast.success("Movimentação excluída", {
        description: "A movimentação de estoque foi excluída com sucesso.",
      })
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao excluir a movimentação.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movimentações de Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie entradas e saídas de produtos do estoque
          </p>
        </div>
        <PermissionGuard permission="estoque:create">
          <Button onClick={handleCreateMovimentacao}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Movimentação
          </Button>
        </PermissionGuard>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Movimentações</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovimentacoes}</div>
            <p className="text-xs text-muted-foreground">
              registros no sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{totalEntradas}</div>
            <p className="text-xs text-muted-foreground">
              unidades adicionadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{totalSaidas}</div>
            <p className="text-xs text-muted-foreground">
              unidades removidas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentações Hoje</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movimentacoesHoje}</div>
            <p className="text-xs text-muted-foreground">
              registradas hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Movimentações</CardTitle>
          <CardDescription>
            Histórico completo de entradas e saídas do estoque
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar movimentações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="TODOS">Todos os Tipos</option>
              <option value="ENTRADA">Entradas</option>
              <option value="SAIDA">Saídas</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovimentacoes.map((movimentacao) => (
                <TableRow key={movimentacao.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{movimentacao.produto}</div>
                      <div className="text-sm text-muted-foreground">{movimentacao.codigo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTipoColor(movimentacao.tipo)} className="flex items-center gap-1 w-fit">
                      {getTipoIcon(movimentacao.tipo)}
                      {movimentacao.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${movimentacao.tipo === "ENTRADA" ? "text-green-600" : "text-red-600"}`}>
                      {movimentacao.tipo === "ENTRADA" ? "+" : "-"}{movimentacao.quantidade}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={movimentacao.motivo}>
                      {movimentacao.motivo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(movimentacao.dataMovimentacao).toLocaleDateString('pt-BR')}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(movimentacao.dataMovimentacao).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{movimentacao.usuario}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewMovimentacao(movimentacao)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <PermissionGuard permission="estoque:update">
                          <DropdownMenuItem onClick={() => handleEditMovimentacao(movimentacao)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission="estoque:manage">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteMovimentacao(movimentacao)}
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

          {filteredMovimentacoes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma movimentação encontrada.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EstoqueDialog
        open={isEstoqueDialogOpen}
        onOpenChange={setIsEstoqueDialogOpen}
        movimentacao={selectedMovimentacao}
        onSubmit={handleMovimentacaoSubmit}
        isLoading={isLoading}
      />

      <EstoqueDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        movimentacao={selectedMovimentacao}
      />

      <DeleteEstoqueDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        movimentacao={selectedMovimentacao}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
