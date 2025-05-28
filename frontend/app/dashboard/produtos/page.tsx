"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

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
import { usePermissions } from "@/hooks/use-permissions"

// Mock data - in a real app, this would come from your API
const produtos = [
  {
    id: "1",
    nome: "Notebook Dell Inspiron",
    codigo: "NB001",
    categoria: "Informática",
    preco: 2599.99,
    estoque: 15,
    fornecedor: "Dell Brasil",
    status: "Ativo"
  },
  {
    id: "2",
    nome: "Mouse Logitech MX",
    codigo: "MS002",
    categoria: "Periféricos",
    preco: 299.90,
    estoque: 45,
    fornecedor: "Logitech",
    status: "Ativo"
  },
  {
    id: "3",
    nome: "Teclado Mecânico RGB",
    codigo: "KB003",
    categoria: "Periféricos",
    preco: 189.90,
    estoque: 8,
    fornecedor: "Razer",
    status: "Baixo Estoque"
  },
  {
    id: "4",
    nome: "Monitor Samsung 24''",
    codigo: "MN004",
    categoria: "Monitores",
    preco: 899.00,
    estoque: 0,
    fornecedor: "Samsung",
    status: "Sem Estoque"
  },
  {
    id: "5",
    nome: "Cabo HDMI 2m",
    codigo: "CB005",
    categoria: "Cabos",
    preco: 29.90,
    estoque: 120,
    fornecedor: "Diversos",
    status: "Ativo"
  },
]

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { can } = usePermissions()

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string, estoque: number) => {
    if (estoque === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    } else if (estoque < 10) {
      return <Badge variant="secondary">Baixo Estoque</Badge>
    }
    return <Badge variant="default">Ativo</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        <PermissionGuard permission="produtos:create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </PermissionGuard>
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
                  <TableCell className="font-medium">{produto.codigo}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>
                    R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{produto.estoque} un.</TableCell>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <PermissionGuard permission="produtos:update">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission="produtos:delete">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
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

          {filteredProdutos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto encontrado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Summary for Development */}
      <PermissionGuard role="ADMIN">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">🔐 Informações de Permissão (Admin)</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div>Criar Produtos: {can.createProducts ? "✅" : "❌"}</div>
            <div>Editar Produtos: {can.editProducts ? "✅" : "❌"}</div>
            <div>Excluir Produtos: {can.deleteProducts ? "✅" : "❌"}</div>
          </CardContent>
        </Card>
      </PermissionGuard>
    </div>
  )
}
