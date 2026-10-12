// FAMZI FILE GUIDE: Consumes a password reset token and invalidates previous admin sessions.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashAdminPassword, hashResetToken, validPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let token: unknown, password: unknown;
  try { ({ token, password } = await request.json()); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof token !== "string" || token.length > 200 || !validPassword(password)) {
    return NextResponse.json({ error: "This reset link is invalid or expired, or the password is too short." }, { status: 400 });
  }
  const reset = await prisma.adminPasswordReset.findUnique({ where: { tokenHash: hashResetToken(token) } });
  if (!reset || reset.expiresAt <= new Date()) {
    return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  }
  const completed = await prisma.$transaction(async (transaction) => {
    const deleted = await transaction.adminPasswordReset.deleteMany({ where: { id: reset.id, expiresAt: { gt: new Date() } } });
    if (!deleted.count) return false;
    await transaction.adminUser.update({
      where: { id: reset.adminUserId },
      data: { passwordHash: await hashAdminPassword(password), sessionVersion: { increment: 1 } },
    });
    await transaction.adminPasswordReset.deleteMany({ where: { adminUserId: reset.adminUserId } });
  });
  if (!completed) return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  return NextResponse.json({ success: true });
}
