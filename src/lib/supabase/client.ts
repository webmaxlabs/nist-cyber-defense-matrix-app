import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        // Disable navigator.locks to prevent deadlocks between concurrent
        // auth calls (auth-provider + actions). The middleware already
        // verifies JWTs server-side on every request.
        lock: async <R>(_name: string, _acquireTimeout: number, fn: () => Promise<R>): Promise<R> => {
          return await fn()
        },
      },
    }
  )
}
