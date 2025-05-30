"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Categoria, type Categories } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['categorias'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Categories.ListQuery) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
}

// Hooks
export function useCategorias(query?: Categories.ListQuery) {
  return useQuery({
    queryKey: QUERY_KEYS.list(query),
    queryFn: async () => {
      const response = await api.categories.list(query)
      return response.data // Extrair dados da ApiResponse
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
  })
}

export function useCategoria(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.categories.getById(id)
      return response.data // Extrair dados da ApiResponse
    },
    enabled: !!id,
  })
}

// Mutations
export function useCreateCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Categories.CreateRequest) => {
      const response = await api.categories.create(data)
      return response.data // Extrair dados da ApiResponse
    },
    onSuccess: (newCategoria) => {
      // Update all categoria list caches
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Categoria[] | undefined) => {
          if (!old) return [newCategoria]
          return [...old, newCategoria]
        }
      )

      // Invalidate and refetch all lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })

      // Usar mensagem do backend ou fallback
      toast.success('Categoria criada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar categoria: ' + error.message)
    },
  })
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Categories.UpdateRequest }) => {
      const response = await api.categories.update(id, data)
      return response.data // Extrair dados da ApiResponse
    },
    onSuccess: (updatedCategoria) => {
      // Update all categoria list caches
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Categoria[] | undefined) => {
          if (!old) return [updatedCategoria]
          return old.map((categoria) =>
            categoria.id === updatedCategoria.id ? updatedCategoria : categoria
          )
        }
      )

      // Update the individual categoria cache
      queryClient.setQueryData(QUERY_KEYS.detail(updatedCategoria.id), updatedCategoria)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })

      toast.success('Categoria atualizada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar categoria: ' + error.message)
    },
  })
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.categories.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from all categoria list caches
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Categoria[] | undefined) => {
          if (!old) return []
          return old.filter((categoria) => categoria.id !== deletedId)
        }
      )

      // Remove individual categoria cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(deletedId) })

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })

      toast.success('Categoria excluída com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir categoria: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as categoriasQueryKeys }
