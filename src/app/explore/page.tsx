"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Compass, Heart, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";
import { presetMakeupStyles } from "@/data/makeupStyles";
import { useAuth } from "@/contexts/AuthContext";

export default function ExplorePage() {
  const { profile, toggleFavorite, isFavorite } = useAuth();
  const styles = useMemo(() => presetMakeupStyles.slice(0, 12), []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden selection:bg-pink-500/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Compass className="h-6 w-6 text-pink-400" />
              Explore
            </h1>
            <p className="text-white/60 mt-1">Discover styles, tutorials, and trending looks.</p>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              Back to Dashboard
            </Button>
          </Link>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {styles.map((style) => {
            const fav = isFavorite(style.id);
            return (
              <Card key={style.id} className="overflow-hidden bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <div className="relative aspect-[4/5] bg-black/20">
                  <img src={style.imageUrl} alt={style.name} className="h-full w-full object-cover opacity-90" />
                  <button
                    onClick={() => toggleFavorite(style.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/55 transition-colors"
                    title={fav ? "Remove from favorites" : "Save to favorites"}
                    aria-label={fav ? "Unsave" : "Save"}
                  >
                    <Heart className={fav ? "h-5 w-5 text-pink-400 fill-pink-400" : "h-5 w-5 text-white/80"} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{style.name}</p>
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">{style.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/tutorial?style=${encodeURIComponent(style.id)}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]">
                        Start
                      </Button>
                    </Link>
                    <Link href="/chat">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  {!profile && (
                    <p className="text-[11px] text-white/40 mt-3">
                      Sign in to sync favorites across devices.
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

