import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppFrame from "@/app/components/AppFrame";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ToastViewport from "@/app/components/ToastViewport";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanvi - Homemade Pickles",
  description:
    "Authentic homemade pickles made with love and fresh ingredients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ToastViewport />
        <Header />
        <AppFrame>{children}</AppFrame>
        <Footer />
      </body>
    </html>
  );
}
