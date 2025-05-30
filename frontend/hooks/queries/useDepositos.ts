"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Deposito, type Warehouses } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['depositos'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
}

// Hooks
export function useDepositos() {
  return useQuery({
    queryKey: QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await api.warehouses.list()
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - depositos don't change often
  })
}

export function useDeposito(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await api.warehouses.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

// Mutations
export function useCreateDeposito() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Warehouses.CreateRequest) => {
      const response = await api.warehouses.create(data)
      return response.data
    },
    onSuccess: (newDeposito) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Deposito[] | undefined) => {
          if (!old) return [newDeposito]
          return [...old, newDeposito]
        }
      )

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      toast.success('Depósito criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar depósito: ' + error.message)
    },
  })
}

export function useUpdateDeposito() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Warehouses.UpdateRequest }) => {
      const response = await api.warehouses.update(id, data)
      return response.data
    },
    onSuccess: (updatedDeposito) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Deposito[] | undefined) => {
          if (!old) return [updatedDeposito]
          return old.map((deposito) =>
            deposito.id === updatedDeposito.id ? updatedDeposito : deposito
          )
        }
      )

      queryClient.setQueryData(QUERY_KEYS.detail(updatedDeposito.id), updatedDeposito)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })
      toast.success('Depósito atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar depósito: ' + error.message)
    },
  })
}

export function useDeleteDeposito() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.warehouses.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.lists() },
        (old: Deposito[] | undefined) => {
          if (!old) return []
          return old.filter((deposito) => deposito.id !== deletedId)
        }
      )

      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })

      // Also invalidate estoque related to this deposito
      queryClient.invalidateQueries({ queryKey: ['estoque'] })

      toast.success('Depósito excluído com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir depósito: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as depositosQueryKeys }
