import { NextResponse } from "next/server"
import type { NextRequest } from "next/routing"

const protectedRoutes = ["/dashboard", "/upload", "/admin"]
const authRoutes = ["/auth/signin", "/auth/signup"]

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route))
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  const cookie = req.cookies.get("session")

  if (isAuthRoute) {
    // If already logged in, redirect to dashboard
    if (cookie) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  }

  if (isProtectedRoute) {
    if (!cookie) {
      // Store the intended path so we can redirect back after login
      const loginUrl = new URL("/auth/signin", req.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }

    // Verify the session cookie with the API
    const res = await fetch(`${req.nextUrl.origin}/api/auth/check`, {
      credentials: "include",
    })

    const data = await res.json()
    if (!data.loggedIn) {
      const loginUrl = new URL("/auth/signin", req.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}