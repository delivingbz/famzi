// FAMZI FILE GUIDE: Authenticates admin credentials and creates or clears the session cookie.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, createAdminSession, isValidAdminEmail, normalizeAdminEmail, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return NextResponse.json({ error: "Admin sign-in is not configured on the server." }, { status: 503 });
  }
  let email: unknown;
  let password: unknown;
  try { ({ email, password } = await request.json()); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!isValidAdminEmail(email) || typeof password !== "string") {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }
  const admin = await prisma.adminUser.findUnique({ where: { email: normalizeAdminEmail(email) } });
  if (!admin || !(await verifyAdminPassword(password, admin.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }
  if (!admin.emailVerifiedAt) {
    return NextResponse.json({ error: "Verify your email using the link we sent before signing in." }, { status: 403 });
  }
  const session = createAdminSession(admin.id, admin.sessionVersion);
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, session.value, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/",
    expires: new Date(session.expiresAt * 1000),
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0,
  });
  return response;
}
