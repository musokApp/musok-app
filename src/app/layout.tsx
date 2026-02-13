import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "무속은 안 어려워?",
  description: "무속인 예약 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.NodeNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning data-theme="mystic">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
