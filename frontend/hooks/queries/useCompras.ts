"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Compra, type Purchases } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['compras'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
}

// Hooks
export function useCompras() {
  return useQuery({
    queryKey: QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await api.purchases.list()
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for purchase data
  })
}

export function useCompra(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.purchases.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

// Mutations
export function useCreateCompra() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Purchases.CreateRequest) => {
      const response = await api.purchases.create(data)
      return response.data
    },
    onSuccess: (newCompra) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Compra[] | undefined) => {
          if (!old) return [newCompra]
          return [...old, newCompra]
        }
      )

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['estoque'] }) // Update stock

      toast.success('Compra criada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar compra: ' + error.message)
    },
  })
}

export function useUpdateCompra() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Purchases.UpdateStatusRequest }) => {
      const response = await api.purchases.updateStatus(id, data)
      return response.data
    },
    onSuccess: (updatedCompra, { id }) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Compra[] | undefined) => {
          if (!old) return []
          return old.map((compra) =>
            compra.id === id ? { ...compra, ...updatedCompra } : compra
          )
        }
      )

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })
      queryClient.invalidateQueries({ queryKey: ['estoque'] }) // Update stock

      toast.success('Status da compra atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar compra: ' + error.message)
    },
  })
}

export function useDeleteCompra() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.purchases.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Compra[] | undefined) => {
          if (!old) return []
          return old.filter((compra) => compra.id !== deletedId)
        }
      )

      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['estoque'] }) // Update stock

      toast.success('Compra excluída com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir compra: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as comprasQueryKeys }
