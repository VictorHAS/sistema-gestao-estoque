"use client"

import React, { createContext, useContext, ReactNode, useState, useLayoutEffect } from "react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, apiClient } from "./api/client"

export interface User {
  id: string
  nome: string
  email: string
  cargo: "ADMIN" | "GERENTE" | "FUNCIONARIO"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth API functions
const authApi = {
  login: api.auth.login,
  getCurrentUser: api.auth.getMe,
  logout: () => {
    // Clear auth token from client
    apiClient.clearAuthToken()
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize token synchronously during render when possible
  const [hasToken, setHasToken] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("auth_token")
      if (token) {
        // Set token immediately in the API client
        apiClient.setAuthToken(token)
        return true
      }
    }
    return false
  })

  // Use useLayoutEffect to ensure synchronous execution before any render
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("auth_token")
      if (token && !hasToken) {
        apiClient.setAuthToken(token)
        setHasToken(true)
      }
    }
    setIsInitialized(true)
  }, [hasToken])

  // Query to get current user - only runs when properly initialized
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser()
      return response.data
    },
    enabled: isInitialized && hasToken, // Only run when fully initialized and has token
    retry: (failureCount, error: Error & { status?: number }) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) {
        return false
      }
      return failureCount < 2
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus to avoid extra requests
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authApi.login({
        email,
        senha: password // Backend expects 'senha' not 'password'
      })
      return response.data
    },
    onSuccess: (response) => {
      if (response.token && response.usuario) {
        // Store token in localStorage first
        localStorage.setItem("auth_token", response.token)
        localStorage.setItem("auth_user", JSON.stringify(response.usuario))

        // Set token in API client
        apiClient.setAuthToken(response.token)

        // Update state
        setHasToken(true)

        // Store user in React Query cache
        queryClient.setQueryData(['auth', 'currentUser'], response.usuario)
      }
    },
    onError: () => {
      // Clear any stored auth data on login failure
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
      setHasToken(false)
      authApi.logout()
      queryClient.removeQueries({ queryKey: ['auth'] })
    },
  })

  // Logout function
  const logout = () => {
    // Clear React Query cache
    queryClient.removeQueries({ queryKey: ['auth'] })

    // Update state
    setHasToken(false)

    // Clear localStorage and API client
    authApi.logout()
  }

  // Handle login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password })
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Clear queries on auth error
  React.useEffect(() => {
    if (error && (error as Error & { status?: number })?.status === 401) {
      logout()
    }
  }, [error])

  const isAuthenticated = !!user && !error

  return (
    <AuthContext.Provider value={{
      user: user || null,
      login,
      logout,
      isLoading: !isInitialized || (isLoading && hasToken) || loginMutation.isPending,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
