"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { usePathname } from "next/navigation";
import type React from "react";
import { Toaster } from "sonner";

interface Props {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();

  // Check if current path is a dashboard route
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  return (
    <ReduxProvider>
      <div className="min-h-screen flex flex-col">
        {!isDashboardRoute && <Header />}
        <main className={isDashboardRoute ? "flex-1" : "flex-1"}>
          {children}
        </main>
        {!isDashboardRoute && <Footer />}
      </div>
      <ScrollToTop />
      <Toaster position="top-right" />
    </ReduxProvider>
  );
}
