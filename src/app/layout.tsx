import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyKanban — Kişisel Haftalık Görev Takibi",
  description:
    "Kişisel haftalık Kanban board. Görevlerini günlere böl, önceliklendir ve gerçek zamanlı takip et.",
  keywords: ["kanban", "görev takibi", "verimlilik", "haftalık plan"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
