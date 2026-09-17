import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
export const metadata: Metadata = {
  metadataBase: new URL("https://yoletech.work"),
  title: {
    default: "Yoletech — Practical technology. Thoughtful solutions.",
    template: "%s | Yoletech",
  },
  description:
    "Web development, data analysis, AI automation and practical technology services. Build, learn and grow with Yoletech.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
