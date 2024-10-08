import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import Loading from "@/components/Loading";
import RootProvider from "@/providers";

import "./globals.scss";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "My workspace",
    template: `My workspace - %s`,
  },
  description: "Manage your workspace efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
            integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </head>
        <body className={nunito.className}>
          <ClerkLoading>
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loading zIndex={99999} />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <RootProvider>{children}</RootProvider>
          </ClerkLoaded>
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
