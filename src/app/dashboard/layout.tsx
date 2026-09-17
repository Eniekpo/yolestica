import { requireUser } from "@/lib/auth";
import { PortalNav } from "@/components/portal";
export const metadata = {
  title: "Client dashboard",
  robots: { index: false, follow: false },
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return (
    <div className="portal">
      <div className="site-container">
        <PortalNav />
        {children}
      </div>
    </div>
  );
}
