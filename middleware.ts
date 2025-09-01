// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const someData = 'This is data from middleware';


    const headers = new Headers(request.headers);
    headers.set('x-current-path', request.nextUrl.pathname);
    headers.set('x-middleware-data', someData);
    // headers.set('x-custom-data', 'my-custom-value');

    return NextResponse.next({
        headers,
    });
}

export const config = {
    // matcher: [
    //     /*
    //      * Match all request paths except for the ones starting with:
    //      * - api (API routes)
    //      * - _next/static (static files)
    //      * - _next/image (image optimization files)
    //      * - favicon.ico (favicon file)
    //      */
    //     '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // ],

    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source:
                '/((?!api|_next/static|_next/image|media|fonts|favicon.ico|favicon.png).*)',
            missing: [
                // Exclude Server Actions
                { type: 'header', key: 'next-action' },
            ],
        },
    ],
};