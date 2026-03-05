import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/upload"];

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    const token =
      req.cookies.get("sb-access-token")?.value ||
      req.cookies.get("sb-refresh-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
