"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Usuario, type Users } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['usuarios'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Users.ListQuery) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
}

// Hooks
export function useUsuarios(query?: Users.ListQuery) {
  return useQuery({
    queryKey: QUERY_KEYS.list(query),
    queryFn: async () => {
      const response = await api.users.list(query)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUsuario(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.users.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

// Mutations
export function useCreateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Users.CreateRequest) => {
      const response = await api.users.create(data)
      return response.data
    },
    onSuccess: (newUsuario) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Usuario[] | undefined) => {
          if (!old) return [newUsuario]
          return [...old, newUsuario]
        }
      )

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      toast.success('Usuário criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar usuário: ' + error.message)
    },
  })
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Users.UpdateRequest }) => {
      const response = await api.users.update(id, data)
      return response.data
    },
    onSuccess: (updatedUsuario) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Usuario[] | undefined) => {
          if (!old) return [updatedUsuario]
          return old.map((usuario) =>
            usuario.id === updatedUsuario.id ? updatedUsuario : usuario
          )
        }
      )

      queryClient.setQueryData(QUERY_KEYS.detail(updatedUsuario.id), updatedUsuario)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })
      toast.success('Usuário atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar usuário: ' + error.message)
    },
  })
}

export function useUpdateSenhaUsuario() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Users.UpdatePasswordRequest }) => {
      const response = await api.users.updatePassword(id, data)
      return response
    },
    onSuccess: () => {
      toast.success('Senha atualizada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar senha: ' + error.message)
    },
  })
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Usuario[] | undefined) => {
          if (!old) return []
          return old.filter((usuario) => usuario.id !== deletedId)
        }
      )

      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      toast.success('Usuário excluído com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir usuário: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as usuariosQueryKeys }
