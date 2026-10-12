// FAMZI FILE GUIDE: Creates the first admin account and sends its email verification link.
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashAdminPassword, hashResetToken, isValidAdminEmail, normalizeAdminEmail, validPassword } from "@/lib/admin-auth";
import { getAdminEmailConfig, sendAdminEmail } from "@/lib/admin-email";

function matchesBootstrapPassword(submitted: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  return timingSafeEqual(createHash("sha256").update(submitted).digest(), createHash("sha256").update(configured).digest());
}

export async function GET() {
  const available = Boolean(process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32)
    && !(await prisma.adminUser.findFirst({ select: { id: true } }));
  return NextResponse.json({ available });
}

export async function POST(request: Request) {
  let bootstrapPassword: unknown, email: unknown, password: unknown;
  try { ({ bootstrapPassword, email, password } = await request.json()); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof bootstrapPassword !== "string" || !matchesBootstrapPassword(bootstrapPassword)) {
    return NextResponse.json({ error: "Setup could not be verified." }, { status: 401 });
  }
  if (!isValidAdminEmail(email) || !validPassword(password)) {
    return NextResponse.json({ error: "Enter a valid email and a password with at least 12 characters." }, { status: 400 });
  }
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return NextResponse.json({ error: "Admin sign-in is not configured on the server." }, { status: 503 });
  }
  const emailConfig = getAdminEmailConfig();
  if (!emailConfig) return NextResponse.json({ error: "Email verification is not configured. Set RESEND_API_KEY, ADMIN_EMAIL_FROM, and APP_URL first." }, { status: 503 });
  const verificationToken = randomBytes(32).toString("base64url");
  const tokenHash = hashResetToken(verificationToken);
  const normalizedEmail = normalizeAdminEmail(email);
  let adminId: number;
  try {
    const passwordHash = await hashAdminPassword(password);
    const admin = await prisma.$transaction(async (transaction) => {
      if (await transaction.adminUser.count() > 0) return false;
      const createdAdmin = await transaction.adminUser.create({ data: { email: normalizedEmail, passwordHash } });
      await transaction.adminEmailVerification.create({
        data: { adminUserId: createdAdmin.id, tokenHash, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      });
      return createdAdmin;
    }, { isolationLevel: "Serializable" });
    if (!admin) return NextResponse.json({ error: "An admin account has already been created." }, { status: 409 });
    adminId = admin.id;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That email is already registered." }, { status: 409 });
    }
    if (error && typeof error === "object" && "code" in error && ["P2034", "P2002"].includes(String(error.code))) return NextResponse.json({ error: "An admin account has already been created, or that email is already in use." }, { status: 409 });
    throw error;
  }
  const verifyUrl = new URL(`/admin-verify-email?token=${encodeURIComponent(verificationToken)}`, emailConfig.origin).toString();
  const emailResult = await sendAdminEmail(normalizedEmail, "Verify your FAMZI admin email", `<p>Your FAMZI admin account is almost ready.</p><p><a href="${verifyUrl}">Verify your email address</a></p><p>This link expires in 24 hours and can only be used once. If you did not create this account, ignore this email.</p>`);
  if (!emailResult.ok) {
    await prisma.adminUser.delete({ where: { id: adminId } });
    return NextResponse.json({ error: `The verification email could not be sent. ${emailResult.error || "Check the email provider configuration and try again."}` }, { status: 502 });
  }
  return NextResponse.json({ success: true, message: "Account created. Check your email and open the verification link before signing in." });
}
