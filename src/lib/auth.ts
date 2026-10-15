import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "koreyaki_admin";

function secret(): string {
  return process.env.ADMIN_SECRET || process.env.DATABASE_URL || "koreyaki-local-secret";
}

function expectedPassword(): string {
  return process.env.ADMIN_PASSWORD || "koreyaki-staff";
}

export function signAdminToken(): string {
  const hmac = createHmac("sha256", secret());
  hmac.update("koreyaki-admin-v1");
  return hmac.digest("hex");
}

export function verifyPassword(password: string): boolean {
  const expected = expectedPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE, signAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  const expected = signAdminToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
