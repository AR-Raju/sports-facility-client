import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import ClientLayout from "./clientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SportsFacility - Book Your Perfect Sports Venue",
  description:
    "Find and book the perfect sports facility for your activities. From football fields to tennis courts, we have it all.",
  keywords:
    "sports facility, booking, football, basketball, tennis, swimming pool",
  generator: "Asikur Rahman",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
