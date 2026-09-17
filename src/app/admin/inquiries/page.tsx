import { Prisma, InquiryStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { services } from "@/content/services";
import { FollowUpForm } from "@/components/forms";
import { StatusBadge, Pagination } from "@/components/portal";
export const metadata = { title: "All inquiries" };
export default async function AdminInquiries({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();
  const p = await searchParams;
  const q = (p.q || "").slice(0, 100);
  const status = Object.values(InquiryStatus).includes(
    p.status as InquiryStatus,
  )
    ? (p.status as InquiryStatus)
    : undefined;
  const page = Math.max(1, Math.min(10000, Math.floor(Number(p.page) || 1)));
  const where: Prisma.InquiryWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const inquiries = await db.inquiry.findMany({
    where,
    include: {
      notes: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * 20,
    take: 21,
  });
  return (
    <>
      <h1>Keep every conversation moving.</h1>
      <p>Guest inquiries and client requests, with private follow-up notes.</p>
      <form className="flex flex-wrap gap-3 my-7" role="search">
        <input
          name="q"
          className="search-input max-w-sm"
          defaultValue={q}
          placeholder="Search name, email or message"
          aria-label="Search inquiries"
          maxLength={100}
        />
        <select
          name="status"
          defaultValue={status || ""}
          aria-label="Filter by status"
          className="search-input max-w-xs"
        >
          <option value="">All statuses</option>
          {Object.values(InquiryStatus).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="btn btn-secondary">Apply filters</button>
      </form>
      {!inquiries.length && (
        <div className="empty-state">
          <h2 className="text-xl">No inquiries here yet.</h2>
          <p>New contact messages and client requests will appear here.</p>
        </div>
      )}
      {inquiries.slice(0, 20).map((q) => (
        <article key={q.id} className="request-card">
          <div className="flex justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg">
                {q.name}{" "}
                <span className="pill ml-2">
                  {q.userId ? "Client" : "Guest lead"}
                </span>
              </h2>
              <a href={`mailto:${q.email}`} className="text-link">
                {q.email}
              </a>
              {q.phone && <span className="text-xs ml-3">{q.phone}</span>}
            </div>
            <StatusBadge status={q.status} />
          </div>
          <h3 className="text-sm mt-5">
            {services.find((s) => s.key === q.service)?.name}
          </h3>
          <time className="text-xs" dateTime={q.createdAt.toISOString()}>
            {q.createdAt.toLocaleString("en-GB")}
          </time>
          <p>{q.message}</p>
          <details className="mt-5">
            <summary className="text-brand font-semibold text-sm">
              Manage status & private notes ({q.notes.length})
            </summary>
            <FollowUpForm id={q.id} status={q.status} />
            {q.notes.map((note) => (
              <div className="bg-mist rounded-lg p-4 mt-4" key={note.id}>
                <span className="text-xs font-semibold text-ink">
                  {note.author.name} · {note.createdAt.toLocaleString("en-GB")}
                </span>
                <p>{note.body}</p>
              </div>
            ))}
          </details>
        </article>
      ))}
      <Pagination
        page={page}
        hasMore={inquiries.length > 20}
        base="/admin/inquiries"
        query={{ q, status: status || "" }}
      />
    </>
  );
}
