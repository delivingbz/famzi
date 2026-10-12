// FAMZI FILE GUIDE: Issues a replacement verification token for an unverified admin.
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashResetToken, isValidAdminEmail, normalizeAdminEmail } from "@/lib/admin-auth";
import { getAdminEmailConfig, sendAdminEmail } from "@/lib/admin-email";

export async function POST(request: Request) {
  let email: unknown;
  try { ({ email } = await request.json()); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!isValidAdminEmail(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  const emailConfig = getAdminEmailConfig();
  if (!emailConfig) return NextResponse.json({ error: "Email delivery is not configured. Ask the site administrator to check it." }, { status: 503 });
  const admin = await prisma.adminUser.findUnique({ where: { email: normalizeAdminEmail(email) }, select: { id: true, email: true, emailVerifiedAt: true } });
  if (admin && !admin.emailVerifiedAt) {
    const token = randomBytes(32).toString("base64url");
    const tokenHash = hashResetToken(token);
    await prisma.adminEmailVerification.deleteMany({ where: { adminUserId: admin.id } });
    await prisma.adminEmailVerification.create({ data: { adminUserId: admin.id, tokenHash, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } });
    const verifyUrl = new URL(`/admin-verify-email?token=${encodeURIComponent(token)}`, emailConfig.origin).toString();
    const emailResult = await sendAdminEmail(admin.email, "Verify your FAMZI admin email", `<p>Use the link below to verify your FAMZI admin email address.</p><p><a href="${verifyUrl}">Verify your email address</a></p><p>This link expires in 24 hours and can only be used once.</p>`);
    if (!emailResult.ok) {
      await prisma.adminEmailVerification.deleteMany({ where: { tokenHash } });
      return NextResponse.json({ error: `The verification email could not be sent. ${emailResult.error || "Check the email provider configuration."}` }, { status: 502 });
    }
  }
  return NextResponse.json({ success: true, message: "If that address has an unverified admin account, a new verification link will be sent." });
}
