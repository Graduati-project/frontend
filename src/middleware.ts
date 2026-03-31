import { NextResponse } from "next/server";

function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      payloadB64 + "=".repeat((4 - (payloadB64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    const payload = JSON.parse(json);
    const exp = payload?.exp;
    if (typeof exp !== "number") return false; // token exists, but can't validate exp
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function middleware(request: any) {
  const url = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isProtected =
    url.pathname.startsWith("/patient") ||
    url.pathname.startsWith("/doctor") ||
    url.pathname.startsWith("/admin");

  if (!isProtected) return NextResponse.next();

  const missing = !token;
  const expired = token ? isJwtExpired(token) : true;

  if (missing || expired) {
    const next = `${url.pathname}${url.search}`;
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*"],
};

