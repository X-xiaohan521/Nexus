import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "./navbar";
import { ThemeProvider } from "next-themes";

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
    default: "Ai Ranking",
    template: "%s | Ai Ranking"
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
      <body
        className={`flex flex-col h-screen bg-background ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Top bar */}
          <TopBar />

          {/* main content */}
          <main className="flex-1 flex items-center justify-center overflow-auto p-6">
            {children}
          </main>

          {/* footer */}
          <footer className="h-12 flex items-center justify-center shadow-md">
            <p className="">Copyright © 2026 - AiLab</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
