import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "./lib/auth";

// Define routes that require authentication
const protectedRoutes = ["/api/protected", "/api/user"];

// Define routes that should redirect authenticated users (like login/register pages)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get the authorization header
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  // Verify token if present
  const payload = token ? verifyToken(token) : null;
  const isAuthenticated = !!payload;

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // Return 401 for API routes
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }

      // Redirect to login for regular pages
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Add user info to headers for API routes
    if (pathname.startsWith("/api/") && payload) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-user-name", payload.name);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  if (isAuthRoute && isAuthenticated) {
    // Redirect authenticated users away from login/register pages
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
