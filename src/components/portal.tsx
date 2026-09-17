import Link from "next/link";
import type { Inquiry } from "@prisma/client";
import { ArrowRight, MessageSquare } from "lucide-react";
import { services } from "@/content/services";
import { LogoutButton } from "./forms";
export function PortalNav({ admin = false }: { admin?: boolean }) {
  return (
    <nav
      className="portal-nav"
      aria-label={admin ? "Administration" : "Client portal"}
    >
      {admin ? (
        <>
          <Link href="/admin">Clients</Link>
          <Link href="/admin/inquiries">All inquiries</Link>
          <Link href="/dashboard">My dashboard</Link>
        </>
      ) : (
        <>
          <Link href="/dashboard">My requests</Link>
          <Link href="/dashboard/requests/new">New request</Link>
          <Link href="/dashboard/profile">My profile</Link>
        </>
      )}
      <LogoutButton />
    </nav>
  );
}
export function StatusBadge({ status }: { status: string }) {
  return <span className="pill">{status.replaceAll("_", " ")}</span>;
}
export function InquiryList({ inquiries }: { inquiries: Inquiry[] }) {
  if (!inquiries.length)
    return (
      <div className="empty-state mt-8">
        <MessageSquare className="mx-auto text-brand" />
        <h3>Your next project can start here.</h3>
        <p>
          You haven’t submitted a request yet. Tell us what you’d like to
          achieve.
        </p>
        <Link className="text-link" href="/dashboard/requests/new">
          Submit your first request <ArrowRight size={15} />
        </Link>
      </div>
    );
  return (
    <div>
      {inquiries.map((q) => (
        <article className="request-card" key={q.id}>
          <div className="flex justify-between gap-4 flex-wrap">
            <h2 className="text-lg">
              {services.find((s) => s.key === q.service)?.name}
            </h2>
            <StatusBadge status={q.status} />
          </div>
          <time className="text-xs" dateTime={q.createdAt.toISOString()}>
            {q.createdAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <p>{q.message}</p>
        </article>
      ))}
    </div>
  );
}
export function Pagination({
  page,
  hasMore,
  base,
  query = {},
}: {
  page: number;
  hasMore: boolean;
  base: string;
  query?: Record<string, string>;
}) {
  function href(p: number) {
    return `${base}?${new URLSearchParams({ ...query, page: String(p) })}`;
  }
  return (
    <nav
      className="flex gap-5 items-center mt-7 text-sm"
      aria-label="Pagination"
    >
      {page > 1 && (
        <Link className="text-link" href={href(page - 1)}>
          ← Previous
        </Link>
      )}
      <span>Page {page}</span>
      {hasMore && (
        <Link className="text-link" href={href(page + 1)}>
          Next →
        </Link>
      )}
    </nav>
  );
}
