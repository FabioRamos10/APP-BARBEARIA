import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE_NAME } from "@/lib/auth/token";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/registro",
  "/esqueci-senha",
  "/redefinir-senha",
  "/teste",
  "/sobre-nos",
];

const AUTH_ENTRY_PATHS = ["/login", "/registro", "/esqueci-senha", "/redefinir-senha"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function isAuthEntryPath(pathname: string): boolean {
  return AUTH_ENTRY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function readToken(request: NextRequest): string | undefined {
  const raw = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  if (!raw) {
    return undefined;
  }
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = readToken(request);

  if (pathname === "/app" || pathname.startsWith("/app/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (token && isAuthEntryPath(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api-backend).*)",
  ],
};
