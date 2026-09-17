import { AuthPage } from "@/components/auth-page";
export const metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};
export default function Forgot() {
  return (
    <AuthPage
      mode="forgot-password"
      title="Let’s get you back in."
      intro="Enter your account email and we’ll send a password reset link."
    />
  );
}
