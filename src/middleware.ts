import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from "axios";
import { authConfig } from "./server/auth/config";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: authConfig.secret });


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
