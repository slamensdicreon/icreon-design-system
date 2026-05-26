import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OnPageEdit from "@/components/shared/OnPageEdit";
import { registerComponents } from "@/lib/component-registry";
import { ensureOptimizelyConfig } from "@/lib/optimizely";
import "./globals.css";

ensureOptimizelyConfig();
registerComponents();

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Icreon Design System",
  description: "Enterprise B2B platform powered by Optimizely CMS",
};

const cmsUrl = process.env.OPTIMIZELY_CMS_URL;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {isDraft && cmsUrl && (
          <>
            <Script
              src={`${cmsUrl}/ui/CMS/latest/clientresources/communicationinjector.js`}
              strategy="afterInteractive"
            />
            <OnPageEdit />
          </>
        )}
      </body>
    </html>
  );
}
