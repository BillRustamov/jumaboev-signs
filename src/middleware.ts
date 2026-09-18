import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Apex usprint.app always lands on the www shop. */
export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0];
  if (host === "usprint.app") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "www.usprint.app";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
