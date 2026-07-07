import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Navbar } from "@/components/navbar";
import { BottomNav } from "@/components/bottom-nav";
import { Footer } from "@/components/footer";
import { SearchModal } from "@/components/search-modal";
import { AmbientBackground } from "@/components/ambient-background";
import { PageLoader } from "@/components/page-loader";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, organizationSchema, websiteSchema } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://aivideos.codelove.in",
  ),
  ...buildMetadata({}),
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body>
        <Providers>
          <PageLoader />
          <ScrollToTop />
          <div className="flex min-h-screen flex-col">
            <AmbientBackground />
            <Navbar />
            <main className="pb-6 md:pb-2">{children}</main>
            <Footer />
            <BottomNav />
            <SearchModal />
          </div>
        </Providers>
      </body>
    </html>
  );
}
