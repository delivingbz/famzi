import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "famzi_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : undefined;
}

export function isAdminPasswordValid(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return false;

  const submittedHash = createHash("sha256").update(password).digest();
  const configuredHash = createHash("sha256")
    .update(configuredPassword)
    .digest();

  return timingSafeEqual(submittedHash, configuredHash);
}

export function createAdminSession() {
  const secret = getAuthSecret();
  if (!secret) throw new Error("AUTH_SECRET is not configured.");

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const signature = createHmac("sha256", secret)
    .update(String(expiresAt))
    .digest("base64url");

  return { value: `${expiresAt}.${signature}`, expiresAt };
}

export function isAdminSessionValid(value?: string) {
  const secret = getAuthSecret();
  if (!secret || !value) return false;

  const [expiresText, signature, extra] = value.split(".");
  const expiresAt = Number(expiresText);
  if (!signature || extra !== undefined || !Number.isSafeInteger(expiresAt)) {
    return false;
  }
  if (expiresAt <= Math.floor(Date.now() / 1000)) return false;

  const expected = createHmac("sha256", secret)
    .update(String(expiresAt))
    .digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    return false;
  }

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
