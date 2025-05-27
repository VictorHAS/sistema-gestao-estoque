"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    nome: "Admin Sistema",
    email: "admin@sistema.com",
    cargo: "ADMIN"
  },
  {
    id: "2",
    nome: "Maria Silva",
    email: "maria@sistema.com",
    cargo: "GERENTE"
  },
  {
    id: "3",
    nome: "João Santos",
    email: "joao@sistema.com",
    cargo: "FUNCIONARIO"
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

    const foundUser = mockUsers.find(u => u.email === email)

    if (foundUser && password === "123456") { // Mock password for all users
      setUser(foundUser)
      localStorage.setItem("auth_user", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
