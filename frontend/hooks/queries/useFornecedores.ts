"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Fornecedor, type Suppliers } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['fornecedores'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
}

// Hooks
export function useFornecedores() {
  return useQuery({
    queryKey: QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await api.suppliers.list()
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useFornecedor(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.suppliers.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

// Mutations
export function useCreateFornecedor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Suppliers.CreateRequest) => {
      const response = await api.suppliers.create(data)
      return response.data
    },
    onSuccess: (newFornecedor) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Fornecedor[] | undefined) => {
          if (!old) return [newFornecedor]
          return [...old, newFornecedor]
        }
      )

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      toast.success('Fornecedor criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar fornecedor: ' + error.message)
    },
  })
}

export function useUpdateFornecedor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Suppliers.UpdateRequest }) => {
      const response = await api.suppliers.update(id, data)
      return response.data
    },
    onSuccess: (updatedFornecedor) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Fornecedor[] | undefined) => {
          if (!old) return [updatedFornecedor]
          return old.map((fornecedor) =>
            fornecedor.id === updatedFornecedor.id ? updatedFornecedor : fornecedor
          )
        }
      )

      queryClient.setQueryData(QUERY_KEYS.detail(updatedFornecedor.id), updatedFornecedor)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })
      toast.success('Fornecedor atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar fornecedor: ' + error.message)
    },
  })
}

export function useDeleteFornecedor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.suppliers.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Fornecedor[] | undefined) => {
          if (!old) return []
          return old.filter((fornecedor) => fornecedor.id !== deletedId)
        }
      )

      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      toast.success('Fornecedor excluído com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir fornecedor: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as fornecedoresQueryKeys }
