import {
  Code2,
  Database,
  BrainCircuit,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  PageHero,
  SectionHead,
  Process,
  ClosingCTA,
} from "@/components/marketing";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "About Yoletech",
  "Meet the practical, people-focused approach behind Yoletech’s development, data and AI services.",
  "/about",
);
export default function About() {
  return (
    <>
      <PageHero
        label="About Yoletech"
        title="Technology with purpose. A person you can work with."
        description="Practical expertise, thoughtful collaboration and a clear focus on what you want to achieve."
      />
      <section className="site-container section">
        <div className="trust-layout">
          <div>
            <div className="eyebrow">The story behind the work</div>
            <h2>
              Making technology
              <br />
              useful, together.
            </h2>
          </div>
          <div>
            <span className="pill mb-4">
              Draft brand story · owner review pending
            </span>
            <p>
              Yoletech is led by a full-stack developer and data analyst who
              connects technical skills with everyday business needs. The work
              spans building websites, understanding data, teaching development
              and using AI to make useful things happen.
            </p>
            <p className="mt-5">
              The mission is simple: make technology easier to use, easier to
              understand and better aligned with your goals. Whether you need a
              solution built or a skill explained, the starting point is a
              conversation about what matters to you.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-mist section">
        <div className="site-container">
          <SectionHead
            label="Skills & tools"
            title="The right tools for the task."
          />
          <div className="service-grid">
            {[
              [Code2, "Development", "React · Next.js · Python · Django"],
              [
                Database,
                "Data foundations",
                "SQL · PostgreSQL · Data cleaning",
              ],
              [
                ChartNoAxesCombined,
                "Business intelligence",
                "Power BI · Tableau · Reporting",
              ],
              [
                BrainCircuit,
                "AI & workflows",
                "AI tooling · Integrations · Automation",
              ],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof Code2;
              return (
                <div className="service-card" key={String(title)}>
                  <span className="icon-box">
                    <I size={24} />
                  </span>
                  <h3>{String(title)}</h3>
                  <p>{String(desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="site-container section">
        <SectionHead
          label="Our process"
          title="Good work starts with a clear plan."
        />
        <Process expanded />
      </section>
      <ClosingCTA />
    </>
  );
}
