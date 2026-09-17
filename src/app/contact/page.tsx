import { MessageCircle, Mail, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/marketing";
import { ContactForm } from "@/components/forms";
import { SocialLinks } from "@/components/site-footer";
import { whatsapp, services } from "@/content/services";
import { currentUser } from "@/lib/auth";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Contact",
  "Tell Yoletech about your project. Request web development, data analysis, AI automation, tutorials and practical technology support.",
  "/contact",
);
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; package?: string }>;
}) {
  const params = await searchParams;
  const user = process.env.DATABASE_URL ? await currentUser() : null;
  const selected = services.some((s) => s.key === params.service)
    ? params.service
    : "";
  const packageName = ["Starter", "Professional", "Enterprise"].includes(
    params.package || "",
  )
    ? params.package
    : undefined;
  return (
    <>
      <PageHero
        label="Let’s connect"
        title="Your next step starts with a conversation."
        description="An idea, a project or a technical challenge — tell us what’s on your mind. We’ll work out the next step together."
      />
      <section className="site-container section form-layout">
        <div className="form-card">
          <h2 className="text-2xl mb-2">Tell us what you have in mind.</h2>
          <p className="text-sm mb-7">
            A little context helps us give you a useful response.
          </p>
          <ContactForm
            service={selected}
            user={user || undefined}
            packageName={packageName}
          />
        </div>
        <aside>
          <div className="bg-pale rounded-xl p-8">
            <span className="icon-box bg-white">
              <MessageCircle size={25} />
            </span>
            <h2 className="text-2xl mb-3">Prefer a quick chat?</h2>
            <p className="text-sm mb-6">
              Reach out on WhatsApp and tell us how we can help.
            </p>
            <a href={whatsapp} className="btn btn-primary">
              Chat on WhatsApp <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="p-8">
            <h3 className="mb-3">Or send an email</h3>
            <a className="text-link" href="mailto:yoletech@yolestica.com">
              <Mail size={17} />
              yoletech@yolestica.com
            </a>
            <h3 className="mt-8">Find us online</h3>
            <SocialLinks />
            <p className="text-xs mt-8">
              Draft response-time note: We usually reply within 24 hours. Final
              availability will be confirmed before launch.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
