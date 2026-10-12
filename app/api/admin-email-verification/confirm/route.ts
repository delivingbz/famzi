// FAMZI FILE GUIDE: Consumes a one-time verification token and marks the admin email verified.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashResetToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let token: unknown;
  try { ({ token } = await request.json()); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof token !== "string" || token.length > 200) {
    return NextResponse.json({ error: "This verification link is invalid or expired." }, { status: 400 });
  }
  const verification = await prisma.adminEmailVerification.findUnique({ where: { tokenHash: hashResetToken(token) } });
  if (!verification || verification.expiresAt <= new Date()) {
    return NextResponse.json({ error: "This verification link is invalid or expired." }, { status: 400 });
  }
  const verified = await prisma.$transaction(async (transaction) => {
    const deleted = await transaction.adminEmailVerification.deleteMany({ where: { id: verification.id, expiresAt: { gt: new Date() } } });
    if (!deleted.count) return false;
    await transaction.adminUser.update({ where: { id: verification.adminUserId }, data: { emailVerifiedAt: new Date() } });
    await transaction.adminEmailVerification.deleteMany({ where: { adminUserId: verification.adminUserId } });
    return true;
  });
  if (!verified) return NextResponse.json({ error: "This verification link is invalid or expired." }, { status: 400 });
  return NextResponse.json({ success: true });
}
