// FAMZI FILE GUIDE: Server-only password hashing, session signing, token hashing, and admin checks.
import "server-only";
import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ADMIN_SESSION_COOKIE = "famzi_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const scryptAsync = promisify(scrypt);

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : undefined;
}

export function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidAdminEmail(email: unknown): email is string {
  return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export async function hashAdminPassword(password: string) {
  const salt = randomBytes(16);
  const hash = (await scryptAsync(password, salt, 64, { N: 16384, r: 8, p: 1 })) as Buffer;
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyAdminPassword(password: string, stored: string) {
  const [algorithm, saltHex, hashHex, extra] = stored.split("$");
  if (algorithm !== "scrypt" || !saltHex || !hashHex || extra !== undefined) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  if (salt.length !== 16 || expected.length !== 64) return false;
  const actual = (await scryptAsync(password, salt, expected.length, { N: 16384, r: 8, p: 1 })) as Buffer;
  return timingSafeEqual(actual, expected);
}

export function createAdminSession(adminId: number, sessionVersion: number) {
  const secret = getAuthSecret();
  if (!secret) throw new Error("AUTH_SECRET is not configured.");
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `${adminId}.${sessionVersion}.${expiresAt}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return { value: `${payload}.${signature}`, expiresAt };
}

export function readAdminSession(value?: string) {
  const secret = getAuthSecret();
  if (!secret || !value) return undefined;
  const [idText, versionText, expiresText, signature, extra] = value.split(".");
  const id = Number(idText);
  const version = Number(versionText);
  const expiresAt = Number(expiresText);
  if (!signature || extra !== undefined || !Number.isSafeInteger(id) || id < 1 ||
      !Number.isSafeInteger(version) || version < 0 || !Number.isSafeInteger(expiresAt) ||
      expiresAt <= Math.floor(Date.now() / 1000)) return undefined;
  const payload = `${id}.${version}.${expiresAt}`;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return undefined;
  return { id, version };
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return false;
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.id },
    select: { sessionVersion: true },
  });
  return admin?.sessionVersion === session.version;
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function validPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 12 && password.length <= 200;
}
