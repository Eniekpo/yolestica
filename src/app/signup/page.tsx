import { AuthPage } from "@/components/auth-page";
export const metadata = {
  title: "Create your account",
  robots: { index: false, follow: false },
};
export default function Signup() {
  return (
    <AuthPage
      mode="signup"
      title="Let’s move forward."
      intro="Create an account to keep your requests and conversations in one place."
    />
  );
}
