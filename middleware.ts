// middleware.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from '@/lib/session';


const protectedRoutes = ["/admin", "/admin/invoices", "/admin/customers", "/admin/spaces", "/admin/spaces/add"];
const adminPublicRoutes = ["/admin/login"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.href;
    const isProtectedRoute = protectedRoutes.includes(path);
    // const isPublicRoute = path.endsWith(adminPublicRoutes);

    const cookie = (await cookies()).get("AdminSession")?.value;
    const session = await decrypt(cookie);

    // check if the user is logged, if not redirect to login
    // checking all the route under protectedRoutes
    if (matchingRoutesInList(path, protectedRoutes) && !session?.userId) {
        return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }

    // check if the user is logged, if yes redirect to admin
    // checking on all the route under adminPublicRoutes (eg login, register etc)
    if (matchingRoutesInList(path, adminPublicRoutes) && session?.userId) {
        return NextResponse.redirect(new URL("/admin", request.nextUrl));
    }

    return NextResponse.next();
}

function matchingRoutesInList(url: string, list: string[]) {
    const regex = new RegExp(`(${list.join('|')})$`);

    if (regex.test(url)) {
        return true;
    }
}
