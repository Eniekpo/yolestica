import { db } from "./db";
import { digest } from "./auth";
import { HttpError } from "./http";
export async function rateLimit(
  action: string,
  identifier: string,
  max = 8,
  windowMs = 15 * 60 * 1000,
) {
  const key = digest(`${action}:${identifier}`);
  const rows = await db.$queryRaw<
    { count: number }[]
  >`INSERT INTO "RateLimitBucket" ("key","count","windowEndsAt","updatedAt") VALUES (${key},1,${new Date(Date.now() + windowMs)},NOW()) ON CONFLICT ("key") DO UPDATE SET "count"=CASE WHEN "RateLimitBucket"."windowEndsAt" < NOW() THEN 1 ELSE "RateLimitBucket"."count"+1 END, "windowEndsAt"=CASE WHEN "RateLimitBucket"."windowEndsAt" < NOW() THEN ${new Date(Date.now() + windowMs)} ELSE "RateLimitBucket"."windowEndsAt" END, "updatedAt"=NOW() RETURNING "count"`;
  if (rows[0].count > max)
    throw new HttpError(
      429,
      "Too many attempts. Please wait 15 minutes and try again.",
    );
}
export function requestIp(request: Request) {
  if (process.env.VERCEL)
    return (
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown"
    );
  return "local-or-untrusted-proxy";
}
