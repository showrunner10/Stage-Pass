import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const editorial = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-editorial",
});

export const metadata: Metadata = {
  title: "Stagepass | Earn from what you love going to",
  description: "A premium creator marketplace for live events.",
  icons: {
    icon: "/assets/branding/logo-icon.svg",
    shortcut: "/assets/branding/logo-icon.svg",
    apple: "/assets/branding/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${editorial.variable}`} suppressHydrationWarning>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
