import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const now = new Date();
  const [sessions, resets, limits] = await db.$transaction([
    db.session.deleteMany({ where: { expiresAt: { lt: now } } }),
    db.passwordResetToken.deleteMany({
      where: { OR: [{ expiresAt: { lt: now } }, { usedAt: { not: null } }] },
    }),
    db.rateLimitBucket.deleteMany({ where: { windowEndsAt: { lt: now } } }),
  ]);
  console.log({
    expiredSessions: sessions.count,
    expiredResetTokens: resets.count,
    expiredRateLimits: limits.count,
  });
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
