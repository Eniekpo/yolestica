import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/forms";
export const metadata = { title: "Your profile" };
export default async function Profile() {
  const user = await requireUser();
  return (
    <>
      <h1>Your profile.</h1>
      <p className="mb-8">Keep your contact details up to date.</p>
      <div className="form-card max-w-xl">
        <ProfileForm user={user} />
      </div>
    </>
  );
}
