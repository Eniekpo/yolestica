import Link from "next/link";
import { AuthPage } from "@/components/auth-page";
export const metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    return (
      <section className="site-container section">
        <h1>A reset link is needed.</h1>
        <p className="my-6">
          Request a new email to securely reset your password.
        </p>
        <Link href="/forgot-password" className="btn btn-primary">
          Request reset link
        </Link>
      </section>
    );
  return (
    <AuthPage
      mode="reset-password"
      title="A fresh start."
      intro="Choose a unique password to protect your Yoletech account."
      token={token}
    />
  );
}
