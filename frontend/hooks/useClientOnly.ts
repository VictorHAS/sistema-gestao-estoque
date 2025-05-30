import { useEffect, useState } from 'react'

/**
 * Hook to ensure components only render on the client side
 * Prevents hydration mismatches for client-only content
 */
export function useClientOnly() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
