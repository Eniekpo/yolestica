import { requireAdmin } from "@/lib/auth";
import { PortalNav } from "@/components/portal";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="portal">
      <div className="site-container">
        <PortalNav admin />
        {children}
      </div>
    </div>
  );
}
