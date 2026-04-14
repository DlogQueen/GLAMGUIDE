"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Trophy, 
  Clock, 
  Heart, 
  Sparkles,
  Flame,
  Award,
  Star
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Profile, UserAchievement } from "@/lib/supabase";

interface UserProfileCardProps {
  profile: Profile | null;
  unlockedAchievements: UserAchievement[];
  nextAchievements: UserAchievement[];
  onSignIn?: () => void;
}

export function UserProfileCard({ 
  profile, 
  unlockedAchievements, 
  nextAchievements,
  onSignIn
}: UserProfileCardProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!profile) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-500">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="font-serif text-lg font-semibold text-gray-900">Sign In to Track Your Journey</h3>
        <p className="mt-2 text-sm text-gray-600">Create an account to save your progress, achievements, and favorite looks.</p>
        <Button 
          onClick={onSignIn}
          className="mt-6 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:from-fuchsia-600 hover:via-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Sign In / Sign Up
        </Button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-pink-200 bg-gradient-to-br from-white to-pink-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-pink-100">Glam Guide Journey</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 p-6">
        <StatCard 
          icon={<Sparkles className="h-5 w-5 text-amber-500" />}
          label="Looks Created"
          value={profile.total_looks_created.toString()}
        />
        <StatCard 
          icon={<Trophy className="h-5 w-5 text-purple-500" />}
          label="Tutorials Done"
          value={profile.total_tutorials_completed.toString()}
        />
        <StatCard 
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          label="Time Learning"
          value={formatTime(profile.total_time_spent)}
        />
        <StatCard 
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          label="Day Streak"
          value={`${profile.streak_days} days`}
          highlight={profile.streak_days > 5}
        />
      </div>

      {/* Favorites */}
      {profile.favorite_styles.length > 0 && (
        <div className="border-t border-rose-100 px-6 py-4">
          <div className="mb-2 flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-medium text-gray-700">
              {profile.favorite_styles.length} Saved Looks
            </span>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="border-t border-rose-100 px-6 py-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
          <Award className="h-5 w-5 text-amber-500" />
          Achievements
          <Badge variant="secondary" className="ml-auto">
            {unlockedAchievements.length}/{profile.achievements.length}
          </Badge>
        </h3>

        {/* Unlocked */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-4 grid grid-cols-4 gap-2">
            {unlockedAchievements.slice(0, 4).map((ach) => (
              <motion.div
                key={ach.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center rounded-lg bg-gradient-to-br from-pink-50 to-fuchsia-100 p-2"
                title={ach.title}
              >
                <span className="text-2xl">{ach.icon}</span>
                <span className="mt-1 text-center text-[10px] font-medium text-fuchsia-800">
                  {ach.title}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Next to unlock */}
        {nextAchievements.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Next to unlock:</p>
            <div className="space-y-2">
              {nextAchievements.slice(0, 2).map((ach) => {
                let progress = 0;
                if (ach.id === "tutorial_master") {
                  progress = Math.min(100, (profile.total_tutorials_completed / ach.requirement) * 100);
                } else if (ach.id === "look_creator") {
                  progress = Math.min(100, (profile.total_looks_created / ach.requirement) * 100);
                } else if (ach.id === "time_master") {
                  progress = Math.min(100, (profile.total_time_spent / ach.requirement) * 100);
                }

                return (
                  <div key={ach.id} className="rounded-lg bg-gray-50 p-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <span className="opacity-50 grayscale">{ach.icon}</span>
                        <span className="text-gray-600">{ach.title}</span>
                      </span>
                      <span className="text-gray-500">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div 
                        className="h-full rounded-full bg-gray-400 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  highlight = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? 'bg-gradient-to-br from-orange-50 to-amber-50 ring-1 ring-orange-200' : 'bg-gray-50'}`}>
      <div className="mb-1">{icon}</div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
