"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Produto, type Products } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['produtos'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  search: (nome: string) => [...QUERY_KEYS.all, 'search', nome] as const,
}

// Hooks
export function useProdutos() {
  return useQuery({
    queryKey: QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await api.products.list()
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProduto(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.products.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useSearchProdutos(nome: string) {
  return useQuery({
    queryKey: QUERY_KEYS.search(nome),
    queryFn: async () => {
      const response = await api.products.searchByName(nome)
      return response.data
    },
    enabled: nome.length > 2, // Only search if at least 3 characters
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  })
}

// Mutations
export function useCreateProduto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Products.CreateRequest) => {
      const response = await api.products.create(data)
      return response.data
    },
    onSuccess: (newProduto) => {
      // Update the produtos list cache
      queryClient.setQueryData(QUERY_KEYS.lists(), (old: Produto[] = []) => {
        return [...old, newProduto]
      })

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })

      toast.success('Produto criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar produto: ' + error.message)
    },
  })
}

export function useUpdateProduto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Products.UpdateRequest }) => {
      const response = await api.products.update(id, data)
      return response.data
    },
    onSuccess: (updatedProduto) => {
      // Update the produtos list cache
      queryClient.setQueryData(QUERY_KEYS.lists(), (old: Produto[] = []) => {
        return old.map((produto) =>
          produto.id === updatedProduto.id ? updatedProduto : produto
        )
      })

      // Update the individual produto cache
      queryClient.setQueryData(QUERY_KEYS.detail(updatedProduto.id), updatedProduto)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })

      toast.success('Produto atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar produto: ' + error.message)
    },
  })
}

export function useDeleteProduto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from produtos list cache
      queryClient.setQueryData(QUERY_KEYS.lists(), (old: Produto[] = []) => {
        return old.filter((produto) => produto.id !== deletedId)
      })

      // Remove individual produto cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(deletedId) })

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })

      toast.success('Produto excluído com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir produto: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as produtosQueryKeys }
