import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }
  
  // Check if pathname starts with /en or /zh
  const pathnameIsMissingLocale = !pathname.startsWith('/en') && !pathname.startsWith('/zh');
  
  if (pathnameIsMissingLocale) {
    // Get locale from cookie or Accept-Language header
    let locale = 'en';
    
    const cookieLocale = request.cookies.get('locale')?.value;
    if (cookieLocale === 'en' || cookieLocale === 'zh') {
      locale = cookieLocale;
    } else {
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage?.toLowerCase().startsWith('zh')) {
        locale = 'zh';
      }
    }
    
    // Redirect to the locale prefixed path
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
