import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { InquiryList, Pagination } from "@/components/portal";
export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireUser();
  const p = await searchParams;
  const page = Math.max(1, Math.min(10000, Math.floor(Number(p.page) || 1)));
  const inquiries = await db.inquiry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * 20,
    take: 21,
  });
  return (
    <>
      <div className="flex justify-between items-start gap-6 flex-wrap">
        <div>
          <div className="eyebrow">Your client workspace</div>
          <h1>Hello, {user.name.split(" ")[0]}.</h1>
          <p>Keep track of your requests and tell us what’s next.</p>
        </div>
        <Link className="btn btn-primary" href="/dashboard/requests/new">
          New request <ArrowUpRight size={15} />
        </Link>
      </div>
      {user.role === "ADMIN" && (
        <Link className="text-link mt-5" href="/admin">
          Open administration →
        </Link>
      )}
      <h2 className="text-xl mt-10 mb-5">Your requests</h2>
      <InquiryList inquiries={inquiries.slice(0, 20)} />
      {inquiries.length > 0 && (
        <Pagination
          page={page}
          hasMore={inquiries.length > 20}
          base="/dashboard"
        />
      )}
    </>
  );
}
