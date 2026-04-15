"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Compass, Bookmark, MessageCircle, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutGrid className="h-5 w-5" />,
    match: (p) => p === "/dashboard",
  },
  {
    href: "/explore",
    label: "Explore",
    icon: <Compass className="h-5 w-5" />,
    match: (p) => p === "/explore",
  },
  {
    href: "/saved",
    label: "Saved",
    icon: <Bookmark className="h-5 w-5" />,
    match: (p) => p === "/saved",
  },
  {
    href: "/chat",
    label: "Chat",
    icon: <MessageCircle className="h-5 w-5" />,
    match: (p) => p === "/chat",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="h-5 w-5" />,
    match: (p) => p === "/profile",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    match: (p) => p === "/settings",
  },
];

export function BottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match ? item.match(pathname) : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] transition-colors",
                isActive
                  ? "text-white bg-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "grid place-items-center rounded-lg p-1.5 transition-colors",
                  isActive ? "text-pink-300" : "text-white/70"
                )}
              >
                {item.icon}
              </span>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

