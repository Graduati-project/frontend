import { NextResponse } from "next/server";

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadB64 + "=".repeat((4 - (payloadB64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload) return true;
    const exp = payload?.exp;
    if (typeof exp !== "number") return false; // token exists, but can't validate exp
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

function getRoleFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const role =
    payload.role ??
    payload.user?.role ??
    payload.data?.role ??
    payload.credentials?.role;
  return typeof role === "string" ? role.toLowerCase() : null;
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

  // Role guard: prevent staff token from opening patient/doctor dashboards, etc.
  const role = token ? getRoleFromToken(token) : null;
  if (role) {
    const p = url.pathname;
    const isPatientRoute = p.startsWith("/patient");
    const isDoctorRoute = p.startsWith("/doctor");
    const isAdminRoute = p.startsWith("/admin");

    const isAllowed =
      (isPatientRoute && role === "patient") ||
      (isDoctorRoute && role === "doctor") ||
      (isAdminRoute && role === "staff");

    if (!isAllowed) {
      // Redirect to the correct portal for this role.
      const dest =
        role === "patient"
          ? "/patient"
          : role === "doctor"
            ? "/doctor"
            : role === "staff"
              ? "/admin"
              : "/auth/login";

      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*"],
};

