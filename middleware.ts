import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    //const sessionCookie = req.cookies.get('laravel_session')?.value; // Get cookie value

    // if (!sessionCookie && req.nextUrl.pathname.startsWith('/dashboard')) {
    //     return NextResponse.redirect(new URL('/login', req.url));
    // }

    return NextResponse.next(); // Allow request to proceed
}

export const config = {
    matcher: ['/dashboard/:path*'],
};