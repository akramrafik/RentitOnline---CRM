import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// @ts-ignore
import { getUser } from "./lib/api";

export async function middleware(req: NextRequest) {
  let token = req.cookies.get("auth_token");
  if (req.nextUrl.pathname === "/") {
    if (token?.value) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (req.nextUrl.pathname === "/login") {
    if (token?.value) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // If no session cookie and trying to access the dashboard, redirect to login
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token?.value) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}
