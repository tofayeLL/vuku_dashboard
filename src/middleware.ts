import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;

  console.log(role, token);

  if (!token) {
    const destination = `/login?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(new URL(destination, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/admin_Management",
    "/admin/staff_Management",
    "/admin/responders_Management",
    "/admin/cases",
    "/admin/locations",
    "/admin/training",
    "/message",
    "/settings",
  ],
};
