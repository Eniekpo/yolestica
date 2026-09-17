import { PageHero } from "@/components/marketing";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Terms of Service — Draft",
  "Draft terms for Yoletech’s website and services, awaiting owner approval.",
  "/terms",
);
export default function Terms() {
  return (
    <>
      <PageHero
        label="Terms of Service"
        title="Clear expectations from the start."
        description="Draft terms — pending owner review and approval before public launch."
      />
      <section className="site-container section prose">
        <h2>Project agreements</h2>
        <p>
          Project scope, fees, payment stages, timelines, revisions and support
          arrangements will be confirmed in a written proposal. Website package
          descriptions are starting points for discussion.
        </p>
        <h2>Your account</h2>
        <p>
          Keep your login details private and provide accurate contact
          information. Use the portal for legitimate inquiries and project
          communication.
        </p>
        <h2>Details to finalize</h2>
        <p>
          [Owner to supply: legal business identity, intellectual property and
          licensing terms, cancellation/refund provisions, liability terms,
          governing law, dispute process and confirmed contact details.]
        </p>
        <p>This draft is not the final service agreement.</p>
      </section>
    </>
  );
}
