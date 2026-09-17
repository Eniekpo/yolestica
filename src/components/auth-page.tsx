import { AuthForm } from "./forms";
export function AuthPage({
  mode,
  title,
  intro,
  token,
  notice,
}: {
  mode: "signup" | "login" | "forgot-password" | "reset-password";
  title: string;
  intro: string;
  token?: string;
  notice?: string;
}) {
  return (
    <section className="auth-wrap">
      <div className="auth-card form-card">
        <div className="eyebrow">Yoletech client portal</div>
        <h1>{title}</h1>
        <p className="intro">{intro}</p>
        <AuthForm mode={mode} token={token} notice={notice} />
      </div>
    </section>
  );
}
