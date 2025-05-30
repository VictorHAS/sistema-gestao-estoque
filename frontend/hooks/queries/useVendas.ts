"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Venda, type Sales } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['vendas'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  items: (vendaId: string) => [...QUERY_KEYS.detail(vendaId), 'items'] as const,
}

// Hooks
export function useVendas() {
  return useQuery({
    queryKey: QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await api.sales.list()
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for sales data
  })
}

export function useVenda(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.sales.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useVendaItens(vendaId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.items(vendaId),
    queryFn: async () => {
      const response = await api.sales.getItems(vendaId)
      return response.data
    },
    enabled: !!vendaId,
    staleTime: 1 * 60 * 1000,
  })
}

// Mutations
export function useCreateVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Sales.CreateRequest) => {
      const response = await api.sales.create(data)
      return response.data
    },
    onSuccess: (newVenda) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Venda[] | undefined) => {
          if (!old) return [newVenda]
          return [...old, newVenda]
        }
      )

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['estoque'] }) // Update stock

      toast.success('Venda criada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar venda: ' + error.message)
    },
  })
}

export function useUpdateVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Sales.UpdateStatusRequest }) => {
      const response = await api.sales.updateStatus(id, data)
      return response.data
    },
    onSuccess: (updatedVenda, { id }) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Venda[] | undefined) => {
          if (!old) return []
          return old.map((venda) =>
            venda.id === id ? { ...venda, ...updatedVenda } : venda
          )
        }
      )

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })

      toast.success('Status da venda atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar venda: ' + error.message)
    },
  })
}

export function useDeleteVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.sales.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Venda[] | undefined) => {
          if (!old) return []
          return old.filter((venda) => venda.id !== deletedId)
        }
      )

      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['estoque'] }) // Update stock

      toast.success('Venda excluída com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir venda: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as vendasQueryKeys }
