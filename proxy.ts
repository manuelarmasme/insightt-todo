import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Helper function to extract userId from AWS Cognito JWT token
 * Following Next.js best practices for optimistic auth checks in proxy
 */
function getUserIdFromCookies(request: NextRequest): string | null {
  const cookies = request.cookies.getAll();
  
  // Find the idToken cookie from AWS Cognito
  const idTokenCookie = cookies.find(
    (cookie) =>
      cookie.name.startsWith("CognitoIdentityServiceProvider.") &&
      cookie.name.includes(".idToken")
  );

  if (!idTokenCookie) {
    return null;
  }

  try {
    // JWT tokens are base64url encoded and have 3 parts separated by dots
    const tokenParts = idTokenCookie.value.split(".");
    if (tokenParts.length !== 3) {
      return null;
    }

    // Decode the payload (second part of JWT)
    const payload = JSON.parse(
      Buffer.from(tokenParts[1], "base64").toString("utf-8")
    );

    // AWS Cognito uses 'sub' as the unique user identifier
    return payload.sub || null;
  } catch {
    // If decoding fails, return null
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if user has authentication tokens (optimistic check)
  // AWS Amplify stores auth tokens in cookies with specific prefixes
  const cookies = request.cookies.getAll();
  const hasAuthToken = cookies.some(
    (cookie) =>
      cookie.name.startsWith("CognitoIdentityServiceProvider.") &&
      (cookie.name.includes(".idToken") || cookie.name.includes(".accessToken"))
  );

  // 2. Extract userId from session cookie if authenticated
  const userId = hasAuthToken ? getUserIdFromCookies(request) : null;

  // 3. Define public and protected routes
  const publicRoutes = ["/login", "/signup", "/verify-email"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Protected routes: any route that isn't root, public, or static assets
  const isProtectedRoute = 
    pathname !== "/" && 
    !isPublicRoute && 
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api");

  const isRootPath = pathname === "/";

  // 4. Redirect authenticated users away from public auth pages
  if (hasAuthToken && userId && isPublicRoute) {
    return NextResponse.redirect(new URL(`/${userId}`, request.url));
  }

  // 5. Redirect unauthenticated users trying to access protected routes
  if (!hasAuthToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 6. Redirect authenticated users from root to their user page
  if (hasAuthToken && userId && isRootPath) {
    return NextResponse.redirect(new URL(`/${userId}`, request.url));
  }

  // 7. Ensure authenticated users can only access their own user route
  if (hasAuthToken && userId && isProtectedRoute) {
    const requestedUserId = pathname.split("/")[1];
    if (requestedUserId && requestedUserId !== userId) {
      // Redirect to their own user page if trying to access another user's route
      return NextResponse.redirect(new URL(`/${userId}`, request.url));
    }
  }

  // 8. Allow unauthenticated users to view root page
  if (!hasAuthToken && isRootPath) {
    return NextResponse.next();
  }

  // 9. Allow the request to proceed
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
