import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "client";

const roleDashboardMap: Record<Role, string> = {
  admin: "/admin/dashboard",
  client: "/client/dashboard",
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
};

const getRoleFromToken = (token?: string | null): Role | null => {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const decoded = decodeBase64Url(payload);
    const data = JSON.parse(decoded);
    return data?.role ?? data?.user?.role ?? null;
  } catch {
    return null;
  }
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = getRoleFromToken(token);

  const isAuthPage = pathname === "/login";
  if (isAuthPage && role) {
    return NextResponse.redirect(new URL(roleDashboardMap[role], request.url));
  }

  const isAdminArea = pathname.startsWith("/admin");
  const isClientArea = pathname.startsWith("/client");

  if (isAdminArea || isClientArea) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (isAdminArea && role !== "admin") {
      const target = role ? roleDashboardMap[role] : "/login";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (isClientArea && role !== "client") {
      const target = role ? roleDashboardMap[role] : "/login";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (pathname === "/client" || pathname === "/client/") {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    }
  }
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/client/:path*"],
};
