import Link from "next/link";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { PageHero, SectionHead, Checklist } from "@/components/marketing";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Pricing",
  "Explore flexible project packages and request a tailored quote for development, data, AI and ongoing support.",
  "/pricing",
);
const packages = [
  {
    name: "Starter",
    desc: "A focused solution for a clear first step.",
    features: [
      "One clearly defined deliverable",
      "Discovery & scope planning",
      "Responsive implementation where relevant",
      "Agreed review & handover",
    ],
  },
  {
    name: "Professional",
    desc: "A connected solution for a growing business.",
    features: [
      "Multiple connected deliverables",
      "Detailed discovery & project plan",
      "Custom integrations where required",
      "Structured reviews & documentation",
      "Post-delivery support by agreement",
    ],
  },
  {
    name: "Enterprise",
    desc: "A tailored engagement for complex needs.",
    features: [
      "Scope shaped around your organization",
      "System & workflow planning",
      "Phased delivery & stakeholder reviews",
      "Team handover & documentation",
      "Ongoing support options",
    ],
  },
];
const faqs = [
  [
    "How is my project priced?",
    "Draft terms: We provide a custom quote after understanding the scope, deliverables and technical requirements. The final proposal will set out what is included.",
  ],
  [
    "What are the payment terms?",
    "Draft terms: Payment stages and due dates will be agreed in your proposal before work starts. No fixed deposit or payment schedule is published yet.",
  ],
  [
    "How long will my project take?",
    "Draft terms: Timelines depend on scope and the availability of content, access and feedback. We will agree a realistic schedule during planning.",
  ],
  [
    "Are revisions included?",
    "Draft terms: The number and scope of review rounds will be specified in your proposal. Additional changes will be discussed before extra work begins.",
  ],
  [
    "What happens after delivery?",
    "Draft terms: Handover includes the guidance agreed in your scope. Maintenance and ongoing support can be arranged separately.",
  ],
  [
    "Can I book tutorials or ongoing support?",
    "Yes. Tell us what you want to learn or the support you need. Session arrangements, availability and any retainer terms will be confirmed in a custom quote.",
  ],
];
export default function Pricing() {
  return (
    <>
      <PageHero
        label="Pricing"
        title="Clear scope. Thoughtful work. A price that fits."
        description="Every project is different. These packages are a starting point for a conversation, with a tailored quote before work begins."
      />
      <section className="site-container section">
        <div className="price-grid">
          {packages.map((p, i) => (
            <article
              key={p.name}
              className={`price-card ${i === 1 ? "recommended" : ""}`}
            >
              {i === 1 && <span className="popular">Most Popular</span>}
              <h2 className="text-xl">{p.name}</h2>
              <p className="text-sm mt-3">{p.desc}</p>
              <div className="price">Custom Quote</div>
              <p className="text-xs">Final pricing agreed after discovery</p>
              <Checklist items={p.features} />
              <Link
                href={`/contact?package=${p.name}`}
                className={`btn w-full mt-3 ${i === 1 ? "btn-primary" : "btn-secondary"}`}
              >
                Discuss {p.name} <ArrowUpRight size={15} />
              </Link>
            </article>
          ))}
        </div>
        <div className="bg-pale rounded-xl p-8 mt-10 flex flex-wrap gap-6 justify-between items-center">
          <div className="flex gap-4">
            <SlidersHorizontal className="text-brand shrink-0" />
            <div>
              <h3>Need a different kind of support?</h3>
              <p className="text-sm mt-2">
                Tutorials, ongoing IT support, content and retainers — built
                around your needs.
              </p>
            </div>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Request a Custom Quote <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <section className="bg-mist section">
        <div className="site-container">
          <SectionHead
            label="Good questions"
            title="Know what to expect before we begin."
          />
          <p className="text-sm mb-6">
            The answers below are draft guidance. Your agreed proposal will
            contain the final terms.
          </p>
          <div className="faq">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
