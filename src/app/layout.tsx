import type { Metadata } from "next";
import "./globals.css";
import content from "@/shared/data/content.json";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: content.metadata.title,
  description: content.metadata.description,
  openGraph: {
    title: content.metadata.title,
    description: content.metadata.openGraphDescription,
    ...(process.env.SITE_URL ? { url: process.env.SITE_URL } : {}),
    siteName: content.metadata.siteName,
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(process.env.SITE_URL
    ? { alternates: { canonical: process.env.SITE_URL } }
    : {}),
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
