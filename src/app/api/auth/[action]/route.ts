import { NextResponse } from "next/server";
import argon2 from "argon2";
import { z } from "zod";
import { db } from "@/lib/db";
import { body, fail, HttpError } from "@/lib/http";
import { createSession, destroySession, digest, randomToken } from "@/lib/auth";
import {
  signupSchema,
  loginSchema,
  emailSchema,
  resetSchema,
} from "@/lib/validation";
import { rateLimit, requestIp } from "@/lib/rate-limit";
import { sendResetEmail } from "@/lib/email";
export const runtime = "nodejs";
const hashing = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};
export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  try {
    const { action } = await params;
    const input = await body(request);
    if (
      ![
        "signup",
        "login",
        "logout",
        "forgot-password",
        "reset-password",
      ].includes(action)
    )
      throw new HttpError(404, "Not found.");
    if (action === "logout") {
      await destroySession();
      return NextResponse.json({ message: "Signed out.", redirect: "/login" });
    }
    await rateLimit(
      `${action}:ip`,
      requestIp(request),
      action === "login" ? 30 : 15,
    );
    if (action === "signup") {
      const data = signupSchema.parse(input);
      await rateLimit("signup:email", data.email, 4);
      await db.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          passwordHash: await argon2.hash(data.password, hashing),
        },
      });
      return NextResponse.json(
        {
          message: "Your account is ready. Sign in to continue.",
          redirect: "/login?registered=1",
        },
        { status: 201 },
      );
    }
    if (action === "login") {
      const data = loginSchema.parse(input);
      await rateLimit("login:email", data.email, 8);
      const user = await db.user.findUnique({ where: { email: data.email } });
      if (!user) {
        await argon2.hash(data.password, hashing);
        throw new HttpError(401, "Email or password is incorrect.");
      }
      if (!(await argon2.verify(user.passwordHash, data.password)))
        throw new HttpError(401, "Email or password is incorrect.");
      await createSession(user.id);
      return NextResponse.json({
        message: "Signed in.",
        redirect: user.role === "ADMIN" ? "/admin" : "/dashboard",
      });
    }
    if (action === "forgot-password") {
      const { email } = z.object({ email: emailSchema }).parse(input);
      await rateLimit("reset:email", email, 3);
      if (!process.env.RESEND_API_KEY && process.env.EMAIL_TEST_MODE !== "true")
        throw new HttpError(
          503,
          "Password reset email is not available yet. Please contact Yoletech for help.",
        );
      const user = await db.user.findUnique({ where: { email } });
      if (user) {
        const token = randomToken();
        const reset = await db.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash: digest(token),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          },
        });
        try {
          await sendResetEmail(email, token);
        } catch (error) {
          await db.passwordResetToken.delete({ where: { id: reset.id } });
          throw error;
        }
      }
      return NextResponse.json({
        message:
          "If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder.",
      });
    }
    if (action === "reset-password") {
      const data = resetSchema.parse(input);
      const hashed = await argon2.hash(data.password, hashing);
      await db.$transaction(async (tx) => {
        const reset = await tx.passwordResetToken.findUnique({
          where: { tokenHash: digest(data.token) },
        });
        if (!reset || reset.usedAt || reset.expiresAt <= new Date())
          throw new HttpError(
            400,
            "This reset link has expired or has already been used. Request a new link.",
          );
        const consumed = await tx.passwordResetToken.updateMany({
          where: { id: reset.id, usedAt: null, expiresAt: { gt: new Date() } },
          data: { usedAt: new Date() },
        });
        if (consumed.count !== 1)
          throw new HttpError(400, "This reset link has already been used.");
        await tx.user.update({
          where: { id: reset.userId },
          data: { passwordHash: hashed },
        });
        await tx.session.deleteMany({ where: { userId: reset.userId } });
        await tx.passwordResetToken.updateMany({
          where: { userId: reset.userId, usedAt: null },
          data: { usedAt: new Date() },
        });
      });
      return NextResponse.json({
        message:
          "Your password has been updated. Sign in with your new password.",
        redirect: "/login?reset=1",
      });
    }
  } catch (error) {
    return fail(error);
  }
}
