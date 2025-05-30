"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useClientOnly } from "@/hooks/useClientOnly"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const mounted = useClientOnly()

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [mounted, isAuthenticated, isLoading, router])

  // Show loading during SSR and initial hydration
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not authenticated after mounting, show nothing (redirect will handle)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
