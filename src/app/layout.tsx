import type { Metadata } from "next";
import "./globals.css";
import content from "@/shared/data/content.json";
import { SITE_URL } from "./_composition/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: content.metadata.title,
  description: content.metadata.description,
  keywords: content.metadata.keywords,
  applicationName: content.metadata.siteName,
  authors: [{ name: "Khuong Nguyen Huu" }],
  creator: "Khuong Nguyen Huu",
  publisher: "Khuong Nguyen Huu",
  category: "technology",
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  other: {
    "ai-context": "/llms.txt",
  },
  openGraph: {
    title: content.metadata.title,
    description: content.metadata.openGraphDescription,
    url: "/",
    siteName: content.metadata.siteName,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: content.metadata.title,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: content.metadata.title,
    description: content.metadata.twitterDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* Skip navigation link — first child of body */}
        <a
          href="#main-content"
          className="fixed top-0 left-0 z-[100] -translate-y-full px-4 py-2 bg-ink text-bone text-sm font-medium focus:translate-y-0 focus:outline-none transition-transform"
        >
          {content.accessibility.skipNavigation}
        </a>

        {children}
      </body>
    </html>
  );
}
