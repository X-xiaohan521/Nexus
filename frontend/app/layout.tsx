import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "./navbar";
import { ThemeProvider, useTheme } from "next-themes";
import { UserProvider } from "@/context/user-context";
import { Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nexus",
    template: "%s | Nexus"
  },
  description: 'A ranking system for AI competitions.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UserProvider>
        <body
          className={`flex flex-col h-screen bg-background ${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary selection:text-primary-foreground`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* Top bar */}
            <TopBar />

            {/* main content */}
            <main className="flex-1 flex items-center justify-center overflow-auto p-6">
              {children}
            </main>
            <Toaster />

            {/* footer */}
            <footer className="h-12 flex flex-col items-center justify-center shadow-md pb-4">
              <Link href="https://beian.miit.gov.cn/"><Button variant="link" className="text-secondary-foreground">蜀ICP备2026014434号</Button></Link>
              <p className="text-sm">Copyright © 2026 - AiLab</p>
            </footer>
          </ThemeProvider>
        </body>
      </UserProvider >
    </html>
  );
}
