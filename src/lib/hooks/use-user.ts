'use client'

import { useAuth } from '@/providers/auth-provider'

export function useUser() {
  const { user, profile, loading } = useAuth()

  return {
    user,
    profile,
    loading,
    displayName: profile?.full_name || user?.email?.split('@')[0] || 'User',
    avatarUrl: profile?.avatar_url,
    email: user?.email || profile?.email,
  }
}
