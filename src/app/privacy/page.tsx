import { PageHero } from "@/components/marketing";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Privacy Policy — Draft",
  "Draft privacy information for the Yoletech website and client portal, awaiting owner approval.",
  "/privacy",
);
export default function Privacy() {
  return (
    <>
      <PageHero
        label="Privacy Policy"
        title="Your information deserves care."
        description="Draft policy — pending owner review and approval before public launch."
      />
      <section className="site-container section prose">
        <h2>Information the website collects</h2>
        <p>
          Account details include your name, email, optional company and phone
          number. We store a password hash, session records and the inquiries
          you submit. Technical identifiers are hashed for rate limiting.
        </p>
        <h2>How it is used</h2>
        <p>
          Information supports account access, responding to requests and
          tracking project conversations. Session cookies are required to keep
          you signed in. Reset emails are sent through the configured
          transactional email provider.
        </p>
        <h2>Details to finalize</h2>
        <p>
          [Owner to supply: legal business identity, data retention periods,
          applicable rights and request procedures, hosting and email provider
          details, international transfer information and a confirmed privacy
          contact.]
        </p>
        <p>This draft is not the final privacy policy.</p>
      </section>
    </>
  );
}
