// /lib/supabase/middleware.ts — Route protection + role-based redirects

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session token
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const PROTECTED = ['/dashboard', '/vendor', '/admin'];
  const isProtected = PROTECTED.some(r => pathname.startsWith(r));

  // Not authenticated → redirect to login
  if (isProtected && !user) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isProtected && user) {
    const { data: record } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = record?.role;

    // Admin route: only admins
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Vendor route: only vendors
    if (pathname.startsWith('/vendor') && role !== 'vendor' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Dashboard route: only organizers (and admins for convenience)
    if (pathname.startsWith('/dashboard') && role === 'vendor') {
      return NextResponse.redirect(new URL('/vendor', request.url));
    }

    // Vendor hasn't set up profile → redirect to setup (except if already there)
    if (
      role === 'vendor' &&
      pathname.startsWith('/vendor') &&
      !pathname.startsWith('/vendor/setup')
    ) {
      const { data: vendorProfile } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!vendorProfile) {
        return NextResponse.redirect(new URL('/vendor/setup', request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
