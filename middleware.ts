import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Role-based middleware with NextAuth JWT integration
 * Protects routes based on authentication status and user roles
 */
export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin route protection
    if (pathname.startsWith("/admin")) {
      if (!token?.role || token.role !== "admin") {
        // Redirect non-admin users to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Analytics route protection (admin only)
    if (pathname.startsWith("/dashboard/analytics")) {
      if (!token?.permissions?.canViewAnalytics) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // User management route protection (admin only)
    if (pathname.startsWith("/dashboard/users")) {
      if (!token?.permissions?.canManageUsers) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Profile editing protection
    if (pathname.startsWith("/profile/edit")) {
      if (!token?.permissions?.canEditProfile) {
        return NextResponse.redirect(new URL("/profile", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes - no authentication required
        const publicRoutes = ["/", "/login"]
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // Protected routes - require authentication
        const protectedRoutes = [
          "/dashboard",
          "/profile", 
          "/admin",
          "/api/user"
        ]
        
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        )

        if (isProtectedRoute) {
          // Must be authenticated and have active account
          return !!token && token.isActive !== false
        }

        // Default: allow access
        return true
      },
    },
  }
)

/**
 * Middleware configuration
 * Defines which routes should be processed by the middleware
 */
export const config = {
  matcher: [
    // Protected dashboard routes
    "/dashboard/:path*",
    // Profile routes
    "/profile/:path*", 
    // Admin routes
    "/admin/:path*",
    // API routes that need auth
    "/api/user/:path*",
  ]
} 