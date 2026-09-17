import Link from "next/link";
export default function NotFound() {
  return (
    <section className="site-container section text-center">
      <div className="eyebrow justify-center">404 · Page not found</div>
      <h1>Let’s get you back on track.</h1>
      <p className="my-6">
        This page may have moved, or the link may be incorrect.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to Home
      </Link>
    </section>
  );
}
