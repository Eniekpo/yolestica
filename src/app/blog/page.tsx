import Link from "next/link";
import { PageHero, BlogEmpty } from "@/components/marketing";
import { PostGrid } from "@/components/blog";
import { services } from "@/content/services";
import { posts } from "@/lib/blog";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Blog",
  "Practical guides and ideas on web development, data, AI, design and everyday technology.",
  "/blog",
);
export const dynamic = "force-dynamic";
export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = [
    ...services.map((s) => ({ key: s.key, name: s.name })),
    { key: "TECH_TIPS", name: "Tech Tips" },
  ];
  const selected = categories.some((c) => c.key === category)
    ? category
    : undefined;
  const entries = await posts(selected);
  return (
    <>
      <PageHero
        label="The Yoletech blog"
        title="Useful ideas for a digital world."
        description="Clear explanations, practical guides and thoughtful perspectives to help you build, learn and work smarter."
      />
      <section className="site-container section">
        <nav className="filters" aria-label="Blog categories">
          <Link className="filter-link" href="/blog" aria-current={!selected}>
            All articles
          </Link>
          {categories.map((c) => (
            <Link
              className="filter-link"
              href={`/blog?category=${c.key}`}
              aria-current={selected === c.key}
              key={c.key}
            >
              {c.name}
            </Link>
          ))}
        </nav>
        {entries.length ? <PostGrid posts={entries} /> : <BlogEmpty />}
      </section>
    </>
  );
}
