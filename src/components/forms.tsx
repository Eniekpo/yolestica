"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { services } from "@/content/services";
type Result = {
  error?: string;
  message?: string;
  fields?: Record<string, string>;
  redirect?: string;
};
type FieldProps = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | null;
  hint?: string;
  autoComplete?: string;
  error?: string;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
};
function Field({
  name,
  label,
  error,
  hint,
  type = "text",
  required = true,
  defaultValue,
  autoComplete,
  minLength,
  maxLength,
  readOnly,
}: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {!required && (
          <span className="font-normal text-body"> (optional)</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        readOnly={readOnly}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${name}-error` : hint ? `${name}-hint` : undefined
        }
      />
      {hint && <small id={`${name}-hint`}>{hint}</small>}
      {error && (
        <span className="field-error" id={`${name}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
function useForm(endpoint: string, clear: boolean | string[] = false) {
  const [result, setResult] = useState<Result>({});
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setResult({});
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data: Result = await response.json();
      setResult(data);
      if (response.ok) {
        if (clear === true) form.reset();
        else if (Array.isArray(clear)) {
          for (const name of clear) {
            const field = form.elements.namedItem(name);
            if (
              field instanceof HTMLInputElement ||
              field instanceof HTMLTextAreaElement
            )
              field.value = "";
          }
        }
        if (data.redirect) {
          router.push(data.redirect);
          router.refresh();
        } else router.refresh();
      } else if (data.fields) {
        const first = Object.keys(data.fields)[0];
        (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      }
    } catch {
      setResult({
        error:
          "We couldn’t connect. Please check your connection and try again.",
      });
    } finally {
      setBusy(false);
    }
  }
  return { result, busy, submit };
}
function Feedback({ result }: { result: Result }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {result.error && (
        <div className="notice notice-error" role="alert">
          {result.error}
        </div>
      )}
      {result.message && (
        <div className="notice notice-success" role="status">
          {result.message}
        </div>
      )}
    </div>
  );
}
function Submit({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button className="btn btn-primary" disabled={busy} type="submit">
      {busy ? (
        <>
          <LoaderCircle size={16} className="animate-spin" />
          Please wait…
        </>
      ) : (
        <>
          {label}
          <ArrowUpRight size={16} />
        </>
      )}
    </button>
  );
}
export function ContactForm({
  service = "",
  client = false,
  user,
  packageName,
}: {
  service?: string;
  client?: boolean;
  user?: { name: string; email: string; phone: string | null };
  packageName?: string;
}) {
  const { result, busy, submit } = useForm("/api/inquiries", true);
  return (
    <form
      onSubmit={submit}
      aria-label={client ? "New client request" : "Contact form"}
    >
      <Feedback result={result} />
      {client ? (
        <>
          <input type="hidden" name="clientRequest" value="true" />
          <p className="text-sm mb-6">
            Submitting as <strong className="text-ink">{user?.name}</strong> (
            {user?.email}).
          </p>
        </>
      ) : (
        <>
          <div className="form-grid">
            <Field
              name="name"
              label="Your name"
              autoComplete="name"
              defaultValue={user?.name}
              maxLength={100}
              error={result.fields?.name}
            />
            <Field
              name="email"
              label="Email address"
              type="email"
              autoComplete="email"
              defaultValue={user?.email}
              maxLength={254}
              error={result.fields?.email}
            />
          </div>
          <Field
            name="phone"
            label="Phone number"
            type="tel"
            required={false}
            autoComplete="tel"
            defaultValue={user?.phone}
            maxLength={40}
            error={result.fields?.phone}
          />
        </>
      )}
      <div className="field">
        <label htmlFor="service">Service interested in</label>
        <select
          id="service"
          name="service"
          required
          defaultValue={service}
          aria-invalid={!!result.fields?.service}
          aria-describedby={
            result.fields?.service ? "service-error" : undefined
          }
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s.key} value={s.key}>
              {s.name}
            </option>
          ))}
        </select>
        {result.fields?.service && (
          <span id="service-error" className="field-error">
            {result.fields.service}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="message">Tell us about your project</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
          defaultValue={
            packageName ? `I'm interested in the ${packageName} package. ` : ""
          }
          placeholder="What would you like to achieve? Share your goals, a challenge or an idea."
          aria-invalid={!!result.fields?.message}
          aria-describedby={
            result.fields?.message ? "message-error" : "message-hint"
          }
        />
        <small id="message-hint">
          20–5,000 characters. Please don’t include passwords or sensitive
          account details.
        </small>
        {result.fields?.message && (
          <span className="field-error" id="message-error">
            {result.fields.message}
          </span>
        )}
      </div>
      <Submit
        busy={busy}
        label={client ? "Submit request" : "Send your message"}
      />
      <p className="form-note">
        We’ll use your details to respond to your request.{" "}
        <Link href="/privacy" className="underline">
          Read our draft privacy policy.
        </Link>
      </p>
    </form>
  );
}
export function AuthForm({
  mode,
  token = "",
  notice,
}: {
  mode: "signup" | "login" | "forgot-password" | "reset-password";
  token?: string;
  notice?: string;
}) {
  const { result, busy, submit } = useForm(`/api/auth/${mode}`);
  return (
    <form onSubmit={submit} aria-label={mode}>
      <Feedback result={result} />
      {notice && <div className="notice notice-success">{notice}</div>}
      {mode === "signup" && (
        <Field
          name="name"
          label="Your name"
          autoComplete="name"
          maxLength={100}
          error={result.fields?.name}
        />
      )}{" "}
      {mode !== "reset-password" && (
        <Field
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          maxLength={254}
          error={result.fields?.email}
        />
      )}{" "}
      {mode !== "forgot-password" && (
        <Field
          name="password"
          label={mode === "reset-password" ? "New password" : "Password"}
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={mode === "login" ? undefined : 12}
          maxLength={128}
          hint={
            mode !== "login"
              ? "Use 12–128 characters. A long, unique passphrase works well."
              : undefined
          }
          error={result.fields?.password}
        />
      )}{" "}
      {(mode === "signup" || mode === "reset-password") && (
        <Field
          name="confirmation"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          maxLength={128}
          error={result.fields?.confirmation}
        />
      )}{" "}
      {mode === "signup" && (
        <div className="form-grid">
          <Field
            name="company"
            label="Company"
            required={false}
            autoComplete="organization"
            maxLength={150}
            error={result.fields?.company}
          />
          <Field
            name="phone"
            label="Phone"
            type="tel"
            required={false}
            autoComplete="tel"
            maxLength={40}
            error={result.fields?.phone}
          />
        </div>
      )}
      {mode === "reset-password" && (
        <input name="token" type="hidden" value={token} />
      )}{" "}
      {mode === "login" && (
        <div className="mb-5 text-right">
          <Link className="text-link" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
      )}
      <Submit
        busy={busy}
        label={
          {
            signup: "Create your account",
            login: "Sign in",
            "forgot-password": "Send reset link",
            "reset-password": "Update password",
          }[mode]
        }
      />
      {mode === "signup" ? (
        <p className="form-note">
          Already registered?{" "}
          <Link className="text-link" href="/login">
            Sign in
          </Link>
          <br />
          Please review our{" "}
          <Link className="underline" href="/terms">
            draft terms
          </Link>{" "}
          and{" "}
          <Link className="underline" href="/privacy">
            privacy policy
          </Link>
          .
        </p>
      ) : (
        <p className="form-note">
          {mode === "login" ? (
            <>
              New to Yoletech?{" "}
              <Link className="text-link" href="/signup">
                Create an account
              </Link>
            </>
          ) : (
            <Link className="text-link" href="/login">
              Back to sign in
            </Link>
          )}
        </p>
      )}
    </form>
  );
}
export function ProfileForm({
  user,
}: {
  user: {
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
  };
}) {
  const { result, busy, submit } = useForm("/api/profile");
  return (
    <form onSubmit={submit}>
      <Feedback result={result} />
      <Field
        name="name"
        label="Your name"
        defaultValue={user.name}
        autoComplete="name"
        maxLength={100}
        error={result.fields?.name}
      />
      <Field
        name="email"
        label="Email address"
        defaultValue={user.email}
        readOnly
        hint="Contact Yoletech if you need to change your account email."
      />
      <Field
        name="company"
        label="Company"
        required={false}
        defaultValue={user.company}
        autoComplete="organization"
        maxLength={150}
        error={result.fields?.company}
      />
      <Field
        name="phone"
        label="Phone"
        required={false}
        type="tel"
        defaultValue={user.phone}
        autoComplete="tel"
        maxLength={40}
        error={result.fields?.phone}
      />
      <Submit busy={busy} label="Save profile" />
    </form>
  );
}
export function LogoutButton() {
  const { submit, busy, result } = useForm("/api/auth/logout");
  return (
    <form onSubmit={submit}>
      <button disabled={busy} type="submit">
        {busy ? "Signing out…" : "Sign out"}
      </button>
      {result.error && (
        <p role="alert" className="text-danger text-xs">
          {result.error}
        </p>
      )}
    </form>
  );
}
export function FollowUpForm({ id, status }: { id: string; status: string }) {
  const { submit, busy, result } = useForm(`/api/admin/inquiries/${id}`, [
    "note",
  ]);
  return (
    <form onSubmit={submit} className="mt-5">
      <Feedback result={result} />
      <div className="field">
        <label htmlFor={`status-${id}`}>Request status</label>
        <select id={`status-${id}`} name="status" defaultValue={status}>
          {["NEW", "IN_PROGRESS", "WAITING_ON_CLIENT", "CLOSED"].map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      {result.fields?.status && (
        <p className="field-error" id={`status-error-${id}`}>
          {result.fields.status}
        </p>
      )}
      <div className="field">
        <label htmlFor={`note-${id}`}>Private follow-up note (optional)</label>
        <textarea
          id={`note-${id}`}
          name="note"
          maxLength={3000}
          placeholder="Only administrators can see these notes."
          aria-invalid={!!result.fields?.note}
          aria-describedby={
            result.fields?.note ? `note-error-${id}` : undefined
          }
        />
      </div>
      {result.fields?.note && (
        <p className="field-error" id={`note-error-${id}`}>
          {result.fields.note}
        </p>
      )}
      <Submit busy={busy} label="Save follow-up" />
    </form>
  );
}
