import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

const CACHE_CONTROL = {
  // Pages publiques statiques : cache agressif côté CDN + navigateur
  publicStatic: "public, s-maxage=3600, stale-while-revalidate=86400",
  // Pages semi-dynamiques (shop, produits) : revalidation fraîche
  publicSemiDynamic: "public, s-maxage=60, stale-while-revalidate=300",
  // API mutations : pas de cache
  noStore: "no-store, no-cache, must-revalidate, proxy-revalidate",
};

function getCacheHeader(pathname: string): string | null {
  // Assets Next.js internes
  if (pathname.startsWith("/_next/static/")) return CACHE_CONTROL.publicStatic;

  // Pages produits & catégories (ISR)
  if (
    pathname === "/" ||
    pathname === "/shop" ||
    pathname.startsWith("/shop/") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/category/") ||
    pathname === "/track"
  )
    return CACHE_CONTROL.publicSemiDynamic;

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth ──
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }
  }

  // ── Cache headers ──
  const response = NextResponse.next();
  const cacheHeader = getCacheHeader(pathname);
  if (cacheHeader) {
    response.headers.set("Cache-Control", cacheHeader);
  }

  // Sécurité : headers additionnels légers
  if (!isAdminRoute) {
    response.headers.set("X-Content-Type-Options", "nosniff");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
