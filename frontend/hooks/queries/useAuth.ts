"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, type Auth } from '@/lib/api'

// Query Keys
const QUERY_KEYS = {
  all: ['auth'] as const,
  currentUser: () => [...QUERY_KEYS.all, 'current-user'] as const,
}

// Hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.currentUser(),
    queryFn: async () => {
      const response = await api.auth.getMe()
      return response // Auth endpoints retornam dados diretamente
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: Error & { status?: number }) => {
      // Don't retry on 401 (unauthorized)
      if (error?.status === 401) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Mutations
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: Auth.LoginRequest) => {
      const response = await api.auth.login(credentials)
      return response // Auth endpoints retornam dados diretamente
    },
    onSuccess: (loginData) => {
      // Set current user in cache
      queryClient.setQueryData(QUERY_KEYS.currentUser(), loginData.data.usuario)

      // Store user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(loginData.data.usuario))
        localStorage.setItem('auth_token', loginData.data.token)
      }

      toast.success('Login realizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao fazer login: ' + error.message)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      // Clear all query cache
      queryClient.clear()

      // Remove user from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
      }

      toast.success('Logout realizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao fazer logout: ' + error.message)
    },
  })
}

// Export query keys for external use
export { QUERY_KEYS as authQueryKeys }
