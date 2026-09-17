import Link from "next/link";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Pagination } from "@/components/portal";
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdmin();
  const p = await searchParams;
  const q = (p.q || "").slice(0, 100);
  const page = Math.max(1, Math.min(10000, Math.floor(Number(p.page) || 1)));
  const where: Prisma.UserWhereInput = {
    role: "CLIENT",
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [users, total, open, leads] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { inquiries: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 20,
      take: 21,
    }),
    db.user.count({ where: { role: "CLIENT" } }),
    db.inquiry.count({ where: { status: { not: "CLOSED" } } }),
    db.inquiry.count({ where: { userId: null } }),
  ]);
  return (
    <>
      <div className="eyebrow">Owner workspace</div>
      <h1>Every client. One clear view.</h1>
      <p>Manage registrations and keep the next conversation moving.</p>
      <div className="grid sm:grid-cols-3 gap-5 my-8">
        {[
          [total, "Registered clients"],
          [open, "Open requests"],
          [leads, "Guest inquiries"],
        ].map(([count, label]) => (
          <div className="form-card" key={label}>
            <strong className="font-heading text-3xl text-ink">{count}</strong>
            <p className="text-sm mt-2">{label}</p>
          </div>
        ))}
      </div>
      <form className="flex gap-3 mb-6" role="search">
        <input
          name="q"
          aria-label="Search clients by name or email"
          placeholder="Search name or email"
          defaultValue={q}
          maxLength={100}
          className="search-input max-w-md"
        />
        <button className="btn btn-secondary">Search</button>
      </form>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">Registered clients</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Signed up</th>
              <th>Requests</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 20).map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.createdAt.toLocaleDateString("en-GB")}</td>
                <td>{u._count.inquiries}</td>
                <td>
                  <Link className="text-link" href={`/admin/clients/${u.id}`}>
                    View<span className="sr-only"> {u.name}</span> →
                  </Link>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td colSpan={5}>No clients match this search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        base="/admin"
        page={page}
        hasMore={users.length > 20}
        query={{ q }}
      />
    </>
  );
}
