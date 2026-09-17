import { BlogCategory } from "@prisma/client";
import { db } from "./db";
export async function posts(category?: string, take = 30) {
  if (!process.env.DATABASE_URL) return [];
  return db.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      ...(category &&
      Object.values(BlogCategory).includes(category as BlogCategory)
        ? { category: category as BlogCategory }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
    take,
  });
}
