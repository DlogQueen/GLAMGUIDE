import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TessiChat } from "@/components/makeup/TessiChat";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffe4e6" },
    { media: "(prefers-color-scheme: dark)", color: "#4c0519" },
  ],
};

export const metadata: Metadata = {
  title: "Glam Guide AI | Your AR Makeup Tutor",
  description: "Learn to apply any makeup look with AI-powered AR guidance. Real-time coaching, step-by-step tutorials, and personalized style recommendations.",
  keywords: ["makeup", "AR", "tutorial", "AI", "beauty", "cosmetics", "virtual try-on", "glam guide"],
  authors: [{ name: "Glam Guide AI" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Glam Guide AI",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <TessiChat />
        </AuthProvider>
      </body>
    </html>
  );
}
