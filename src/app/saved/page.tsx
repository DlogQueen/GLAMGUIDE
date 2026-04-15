"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Bookmark, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";
import { presetMakeupStyles } from "@/data/makeupStyles";
import { useAuth } from "@/contexts/AuthContext";

export default function SavedPage() {
  const { profile, toggleFavorite, isFavorite } = useAuth();
  const favorites = profile?.preferences?.favoriteStyles || [];
  const favoriteStyles = useMemo(() => {
    const byId = new Map(presetMakeupStyles.map((s) => [s.id, s]));
    return favorites.map((id) => byId.get(id)).filter(Boolean);
  }, [favorites]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden selection:bg-pink-500/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-pink-400" />
              Saved
            </h1>
            <p className="text-white/60 mt-1">Your saved looks and favorites.</p>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              Back to Dashboard
            </Button>
          </Link>
        </header>

        {favoriteStyles.length === 0 ? (
          <Card className="p-8 bg-white/5 border-white/10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 mx-auto flex items-center justify-center mb-4">
              <Heart className="h-7 w-7 text-pink-300" />
            </div>
            <h2 className="text-lg font-semibold">No saved items yet</h2>
            <p className="text-sm text-white/60 mt-1">
              Save looks from Explore to find them here.
            </p>
            <div className="mt-5 flex justify-center">
              <Link href="/explore">
                <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]">
                  Explore looks
                </Button>
              </Link>
            </div>
            {!profile && (
              <p className="text-[11px] text-white/40 mt-4">
                Sign in to sync your saved looks across devices.
              </p>
            )}
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteStyles.map((style) => {
              if (!style) return null;
              const fav = isFavorite(style.id);
              return (
                <Card key={style.id} className="overflow-hidden bg-white/5 border-white/10">
                  <div className="relative aspect-[4/5] bg-black/20">
                    <img src={style.imageUrl} alt={style.name} className="h-full w-full object-cover opacity-90" />
                    <button
                      onClick={() => toggleFavorite(style.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/55 transition-colors"
                      title="Remove from favorites"
                      aria-label="Unsave"
                    >
                      <Heart className={fav ? "h-5 w-5 text-pink-400 fill-pink-400" : "h-5 w-5 text-white/80"} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold truncate">{style.name}</p>
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">{style.description}</p>
                    <div className="mt-4">
                      <Link href={`/tutorial?style=${encodeURIComponent(style.id)}`}>
                        <Button className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]">
                          Start again
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

