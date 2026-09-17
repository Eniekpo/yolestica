import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { PageHero, Checklist, ClosingCTA } from "@/components/marketing";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Services",
  "Explore web development, data analysis, tutorials, AI automation, customer support, IT support, content and graphic design.",
  "/services",
);
export default function Services() {
  return (
    <>
      <PageHero
        label="Our services"
        title="Practical expertise for your next step."
        description="Eight connected services. One thoughtful approach. Find the support that fits your goals."
      />
      <div className="site-container">
        {services.map((s, i) => (
          <section id={s.slug} className="service-detail" key={s.key}>
            <Image
              className="detail-image w-full h-auto"
              src={`/illustrations/services/${s.slug}.svg`}
              width={620}
              height={470}
              alt=""
            />
            <div>
              <div className="eyebrow">Service 0{i + 1}</div>
              <h2>{s.name}</h2>
              <p>{s.description}</p>
              <Checklist items={s.features} />
              <Link
                href={`/contact?service=${s.key}`}
                className="btn btn-primary"
              >
                Let’s talk about your project <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>
        ))}
      </div>
      <div className="pt-16">
        <ClosingCTA />
      </div>
    </>
  );
}
