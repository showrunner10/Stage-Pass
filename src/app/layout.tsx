import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Oswald } from "next/font/google";
import { AuthHashRedirect } from "@/components/auth/AuthHashRedirect";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { Toaster } from "@/components/ui/toaster";
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
const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Hypelist | Earn from what you love going to",
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
      <body className={`${inter.variable} ${editorial.variable} ${display.variable}`} suppressHydrationWarning>
        <AuthHashRedirect />
        {children}
        <Toaster />
        <ScrollToTopButton />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
