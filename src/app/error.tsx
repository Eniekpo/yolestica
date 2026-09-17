"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="site-container section text-center">
      <h1>We couldn’t load this page.</h1>
      <p className="my-6">
        Please try again. If the problem continues, contact us on WhatsApp.
      </p>
      <button className="btn btn-primary" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
