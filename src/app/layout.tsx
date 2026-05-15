import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prithvi – Portfolio",
  description: "Personal portfolio of Prithvi – UI/UX designer & developer.",
};


import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { FullscreenMenu } from "@/components/ui/fullscreen-menu";
import { LoadingProvider } from "@/context/loading-context";
import { LoadingWrapper } from "@/components/loading-wrapper";
import { ConsoleSuppressor } from "@/components/console-suppressor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-black" suppressHydrationWarning>
        <ConsoleSuppressor />
        <SmoothScroll>
          <LoadingProvider>
            <LoadingWrapper>
              <FullscreenMenu>
                {children}
              </FullscreenMenu>
            </LoadingWrapper>
          </LoadingProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
