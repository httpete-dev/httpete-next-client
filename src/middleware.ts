import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from "axios";
import { authConfig } from "./server/auth/config";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: authConfig.secret });

  const protectedPaths = ["/dashboard", "/profile"];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  console.log(request.nextUrl);
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  else if (token && (request.nextUrl.pathname.endsWith('/register') || request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/forgot-password'))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  else if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '') {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
