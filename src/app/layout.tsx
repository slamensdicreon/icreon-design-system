import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NetworkProvider } from "./network-store";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dycom Family of Companies — Interactive Map",
  description:
    "Explore Dycom's 38 operating companies and their nationwide network of locations across all 50 states.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <NetworkProvider>{children}</NetworkProvider>
      </body>
    </html>
  );
}
