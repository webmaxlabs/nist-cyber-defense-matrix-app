import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSafeRedirectPath } from '@/lib/utils/safe-redirect'
import { logSecurityEvent } from '@/lib/utils/security-logger'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'signup' | 'magiclink' | 'email'
  const rawNext = searchParams.get('next')
  const next = getSafeRedirectPath(rawNext)

  // Log if redirect was sanitized (potential open redirect attempt)
  if (rawNext && rawNext !== next) {
    logSecurityEvent({
      type: 'invalid_redirect',
      message: 'Blocked open redirect attempt in auth confirm',
      path: '/auth/confirm',
      metadata: { attempted: rawNext },
    })
  }

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_error`)
}
