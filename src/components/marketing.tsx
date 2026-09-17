import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { services, processSteps } from "@/content/services";
export function PageHero({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="site-container">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <span>{label}</span>
        </div>
        <div className="eyebrow">{label}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function SectionHead({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{label}</div>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function ServiceGrid() {
  return (
    <div className="service-grid">
      {services.map((s) => (
        <Link className="service-card" href={`/services#${s.slug}`} key={s.key}>
          <span className="icon-box">
            <s.icon size={23} strokeWidth={1.7} />
          </span>
          <h3>{s.name}</h3>
          <p>{s.caption}</p>
          <span className="text-link">
            Explore service <ArrowUpRight size={14} />
          </span>
        </Link>
      ))}
    </div>
  );
}
export function Process({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className="steps">
      {processSteps.map(([title, tag, desc], i) => (
        <div key={title}>
          <span className="step-number">0{i + 1}</span>
          <h3>{title}</h3>
          {expanded && <p className="font-semibold text-ink mb-2">{tag}</p>}
          <p>{desc}</p>
        </div>
      ))}
    </div>
  );
}
export function ClosingCTA() {
  return (
    <section className="site-container pb-16">
      <div className="cta">
        <div>
          <div className="eyebrow text-white">Your next step</div>
          <h2>
            Good ideas deserve
            <br />
            great execution.
          </h2>
          <p>Let’s talk about what you’re building — and how we can help.</p>
        </div>
        <Link href="/contact" className="btn btn-light">
          Let’s build something <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}
export function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="checklist">
      {items.map((t) => (
        <li key={t}>
          <Check size={16} />
          {t}
        </li>
      ))}
    </ul>
  );
}
export function BlogEmpty() {
  return (
    <div className="empty-state">
      <BookOpen size={28} className="mx-auto text-brand" />
      <h3>A little knowledge goes a long way.</h3>
      <p>
        Practical guides on development, data and smarter ways to work are on
        the way. Have a question you’d like us to cover?
      </p>
      <Link href="/contact" className="text-link">
        Start a conversation <ArrowRight size={15} />
      </Link>
    </div>
  );
}
