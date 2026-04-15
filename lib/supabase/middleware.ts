import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: do not add code between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /dashboard routes — redirect unauthenticated users to login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Edge-layer: Add rate-limit policy headers on /api/tools/* requests.
  // Actual enforcement happens server-side in each route handler via usage_tracking.
  // These headers inform clients of the rate-limit policy before the DB check.
  if (request.nextUrl.pathname.startsWith('/api/tools/')) {
    const TOOL_LIMITS: Record<string, number> = {
      humanizer: 5,
      'geo-checker': 3,
      'niche-scorer': 3,
    }
    const slug = request.nextUrl.pathname.split('/api/tools/')[1]?.split('/')[0] ?? ''
    const limit = TOOL_LIMITS[slug] ?? 3

    supabaseResponse.headers.set('X-RateLimit-Limit', String(limit))
    supabaseResponse.headers.set('X-RateLimit-Policy', 'free-daily')
    supabaseResponse.headers.set('X-Tool-Slug', slug)
  }

  return supabaseResponse
}
