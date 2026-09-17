import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { InquiryList, Pagination } from "@/components/portal";
export const metadata = { title: "Client details" };
export default async function ClientDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const page = Math.max(
    1,
    Math.min(10000, Math.floor(Number(query.page) || 1)),
  );
  if (!z.uuid().safeParse(id).success) notFound();
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      phone: true,
      createdAt: true,
    },
  });
  if (!user) notFound();
  const inquiries = await db.inquiry.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * 20,
    take: 21,
  });
  return (
    <>
      <Link href="/admin" className="text-link mb-5">
        ← All clients
      </Link>
      <h1>{user.name}</h1>
      <div className="form-card mt-7">
        <dl className="grid sm:grid-cols-2 gap-5">
          {[
            ["Email", user.email],
            ["Company", user.company || "Not supplied"],
            ["Phone", user.phone || "Not supplied"],
            ["Registered", user.createdAt.toLocaleDateString("en-GB")],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold text-ink">{label}</dt>
              <dd className="text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-wrap justify-between gap-4 mt-10 mb-5">
        <h2 className="text-xl">Submitted requests</h2>
        <Link
          className="text-link"
          href={`/admin/inquiries?q=${encodeURIComponent(user.email)}`}
        >
          Manage follow-ups →
        </Link>
      </div>
      {inquiries.length ? (
        <>
          <InquiryList inquiries={inquiries.slice(0, 20)} />
          <Pagination
            page={page}
            hasMore={inquiries.length > 20}
            base={`/admin/clients/${id}`}
          />
        </>
      ) : (
        <p>No requests submitted yet.</p>
      )}
    </>
  );
}
