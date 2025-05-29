"use client"

import { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Shield, UserCheck } from "lucide-react"
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
import { useAuth } from "@/lib/auth"
import { UserDialog } from "@/components/forms/usuarios/user-dialog"
import { UserDetailsDialog } from "@/components/forms/usuarios/user-details-dialog"
import { DeleteUserDialog } from "@/components/forms/usuarios/delete-user-dialog"
import { demonstratePermissions } from "@/lib/demo-permissions"

// Mock data - in a real app, this would come from your API
const initialUsuarios = [
  {
    id: "1",
    nome: "Admin Sistema",
    email: "admin@sistema.com",
    cargo: "ADMIN" as const,
    dataCriacao: "2025-01-01",
    status: "Ativo"
  },
  {
    id: "2",
    nome: "Maria Silva",
    email: "maria@sistema.com",
    cargo: "GERENTE" as const,
    dataCriacao: "2025-01-02",
    status: "Ativo"
  },
  {
    id: "3",
    nome: "João Santos",
    email: "joao@sistema.com",
    cargo: "FUNCIONARIO" as const,
    dataCriacao: "2025-01-03",
    status: "Ativo"
  },
  {
    id: "4",
    nome: "Ana Costa",
    email: "ana@sistema.com",
    cargo: "FUNCIONARIO" as const,
    dataCriacao: "2025-01-04",
    status: "Inativo"
  },
]

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(initialUsuarios)
  const [searchTerm, setSearchTerm] = useState("")
  const [cargoFilter, setCargoFilter] = useState<string>("TODOS")
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<typeof initialUsuarios[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { user: currentUser } = useAuth()

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCargo = cargoFilter === "TODOS" || usuario.cargo === cargoFilter
    return matchesSearch && matchesCargo
  })

  useEffect(() => {
    demonstratePermissions()
  }, [])

  const getCargoColor = (cargo: string) => {
    switch (cargo) {
      case "ADMIN":
        return "destructive"
      case "GERENTE":
        return "default"
      case "FUNCIONARIO":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getCargoIcon = (cargo: string) => {
    switch (cargo) {
      case "ADMIN":
        return <Shield className="h-3 w-3" />
      case "GERENTE":
        return <UserCheck className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsUserDialogOpen(true)
  }

  const handleEditUser = (user: typeof initialUsuarios[0]) => {
    setSelectedUser(user)
    setIsUserDialogOpen(true)
  }

  const handleViewUser = (user: typeof initialUsuarios[0]) => {
    setSelectedUser(user)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteUser = (user: typeof initialUsuarios[0]) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }


  const handleUserSubmit = async (data: {
    nome: string;
    email: string;
    senha?: string;
    cargo: "ADMIN" | "GERENTE" | "FUNCIONARIO";
  }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (selectedUser) {
        // Update existing user
        setUsuarios(prev => prev.map(user =>
          user.id === selectedUser.id
            ? { ...user, ...data, dataAtualizacao: new Date().toISOString() }
            : user
        ))
        toast.success("Usuário atualizado", {
          description: "As informações do usuário foram atualizadas com sucesso.",
        })
      } else {
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          ...data,
          dataCriacao: new Date().toISOString(),
          status: "Ativo"
        }
        setUsuarios(prev => [...prev, newUser])
        toast.success("Usuário criado", {
          description: "O novo usuário foi criado com sucesso.",
        })
      }
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar o usuário.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async (userId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUsuarios(prev => prev.filter(user => user.id !== userId))
      toast.success("Usuário excluído", {
        description: "O usuário foi excluído com sucesso.",
      })
    } catch {
      toast.error("Erro", {
        description: "Ocorreu um erro ao excluir o usuário.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários e suas permissões
          </p>
        </div>
        <PermissionGuard permission="usuarios:create">
          <Button onClick={handleCreateUser}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </PermissionGuard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os usuários do sistema
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={cargoFilter}
              onChange={(e) => setCargoFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="TODOS">Todos os Cargos</option>
              <option value="ADMIN">Admin</option>
              <option value="GERENTE">Gerente</option>
              <option value="FUNCIONARIO">Funcionário</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getCargoIcon(usuario.cargo)}
                      {usuario.nome}
                      {currentUser?.id === usuario.id && (
                        <Badge variant="outline" className="text-xs">Você</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge variant={getCargoColor(usuario.cargo)}>
                      {usuario.cargo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={usuario.status === "Ativo" ? "default" : "secondary"}>
                      {usuario.status}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => handleViewUser(usuario)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>

                        {/* Users can edit themselves, admins can edit anyone */}
                        <PermissionGuard
                          permissions={["usuarios:update"]}
                          fallback={
                            currentUser?.id === usuario.id ? (
                              <DropdownMenuItem onClick={() => handleEditUser(usuario)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar Perfil
                              </DropdownMenuItem>
                            ) : null
                          }
                        >
                          <DropdownMenuItem onClick={() => handleEditUser(usuario)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <PermissionGuard permission="usuarios:delete">
                          {/* Prevent admin from deleting themselves */}
                          {currentUser?.id !== usuario.id && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteUser(usuario)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </>
                          )}
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsuarios.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UserDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        user={selectedUser}
        onSubmit={handleUserSubmit}
        isLoading={isLoading}
      />

      <UserDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        user={selectedUser}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
