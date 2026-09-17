import { requireUser } from "@/lib/auth";
import { ContactForm } from "@/components/forms";
export const metadata = { title: "New request" };
export default async function NewRequest() {
  const user = await requireUser();
  return (
    <>
      <h1>What’s your next step?</h1>
      <p className="mb-8">
        Tell us about the work you need or the challenge you’re facing.
      </p>
      <div className="form-card max-w-2xl">
        <ContactForm client user={user} />
      </div>
    </>
  );
}
