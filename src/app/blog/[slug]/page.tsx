import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { db } from "@/lib/db";
import { posts } from "@/lib/blog";
import { metadata as meta } from "@/lib/seo";
import { PageHero } from "@/components/marketing";
import { PostGrid } from "@/components/blog";
import { services } from "@/content/services";
async function getPost(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  return db.blogPost.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
  });
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return post
    ? meta(post.title, post.excerpt, `/blog/${post.slug}`)
    : { title: "Article not found", robots: { index: false } };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = (await posts(post.category, 4))
    .filter((p) => p.id !== post.id)
    .slice(0, 3);
  return (
    <>
      <PageHero
        label={
          services.find((s) => s.key === post.category)?.name || "Tech Tips"
        }
        title={post.title}
        description={post.excerpt}
      />
      <article className="site-container section">
        <div className="prose">
          <p className="text-sm">
            By {post.authorName} ·{" "}
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </p>
          <Image
            className="w-full rounded-xl mb-10"
            unoptimized={!!post.heroImage?.startsWith("http")}
            src={
              post.heroImage ||
              "/illustrations/services/full-stack-web-development.svg"
            }
            alt={post.heroAlt || ""}
            width={750}
            height={470}
          />
          <ReactMarkdown skipHtml>{post.bodyMarkdown}</ReactMarkdown>
        </div>
      </article>
      {related.length > 0 && (
        <section className="site-container pb-16">
          <h2 className="mb-8">Keep exploring</h2>
          <PostGrid posts={related} />
        </section>
      )}
    </>
  );
}
