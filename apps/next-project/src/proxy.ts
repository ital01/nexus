import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  console.log('Proxying request to /home', request);
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: '/home',
};
