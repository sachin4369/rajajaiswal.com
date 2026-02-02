import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Use system monospace font as fallback instead of Geist Mono to avoid Google Fonts fetch issues
const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "Raja Jaiswal Plastic Industries - Premium Office Chair Parts & Cafeteria Chairs",
  description: "Leading manufacturer of high-quality office chair parts and cafeteria chairs. Explore our wide range of products.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
          <div className="flex min-h-screen flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
      </body>
    </html>
  );
}
