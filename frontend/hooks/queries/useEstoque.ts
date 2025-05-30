"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Estoque, type Stock } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['estoque'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  byProductAndWarehouse: (produtoId: string, depositoId: string) =>
    [...QUERY_KEYS.all, 'product-warehouse', produtoId, depositoId] as const,
  lowStock: () => [...QUERY_KEYS.all, 'low-stock'] as const,
}

// Hooks
export function useEstoque() {
  return useQuery({
    queryKey: QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await api.stock.list()
      return response.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute - real-time data
  })
}

export function useEstoqueItem(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.stock.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useEstoqueByProductAndWarehouse(produtoId: string, depositoId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.byProductAndWarehouse(produtoId, depositoId),
    queryFn: async () => {
      const response = await api.stock.getByProductAndWarehouse(produtoId, depositoId)
      return response.data
    },
    enabled: !!(produtoId && depositoId),
    staleTime: 1 * 60 * 1000,
  })
}

export function useLowStockItems(limite?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.lowStock(),
    queryFn: async () => {
      const response = await api.stock.getLowStock(limite)
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  })
}

// Mutations
export function useCreateEstoque() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Stock.CreateRequest) => {
      const response = await api.stock.create(data)
      return response.data
    },
    onSuccess: (newEstoque) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Estoque[] | undefined) => {
          if (!old) return [newEstoque]
          return [...old, newEstoque]
        }
      )

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.byProductAndWarehouse(newEstoque.produtoId, newEstoque.depositoId)
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lowStock() })

      toast.success('Item de estoque criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar item de estoque: ' + error.message)
    },
  })
}

export function useUpdateQuantidadeEstoque() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      produtoId,
      depositoId,
      data
    }: {
      produtoId: string;
      depositoId: string;
      data: Stock.UpdateQuantityRequest
    }) => {
      const response = await api.stock.updateQuantity(produtoId, depositoId, data)
      return response.data
    },
    onSuccess: (updatedEstoque, { produtoId, depositoId }) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Estoque[] | undefined) => {
          if (!old) return [updatedEstoque]
          return old.map((estoque) =>
            estoque.produtoId === produtoId && estoque.depositoId === depositoId
              ? updatedEstoque
              : estoque
          )
        }
      )

      queryClient.setQueryData(
        QUERY_KEYS.byProductAndWarehouse(produtoId, depositoId),
        updatedEstoque
      )
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lowStock() })

      toast.success('Quantidade de estoque atualizada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar quantidade: ' + error.message)
    },
  })
}

export function useAdicionarEstoque() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      produtoId,
      depositoId,
      data
    }: {
      produtoId: string;
      depositoId: string;
      data: Stock.AddStockRequest
    }) => {
      const response = await api.stock.addStock(produtoId, depositoId, data)
      return response.data
    },
    onSuccess: (updatedEstoque, { produtoId, depositoId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.byProductAndWarehouse(produtoId, depositoId)
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lowStock() })

      toast.success('Estoque adicionado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao adicionar estoque: ' + error.message)
    },
  })
}

export function useRemoverEstoque() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      produtoId,
      depositoId,
      data
    }: {
      produtoId: string;
      depositoId: string;
      data: Stock.RemoveStockRequest
    }) => {
      const response = await api.stock.removeStock(produtoId, depositoId, data)
      return response.data
    },
    onSuccess: (updatedEstoque, { produtoId, depositoId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.byProductAndWarehouse(produtoId, depositoId)
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lowStock() })

      toast.success('Estoque removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover estoque: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as estoqueQueryKeys }
