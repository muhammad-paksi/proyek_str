import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Jika path TEPAT HANYA '/dasbor' atau '/dasbor/'
  if (pathname === '/dasbor' || pathname === '/dasbor/') {
    // Redirect ke /dasbor/bla
    return NextResponse.redirect(new URL('/dasbor/lantai_6', request.url));
  }

  // Jika ada ekornya (misal: /dasbor/profile), biarkan lewat
  return NextResponse.next();
  
  // return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/dasbor/:path*',
}