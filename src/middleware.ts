import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super_secret_key_12345"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  let payload: any = null;
  if (token) {
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch (err) {
      // Invalid/expired token
    }
  }

  // If user is already logged in and visiting auth pages or root page, redirect to /dasbor/lantai_6
  if (payload) {
    if (pathname.startsWith('/akun/') || pathname === '/') {
      return NextResponse.redirect(new URL('/dasbor/lantai_6', request.url));
    }
  }

  // Check if route is public
  const isDasborManage = pathname.startsWith('/dasbor/manage');
  const isDasborPublic = pathname.startsWith('/dasbor') && !isDasborManage;

  const isPublic =
    pathname.startsWith('/akun/') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next/') ||
    pathname === '/' ||
    pathname.includes('.') ||
    isDasborPublic;

  // Unauthenticated users accessing protected routes -> redirect to /akun/masuk
  if (!payload && !isPublic) {
    return NextResponse.redirect(new URL('/akun/masuk', request.url));
  }

  // RBAC Authorization Check for authenticated users
  if (payload) {
    const role = payload.role as string;

    if (role !== 'super_admin') {
      if (role === 'mahasiswa') {
        if (isDasborManage || (!pathname.startsWith('/dasbor') && !pathname.startsWith('/my_class'))) {
          return NextResponse.redirect(new URL('/dasbor/lantai_6', request.url));
        }
      } else if (role === 'staf') {
        if (!pathname.startsWith('/dasbor') && !pathname.startsWith('/manage_agenda')) {
          return NextResponse.redirect(new URL('/dasbor/lantai_6', request.url));
        }
      } else if (role === 'admin' || role === 'admin_jurusan') {
        if (
          isDasborManage ||
          (!pathname.startsWith('/dasbor') &&
            !pathname.startsWith('/verifikasi_kelas') &&
            !pathname.startsWith('/manage_users'))
        ) {
          return NextResponse.redirect(new URL('/dasbor/lantai_6', request.url));
        }
      }
    }
  }

  // Floor redirection logic for /dasbor routes (both public & protected)
  const trailingPaths = pathname.split('/');
  if (trailingPaths[1] === 'dasbor') {
    if (trailingPaths[2] === 'manage') {
      const lantai = trailingPaths[3];
      if (lantai !== "lantai_6" && lantai !== "lantai_7" && lantai !== "lantai_8") {
        return NextResponse.redirect(new URL('/dasbor/manage/lantai_6', request.url));
      }
    } else {
      const lantai = trailingPaths[2];
      if (lantai !== "lantai_6" && lantai !== "lantai_7" && lantai !== "lantai_8") {
        return NextResponse.redirect(new URL('/dasbor/lantai_6', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
