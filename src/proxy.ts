import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export async function proxy(request: NextRequest) {
  let { pathname, search } = request.nextUrl;

  // Ubah %20 atau spasi dalam pathname dan search query menjadi underscore "_".
  pathname = pathname.replace(/%20| /g, '_');
  search = search.replace(/%20| /g, '_');

  const trailingPaths = pathname.split('/');

  // Jika path TEPAT HANYA '/dasbor' atau '/dasbor/'
  if (trailingPaths[1] === 'dasbor') {
    const lantai = trailingPaths[2];
    if (lantai !== "lantai_6" && lantai !== "lantai_7" && lantai !== "lantai_8"){
      // Redirect ke /dasbor/bla
      return NextResponse.redirect(new URL('/dasbor/lantai_6', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dasbor/:path*',
}