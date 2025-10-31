"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Vazirmatn } from "next/font/google";

const client = new QueryClient();

const ThemeRegistry = dynamic(() => import("../components/ThemeRegistry"), {
  ssr: false,
});

const vazir = Vazirmatn({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.className}>
      <body style={{ backgroundColor: "#f8fafc", margin: 0 }}>
        <QueryClientProvider client={client}>
          <ThemeRegistry>{children}</ThemeRegistry>
        </QueryClientProvider>
      </body>
    </html>
  );
}
