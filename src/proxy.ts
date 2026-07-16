import { NextRequest, NextResponse } from "next/server";
import { verifiedSession, refreshSession } from "@/src/services/session";
import { SESSION_COOKIE } from "@/src/app/api/_session";

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export async function proxy(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return redirectToLogin(request);
  }

  const verified = await verifiedSession(sessionId);
  if (!verified.ok || !verified.data.active) {
    return redirectToLogin(request);
  }

  if (!verified.data.refresh) {
    return NextResponse.next();
  }

  const refreshed = await refreshSession(sessionId);
  if (!refreshed.ok) {
    return redirectToLogin(request);
  }

  const response = NextResponse.next();
  response.cookies.set(SESSION_COOKIE, refreshed.data.id, {
    sameSite: "lax",
    expires: refreshed.data.expiredAt,
  });
  return response;
}

export const config = {
  matcher: ["/api/((?!v1/login|v1/register|v1/session/refresh).*)"],
};
