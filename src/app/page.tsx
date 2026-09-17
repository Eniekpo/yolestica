import Link from "next/link";
import {
  ArrowUpRight,
  Layers,
  MessagesSquare,
  ScanLine,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Hero } from "@/components/hero";
import {
  SectionHead,
  ServiceGrid,
  Process,
  ClosingCTA,
  BlogEmpty,
} from "@/components/marketing";
import { PostGrid } from "@/components/blog";
import { posts } from "@/lib/blog";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Practical technology. Thoughtful solutions.",
  "Build better websites, make sense of your data and put AI to work. Explore eight practical technology services from Yoletech.",
  "/",
);
export const dynamic = "force-dynamic";
export default async function Home() {
  const latest = await posts(undefined, 3);
  return (
    <>
      <Hero />
      <div className="value-strip">
        <div className="site-container">
          <strong>One technology partner. A world of possibilities.</strong>
          <span className="mx-2">—</span>Practical solutions for businesses,
          organizations and curious minds.
        </div>
      </div>
      <section className="site-container section">
        <SectionHead
          label="What we do"
          title="The right expertise. Real possibilities."
        >
          <p>
            From your first idea to your next big step, get the skills and
            support to move forward.
          </p>
        </SectionHead>
        <ServiceGrid />
        <div className="mt-8 text-center">
          <Link href="/services" className="text-link">
            Find the right service for you <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="bg-mist section">
        <div className="site-container trust-layout">
          <div className="trust-visual">
            <div className="eyebrow">Built on understanding</div>
            <div className="giant-mark" aria-hidden="true">
              &lt; / &gt;
            </div>
            <h3 className="text-2xl max-w-72 mt-4">
              Technology works best
              <br />
              when people come first.
            </h3>
            <div className="trust-note">
              <span className="icon-box !m-0 !w-9 !h-9 shrink-0">
                <Check size={18} />
              </span>
              <span>
                Your goals. A clear plan.
                <br />
                <strong className="text-ink">
                  Work that makes a difference.
                </strong>
              </span>
            </div>
          </div>
          <div>
            <div className="eyebrow">Why Yoletech</div>
            <h2>
              More than a service.
              <br />A partner in your progress.
            </h2>
            <div className="trust-list">
              {[
                [
                  Layers,
                  "Connected expertise",
                  "Development, data and AI skills that work together to solve the whole problem.",
                ],
                [
                  ScanLine,
                  "Built around you",
                  "A practical approach shaped by your goals, your team and your constraints.",
                ],
                [
                  MessagesSquare,
                  "Clear communication",
                  "Direct conversations, useful updates and a shared understanding of the next step.",
                ],
                [
                  ShieldCheck,
                  "Care beyond delivery",
                  "Thoughtful handover and support options that help you keep moving.",
                ],
              ].map(([Icon, title, copy]) => {
                const I = Icon as typeof Layers;
                return (
                  <div className="trust-item" key={String(title)}>
                    <I
                      size={21}
                      className="text-brand shrink-0 mt-1"
                      strokeWidth={1.7}
                    />
                    <div>
                      <h3>{String(title)}</h3>
                      <p>{String(copy)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="site-container section">
        <SectionHead
          label="How we work"
          title="A clear path from idea to impact."
        >
          <p>
            No guesswork. Just a thoughtful process that keeps you involved at
            every step.
          </p>
        </SectionHead>
        <Process />
      </section>
      <section className="bg-mist section">
        <div className="site-container">
          <SectionHead
            label="From the blog"
            title="Fresh ideas. Practical takeaways."
          >
            <Link href="/blog" className="text-link">
              Explore the blog <ArrowUpRight size={16} />
            </Link>
          </SectionHead>
          {latest.length ? <PostGrid posts={latest} /> : <BlogEmpty />}
        </div>
      </section>
      <div className="pt-16">
        <ClosingCTA />
      </div>
    </>
  );
}
