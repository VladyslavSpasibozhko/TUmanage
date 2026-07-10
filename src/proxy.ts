import { verifiedSession } from "@/src/services/session";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;

  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  //remove
  const { ok, data } = await verifiedSession(sessionId);
  console.log({ ok, data });
  if (ok && data?.active) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};
