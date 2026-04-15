import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";

// Lazy load TessiChat to reduce initial payload and script execution time
const TessiChat = dynamic(() => import("@/components/makeup/TessiChat").then(mod => ({ default: mod.TessiChat })), {
  ssr: false,
  loading: () => null,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
          <AppShell>
            <div className="flex flex-col h-full">
              {children}
              <footer className="border-t border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl mt-auto p-4 sm:p-6 text-center text-xs text-white/40">
                © 2026 GlamGuide™ AI. All rights reserved. | Made with ❤️ for beauty rebels
              </footer>
            </div>
          </AppShell>
          <TessiChat />
        </AuthProvider>
      </body>
    </html>
  );
}
