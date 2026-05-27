import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getLegacyDestination } from "@/lib/legacy-path-map";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const legacy = getLegacyDestination(currentPath);

  // Avoid redirecting if we are already at the destination
  if (legacy && legacy !== currentPath && legacy !== currentPath + "/" && currentPath !== legacy + "/") {
    if (legacy.startsWith("http")) {
      return NextResponse.redirect(new URL(legacy), 301);
    }
    const url = request.nextUrl.clone();
    url.pathname = legacy;
    return NextResponse.redirect(url, 301);
  }

  if (currentPath.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      const login = new URL("/login", request.url);
      login.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
