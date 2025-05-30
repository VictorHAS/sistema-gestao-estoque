"use client"

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// Import AuthGuard with no SSR to prevent hydration errors
const AuthGuard = dynamic(() => import('./auth-guard').then(mod => ({ default: mod.AuthGuard })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
})

interface AuthGuardWrapperProps {
  children: ReactNode
}

export function AuthGuardWrapper({ children }: AuthGuardWrapperProps) {
  return <AuthGuard>{children}</AuthGuard>
}
