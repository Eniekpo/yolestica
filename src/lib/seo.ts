import type { Metadata } from "next";
export const siteUrl = "https://yoletech.work";
export function metadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title: `${title} | Yoletech`,
      description,
      url: `${siteUrl}${path}`,
      siteName: "Yoletech",
      type: "website",
      images: [`${siteUrl}/opengraph-image`],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
