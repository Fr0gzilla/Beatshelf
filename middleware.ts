import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware is minimal now — auth is handled client-side with localStorage
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
