import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";
export const cookieName =
  process.env.NODE_ENV === "production"
    ? "__Host-yoletech-session"
    : "yoletech-session";
export const digest = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export const randomToken = () => randomBytes(32).toString("hex");
export async function currentUser() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: digest(token) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
  return session && session.expiresAt > new Date() ? session.user : null;
}
export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
export async function createSession(userId: string) {
  const token = randomToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.session.create({
    data: { userId, tokenHash: digest(token), expiresAt: expires },
  });
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}
export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token)
    await db.session.deleteMany({ where: { tokenHash: digest(token) } });
  jar.delete(cookieName);
}
