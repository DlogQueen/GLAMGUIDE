"use client";

import React from "react";
import Link from "next/link";
import { Eye, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";

export default function ARPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden selection:bg-pink-500/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6 text-pink-400" />
              AR Try‑On
            </h1>
            <p className="text-white/60 mt-1">
              Virtual preview. This page prevents beta dead-ends while AR is being finalized.
            </p>
          </div>
          <Link href="/tutorial">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              Go to Tutorial
            </Button>
          </Link>
        </header>

        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-pink-300" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">AR is in progress</p>
              <p className="text-sm text-white/60 mt-1">
                For beta, use the camera experience inside tutorials. Next iteration: dedicated AR library, presets,
                and capture-to-portfolio.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/tutorial">
                  <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]">
                    Open Tutorial Camera
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </main>
  );
}

