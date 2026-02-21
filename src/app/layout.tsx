import type { Metadata } from "next";
import { Exo_2, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
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

const siteUrl = "https://cyberdefensematrix.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cyber Defense Matrix AI — Open Source Security Posture Assessment",
    template: "%s | Cyber Defense Matrix AI",
  },
  description:
    "Map your cybersecurity posture with the Cyber Defense Matrix framework. Open source tool for NIST CSF assessment, maturity scoring, tool mapping, and AI-powered security analysis.",
  keywords: [
    "cyber defense matrix",
    "cybersecurity assessment",
    "NIST CSF",
    "security posture",
    "maturity assessment",
    "security tool mapping",
    "open source security",
    "Sounil Yu",
    "cyber defense matrix AI",
  ],
  authors: [{ name: "Cyber Defense Matrix AI" }],
  creator: "Cyber Defense Matrix AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Cyber Defense Matrix AI",
    title: "Cyber Defense Matrix AI — Open Source Security Posture Assessment",
    description:
      "Map your cybersecurity posture with the Cyber Defense Matrix framework. Open source NIST CSF assessment with AI-powered analysis.",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cyber Defense Matrix AI — Security Posture Assessment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Defense Matrix AI — Open Source Security Posture Assessment",
    description:
      "Map your cybersecurity posture with the Cyber Defense Matrix framework. Open source NIST CSF assessment with AI-powered analysis.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${exo2.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased noise`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Cyber Defense Matrix AI",
                  url: siteUrl,
                  logo: `${siteUrl}/og-image.png`,
                  sameAs: [
                    "https://github.com/webmaxlabs/nist-cyber-defense-matrix-app",
                  ],
                },
                {
                  "@type": "WebSite",
                  name: "Cyber Defense Matrix AI",
                  url: siteUrl,
                  description:
                    "Open source cybersecurity posture assessment platform built on Sounil Yu's Cyber Defense Matrix framework.",
                },
              ],
            }),
          }}
        />
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
