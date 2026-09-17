import type { BlogPost } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
export function PostGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="blog-grid">
      {posts.map((p) => (
        <article className="post-card" key={p.id}>
          <Link href={`/blog/${p.slug}`} tabIndex={-1} aria-hidden="true">
            <Image
              unoptimized={!!p.heroImage?.startsWith("http")}
              src={
                p.heroImage ||
                "/illustrations/services/full-stack-web-development.svg"
              }
              alt={p.heroAlt || ""}
              width={600}
              height={375}
            />
          </Link>
          <div className="post-content">
            <span className="pill">
              {services.find((s) => s.key === p.category)?.name || "Tech Tips"}
            </span>
            <h3>
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </h3>
            <p>{p.excerpt}</p>
            <div className="flex justify-between items-center mt-5">
              <time className="text-xs" dateTime={p.publishedAt?.toISOString()}>
                {p.publishedAt?.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
              <Link
                href={`/blog/${p.slug}`}
                aria-label={`Read ${p.title}`}
                className="text-link"
              >
                Read article <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
