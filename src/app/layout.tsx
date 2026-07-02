import type { Metadata } from "next";
import "./globals.css";
import { AuthGuard } from "@/components/AuthGuard";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "PayLedger - Reconciliation Infrastructure",
  description: "Dedicated Virtual Account Infrastructure for Automated Receivables Reconciliation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <AuthGuard>
        <QueryProvider>
          <body className="min-h-full flex flex-col">{children}</body>
        </QueryProvider>
      </AuthGuard>
    </html>
  );
}
