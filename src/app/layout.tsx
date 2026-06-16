import type { Metadata } from "next";
import { Inter } from "next/font/google";
import DemoBar from "./DemoBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dycom Family of Companies — One Connected Network",
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
        <DemoBar />
        {children}
      </body>
    </html>
  );
}
