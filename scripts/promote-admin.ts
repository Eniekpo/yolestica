import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email)
    throw new Error("Usage: npm run admin:promote -- owner@example.com");
  const user = await db.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { email: true },
  });
  console.log(`Administrator role assigned to ${user.email}.`);
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
