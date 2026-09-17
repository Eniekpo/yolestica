import { AuthPage } from "@/components/auth-page";
export const metadata = {
  title: "Client login",
  robots: { index: false, follow: false },
};
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; reset?: string }>;
}) {
  const p = await searchParams;
  return (
    <AuthPage
      mode="login"
      title="Welcome back."
      intro="Sign in to follow your requests and take the next step."
      notice={
        p.registered
          ? "Your account is ready. Sign in below."
          : p.reset
            ? "Password updated. Sign in with your new password."
            : undefined
      }
    />
  );
}
