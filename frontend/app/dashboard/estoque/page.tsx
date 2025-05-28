"use client"

import { useState } from "react"
import { Search, AlertTriangle, TrendingUp, TrendingDown, Package, Building2 } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data - in a real app, this would come from your API
const estoqueData = [
  {
    id: "1",
    produto: "Notebook Dell Inspiron",
    codigo: "NB001",
    deposito: "Depósito Principal",
    quantidade: 15,
    minimoEstoque: 10,
    maximoEstoque: 50,
    valorTotal: 38999.85,
    ultimaMovimentacao: "2025-01-20",
    tipoMovimentacao: "entrada"
  },
  {
    id: "2",
    produto: "Mouse Logitech MX",
    codigo: "MS002",
    deposito: "Depósito Periféricos",
    quantidade: 45,
    minimoEstoque: 20,
    maximoEstoque: 100,
    valorTotal: 13495.50,
    ultimaMovimentacao: "2025-01-18",
    tipoMovimentacao: "saida"
  },
  {
    id: "3",
    produto: "Teclado Mecânico RGB",
    codigo: "KB003",
    deposito: "Depósito Periféricos",
    quantidade: 8,
    minimoEstoque: 15,
    maximoEstoque: 30,
    valorTotal: 1519.20,
    ultimaMovimentacao: "2025-01-15",
    tipoMovimentacao: "saida"
  },
  {
    id: "4",
    produto: "Monitor Samsung 24''",
    codigo: "MN004",
    deposito: "Depósito Principal",
    quantidade: 0,
    minimoEstoque: 5,
    maximoEstoque: 25,
    valorTotal: 0,
    ultimaMovimentacao: "2025-01-10",
    tipoMovimentacao: "saida"
  },
  {
    id: "5",
    produto: "Cabo HDMI 2m",
    codigo: "CB005",
    deposito: "Depósito Acessórios",
    quantidade: 120,
    minimoEstoque: 50,
    maximoEstoque: 200,
    valorTotal: 3588.00,
    ultimaMovimentacao: "2025-01-22",
    tipoMovimentacao: "entrada"
  },
]

const depositos = [
  "Todos os Depósitos",
  "Depósito Principal",
  "Depósito Periféricos",
  "Depósito Acessórios"
]

export default function EstoquePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeposito, setSelectedDeposito] = useState("Todos os Depósitos")

  const filteredEstoque = estoqueData.filter(item => {
    const matchesSearch = item.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDeposito = selectedDeposito === "Todos os Depósitos" ||
                           item.deposito === selectedDeposito
    return matchesSearch && matchesDeposito
  })

  const getStatusBadge = (quantidade: number, minimo: number) => {
    if (quantidade === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    } else if (quantidade < minimo) {
      return <Badge variant="secondary">Baixo Estoque</Badge>
    }
    return <Badge variant="default">Normal</Badge>
  }

  const getMovimentacaoIcon = (tipo: string) => {
    return tipo === "entrada"
                      ? <TrendingUp className="h-4 w-4 text-success" />
                : <TrendingDown className="h-4 w-4 text-destructive" />
  }

  // Estatísticas do estoque
  const totalProdutos = filteredEstoque.length
  const produtosBaixoEstoque = filteredEstoque.filter(item => item.quantidade < item.minimoEstoque).length
  const produtosSemEstoque = filteredEstoque.filter(item => item.quantidade === 0).length
  const valorTotalEstoque = filteredEstoque.reduce((acc, item) => acc + item.valorTotal, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
        <p className="text-muted-foreground">
          Monitore e gerencie o estoque em todos os depósitos
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baixo Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{produtosBaixoEstoque}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{produtosSemEstoque}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Controle de Estoque</CardTitle>
          <CardDescription>
            Visualize o estoque por produto e depósito
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
            <Select value={selectedDeposito} onValueChange={setSelectedDeposito}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecionar depósito" />
              </SelectTrigger>
              <SelectContent>
                {depositos.map((deposito) => (
                  <SelectItem key={deposito} value={deposito}>
                    {deposito}
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
                <TableHead>Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Depósito</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Última Movimentação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstoque.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell>{item.deposito}</TableCell>
                  <TableCell className="font-medium">{item.quantidade} un.</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {item.minimoEstoque}/{item.maximoEstoque}
                    </span>
                  </TableCell>
                  <TableCell>
                    R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getMovimentacaoIcon(item.tipoMovimentacao)}
                      <span className="text-sm">
                        {new Date(item.ultimaMovimentacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.quantidade, item.minimoEstoque)}
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
