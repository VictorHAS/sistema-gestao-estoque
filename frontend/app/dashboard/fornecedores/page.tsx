"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Mail, Phone } from "lucide-react"

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

// Mock data - in a real app, this would come from your API
const fornecedores = [
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
]

export default function FornecedoresPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    return status === "Ativo"
      ? <Badge variant="default">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie seus fornecedores e parcerias
          </p>
        </div>
        <PermissionGuard permission="fornecedores:create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Fornecedor
          </Button>
        </PermissionGuard>
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
                  <TableCell>{fornecedor.produtosAtivos} produtos</TableCell>
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
                        <PermissionGuard permission="fornecedores:read">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard permission="fornecedores:update">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </PermissionGuard>
                        <DropdownMenuSeparator />
                        <PermissionGuard permission="fornecedores:delete">
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
        </CardContent>
      </Card>
    </div>
  )
}
