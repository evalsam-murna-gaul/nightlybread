// middleware.ts
// Minimal middleware - auth is handled client-side to avoid session lock conflicts
import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Just pass through - no session reading here
  return NextResponse.next();
}

export const config = {
  // Only run on page routes, never on API routes or static files
  matcher: [
    '/admin/:path*',
    '/orders/:path*',
  ],
};