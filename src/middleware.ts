import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || "your-secret-key"
);

const protectedRoutes = ["/dashboard"];


async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  console.log("Middleware running for:", pathname);
  console.log("Refresh token exists:", !!refreshToken);

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  if (!refreshToken) {
    if (isProtectedRoute) {
      console.log("No refresh token, redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  const isRefreshTokenValid = await verifyToken(refreshToken);

  if (!isRefreshTokenValid) {
    console.log("Invalid refresh token, redirecting to sign-in");
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  if (isRefreshTokenValid) {
    if (pathname === "/sign-in" || pathname === "/sign-up") {
      console.log("User already authenticated, redirecting to dashboard");
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public|images).*)"],
};
