import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  await db.blogPost.upsert({
    where: { slug: "turn-a-business-question-into-a-useful-dashboard" },
    update: {},
    create: {
      slug: "turn-a-business-question-into-a-useful-dashboard",
      title: "Start with a question, not a dashboard",
      excerpt:
        "A practical way to turn a business question into a report that supports a decision.",
      category: "DATA",
      authorName: "Yoletech",
      status: "DRAFT",
      bodyMarkdown:
        "## Define the decision\n\nBefore choosing a chart, write down the decision your report should support. A useful question has a clear audience and a next action.\n\n## Check the foundations\n\nReview missing values, date ranges and definitions before comparing results. Keep notes so someone else can understand how the numbers were produced.\n\n## Keep the view focused\n\nChoose a small number of meaningful measures. Give each one context, label it clearly and explain what it does not tell you.\n\n## Review with the people using it\n\nWalk through a real decision together. Use the feedback to improve the report before expanding it.",
    },
  });
  console.log(
    "Created a draft article for owner review. No article has been published.",
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
