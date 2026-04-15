"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";
import { TessiChatFull } from "@/components/makeup/TessiChatFull";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden selection:bg-pink-500/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-pink-400" />
              Chat with Tessi
            </h1>
            <p className="text-white/60 mt-1">Makeup guidance, product help, and step-by-step coaching.</p>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              Back to Dashboard
            </Button>
          </Link>
        </header>

        <TessiChatFull />
      </div>

      <BottomNav />
    </main>
  );
}

