// middleware.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from '@/lib/session';
import { adminSessionCookieName, userSessionCookieName } from './lib/constant';


const protectedAdminRoutes = ["/admin", "/admin/invoices", "/admin/customers", "/admin/spaces", "/admin/spaces/add"];
const publicAdminRoutes = ["/admin/login"];

const protectedUserRoutes = ["/user", "/user/invoices", "/user/bookings", "/user/checkout"];
const publicUserRoutes = ["/user/login", "/user/register"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.href;
    // await AdminSessionValid(path);
    // const path = request.nextUrl.href;
    // const isProtectedRoute = protectedAdminRoutes.includes(path);
    // const isPublicRoute = path.endsWith(adminPublicRoutes);

    const AdminCookie = (await cookies()).get(adminSessionCookieName)?.value;
    const AdminSession = await decrypt(AdminCookie);

    // check if the user is logged, if not redirect to login
    // checking all the route under protectedRoutes
    if (matchingRoutesInList(path, protectedAdminRoutes) && !AdminSession?.userId || (typeof AdminSession?.expiresAt === 'string' && new Date(AdminSession.expiresAt) < new Date())) {
        return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }

    // check if the user is logged, if yes redirect to admin
    // checking on all the route under publicAdminRoutes (eg login, register etc)
    if (matchingRoutesInList(path, publicAdminRoutes) && AdminSession?.userId) {
        return NextResponse.redirect(new URL("/admin", request.nextUrl));
    }

    const UserCookie = (await cookies()).get(userSessionCookieName)?.value;
    const UserSession = await decrypt(UserCookie);

    // check if the user is logged, if not redirect to login
    // checking all the route under protectedRoutes
    if (matchingRoutesInList(path, protectedUserRoutes) && !UserSession?.userId || (typeof UserSession?.expiresAt === 'string' && new Date(UserSession.expiresAt) < new Date())) {
        return NextResponse.redirect(new URL("/user/login", request.nextUrl));
    }

    // check if the user is logged, if yes redirect to admin
    // checking on all the route under publicAdminRoutes (eg login, register etc)
    if (matchingRoutesInList(path, publicUserRoutes) && UserSession?.userId) {
        return NextResponse.redirect(new URL("/user", request.nextUrl));
    }

    return NextResponse.next();
}

function matchingRoutesInList(url: string, list: string[]) {
    const regex = new RegExp(`(${list.join('|')})$`);

    if (regex.test(url)) {
        return true;
    }
}
