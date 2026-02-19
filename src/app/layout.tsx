import type { Metadata } from "next";
import { Exo_2, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DefenseMatrix — Cyber Defense Assessment",
  description: "Map your cybersecurity posture with the Cyber Defense Matrix framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${exo2.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased noise`}
      >
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
