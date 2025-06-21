import { withAuth } from "next-auth/middleware"

// Korumalı sayfalar için middleware
export default withAuth(
  function middleware(req) {
    // Her korumalı route erişiminde log tutuyoruz
    console.log("Korumalı sayfa erişimi:", req.nextUrl.pathname)
    console.log("Kullanıcı token:", req.nextauth.token ? "Var" : "Yok")
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Token varsa erişim izni ver
        if (token) {
          console.log("Token geçerli, erişim izni verildi:", pathname)
          return true
        }
        
        console.log("Token yok, erişim reddedildi:", pathname)
        return false
      },
    },
  }
)

// Hangi sayfalar korunacak
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*"
  ]
} 