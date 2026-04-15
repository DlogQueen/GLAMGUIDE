"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";
import { betaLocal } from "@/services/betaLocal";

export default function HistoryPage() {
  const [items, setItems] = useState(() => betaLocal.getTutorialHistory());

  useEffect(() => {
    setItems(betaLocal.getTutorialHistory());
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden selection:bg-pink-500/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6 text-pink-400" />
              Tutorial History
            </h1>
            <p className="text-white/60 mt-1">Your completed and in-progress lessons.</p>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              Back to Dashboard
            </Button>
          </Link>
        </header>

        {items.length === 0 ? (
          <Card className="p-8 bg-white/5 border-white/10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="h-7 w-7 text-pink-300" />
            </div>
            <h2 className="text-lg font-semibold">No history yet</h2>
            <p className="text-sm text-white/60 mt-1">
              When you complete tutorials, they’ll show up here.
            </p>
            <div className="mt-5 flex justify-center">
              <Link href="/tutorial">
                <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]">
                  Start a tutorial
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  betaLocal.clearTutorialHistory();
                  setItems([]);
                }}
              >
                Clear history
              </Button>
            </div>
            {items.map((it) => (
              <Card key={`${it.styleId}-${it.completedAt}`} className="p-4 bg-white/5 border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{it.styleName}</p>
                    <p className="text-sm text-white/60 mt-0.5">
                      Completed {new Date(it.completedAt).toLocaleString()}
                    </p>
                  </div>
                  <Link href={`/tutorial?style=${encodeURIComponent(it.styleId)}`}>
                    <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500">
                      Repeat
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

