import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSafeRedirectPath } from '@/lib/utils/safe-redirect'
import { logSecurityEvent } from '@/lib/utils/security-logger'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next')
  const next = getSafeRedirectPath(rawNext)

  // Log if redirect was sanitized (potential open redirect attempt)
  if (rawNext && rawNext !== next) {
    logSecurityEvent({
      type: 'invalid_redirect',
      message: 'Blocked open redirect attempt in auth callback',
      path: '/auth/callback',
      metadata: { attempted: rawNext },
    })
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('Auth callback: code exchange failed', {
      error: error.message,
      status: error.status,
    })
    logSecurityEvent({
      type: 'auth_failure',
      message: 'OAuth code exchange failed',
      path: '/auth/callback',
      metadata: { error: error.message, status: error.status },
    })
  } else {
    console.error('Auth callback: no code parameter in URL')
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
