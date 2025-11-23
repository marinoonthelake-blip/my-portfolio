import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 1. Load the Fonts defined by the Systematizer
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Matches Tailwind's font-sans expectation
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains", // Matches Tailwind's font-mono expectation
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jonathan William Marino | Digital Engineer",
  description: "Portfolio of a Creative Technologist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}