import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/src/components/layout/AppShell";
import { Toaster } from "sonner";
import clientPromise from "@/src/lib/mongodb";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const client = await clientPromise;
    const db = client.db("kalp_tenant_acadivate");
    const settings = await db
      .collection("site_settings")
      .findOne({ id: "global" });

    return {
      title: settings?.siteName || "Acadivate",
      description: "Acadivate Research & Innovation Foundation website",
      icons: {
        icon: settings?.favicon || "/favicon.ico",
      },
    };
  } catch (e) {
    return {
      title: "Acadivate",
      description: "Acadivate Research & Innovation Foundation website",
    };
  }
}

import { FloatingChat } from "@/src/components/common/FloatingChat";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,700&family=Epilogue:wght@300;400;500;600;700;800&family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
