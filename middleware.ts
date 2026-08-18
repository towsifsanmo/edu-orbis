import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Verify the JWT token
  const payload = token ? await verifyJWT(token) : null;
  const isAuthenticated = !!payload;
  const isAdmin = payload?.role === "admin";

  const adminApiEndpoints = [
    "/api/dashboard",
    "/api/create-user",
    "/api/create-plan",
    "/api/edit-plan",
    "/api/delete-plan",
  ];

  const isApiAdminRoute =
    pathname.startsWith("/api/(admin)") ||
    pathname.startsWith("/api/admin") ||
    adminApiEndpoints.some((endpoint) => pathname.startsWith(endpoint));

  const isAdminPageRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";

  // 1. Protect Admin API routes
  if (isApiAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।",
        },
        { status: 401 }
      );
    }

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "অ্যাক্সেস নিষিদ্ধ। শুধুমাত্র অ্যাডমিন প্রবেশ করতে পারবেন।",
        },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 2. Protect Admin Web Page routes
  if (isAdminPageRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token && !payload) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }
      return response;
    }

    if (!isAdmin) {
      // Normal user attempted to access admin area -> redirect to regular user dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 3. Protect User Dashboard routes
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token && !payload) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }
      return response;
    }

    return NextResponse.next();
  }

  // 4. Redirect already authenticated users away from /login
  if (isLoginRoute && isAuthenticated) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/dashboard/:path*",
    "/api/create-user/:path*",
    "/api/create-plan/:path*",
    "/api/edit-plan/:path*",
    "/api/delete-plan/:path*",
    "/api/admin/:path*",
    "/api/\\(admin\\)/:path*",
    "/login",
  ],
};

