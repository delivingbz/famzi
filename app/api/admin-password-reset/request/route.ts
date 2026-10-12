// FAMZI FILE GUIDE: Creates and emails a short-lived one-time password reset link.
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
  if (!isValidAdminEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const emailConfig = getAdminEmailConfig();
  if (!emailConfig) {
    return NextResponse.json({ error: "Password recovery is not configured. Ask the site administrator to configure email delivery." }, { status: 503 });
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: normalizeAdminEmail(email) }, select: { id: true, email: true } });
  if (admin) {
    const token = randomBytes(32).toString("base64url");
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const resetUrl = new URL(`/admin-reset-password?token=${encodeURIComponent(token)}`, emailConfig.origin).toString();
    await prisma.adminPasswordReset.deleteMany({ where: { adminUserId: admin.id } });
    await prisma.adminPasswordReset.create({ data: { adminUserId: admin.id, tokenHash, expiresAt } });
    const emailResult = await sendAdminEmail(admin.email, "Reset your FAMZI admin password", `<p>We received a request to reset your FAMZI admin password.</p><p><a href="${resetUrl}">Choose a new password</a></p><p>This link expires in 30 minutes and can only be used once. If you did not request this, ignore this email.</p>`);
    if (!emailResult.ok) {
      await prisma.adminPasswordReset.deleteMany({ where: { tokenHash } });
      return NextResponse.json({ error: `The reset email could not be sent. ${emailResult.error || "Check the email provider configuration."}` }, { status: 502 });
    }
  }
  return NextResponse.json({ success: true, message: "If that email belongs to an admin account, a reset link will be sent." });
}
