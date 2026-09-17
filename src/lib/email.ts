import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
export async function sendResetEmail(email: string, token: string) {
  const url = new URL(
    "/reset-password",
    process.env.APP_URL || "http://localhost:3000",
  );
  url.searchParams.set("token", token);
  if (
    process.env.EMAIL_TEST_MODE === "true" &&
    !process.env.VERCEL &&
    new URL(process.env.APP_URL || "http://localhost:3000").hostname ===
      "localhost"
  ) {
    const folder = path.join(process.cwd(), ".local", "mail");
    await mkdir(folder, { recursive: true });
    await writeFile(
      path.join(folder, `${Date.now()}.json`),
      JSON.stringify({ to: email, url: url.toString() }),
      { mode: 0o600 },
    );
    return;
  }
  if (!process.env.RESEND_API_KEY) throw new Error("EmailNotConfigured");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(10000),
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: "Reset your Yoletech password",
      text: `Reset your password using this link within 30 minutes:\n\n${url}\n\nIf you did not request this, you can ignore this email.`,
    }),
  });
  if (!res.ok) throw new Error("EmailDeliveryFailed");
}
