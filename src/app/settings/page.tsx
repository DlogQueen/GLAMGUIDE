"use client";

import React from "react";
import Link from "next/link";
import { Settings, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden selection:bg-pink-500/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-pink-400" />
              Settings
            </h1>
            <p className="text-white/60 mt-1">Preferences for your beta experience.</p>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              Back to Dashboard
            </Button>
          </Link>
        </header>

        <div className="grid gap-4">
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Volume2 className="h-5 w-5 text-pink-300" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Tessi voice</p>
                <p className="text-sm text-white/60">
                  Control voice output from inside chat (mute/unmute).
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10">
            <p className="font-semibold">Coming next</p>
            <p className="text-sm text-white/60 mt-1">
              Theme selection, notifications, privacy, and data saver.
            </p>
          </Card>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

