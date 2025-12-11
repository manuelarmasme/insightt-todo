import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has authentication tokens
  // AWS Amplify stores auth tokens in cookies with specific prefixes
  const cookies = request.cookies.getAll();
  const hasAuthToken = cookies.some(
    (cookie) =>
      cookie.name.startsWith("CognitoIdentityServiceProvider.") &&
      (cookie.name.includes(".idToken") || cookie.name.includes(".accessToken"))
  );

  // Public routes (accessible without authentication)
  const publicRoutes = ["/login", "/signup", "/verify-email"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Protected routes (require authentication) - routes inside [user] folder
  const isProtectedRoute = pathname.startsWith("/[user]");

  // Root path handling
  const isRootPath = pathname === "/";

  // If user is authenticated and tries to access auth pages, redirect to user page
  if (hasAuthToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/[user]", request.url));
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!hasAuthToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and on root, redirect to user page
  if (hasAuthToken && isRootPath) {
    return NextResponse.redirect(new URL("/[user]", request.url));
  }

  // If user is not authenticated and on root, allow access (show root page)
  if (!hasAuthToken && isRootPath) {
    return NextResponse.next();
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
