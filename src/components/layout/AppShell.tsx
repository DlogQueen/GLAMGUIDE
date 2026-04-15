"use client";

import Image from "next/image";
import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Users, 
  MessageCircle, 
  Eye, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="h-5 w-5" />,
    match: (p) => p.startsWith("/profile"),
  },
  {
    href: "/explore",
    label: "Community Feed",
    icon: <Users className="h-5 w-5" />,
    match: (p) => p === "/explore",
  },
  {
    href: "/chat",
    label: "Tessi ARI",
    icon: <MessageCircle className="h-5 w-5" />,
    match: (p) => p === "/chat",
  },
  {
    href: "/ar",
    label: "AR Try-Ons",
    icon: <Eye className="h-5 w-5" />,
    match: (p) => p === "/ar",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    match: (p) => p === "/settings",
  },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() || "/";
  const { isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* SIDEBAR NAV - Desktop (hidden on mobile) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-white/10 md:bg-[#0a0a0f]/50 md:backdrop-blur-xl">
        {/* Logo */}
        <div className="flex h-20 items-center justify-center border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Glam Guide AI"
              height={40}
              width={120}
              className="h-10 w-auto drop-shadow-lg hover:scale-105 transition-transform"
              priority
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 p-4">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match ? item.match(pathname) : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 text-pink-300 border border-pink-500/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  isActive ? "text-pink-300" : "text-white/70"
                )}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-white/10 p-4">
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full justify-start text-white/60 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* BOTTOM NAV - Mobile (hidden on desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match ? item.match(pathname) : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] transition-colors",
                  isActive
                    ? "text-pink-300 bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="grid place-items-center rounded-lg p-1.5">
                  {item.icon}
                </span>
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
