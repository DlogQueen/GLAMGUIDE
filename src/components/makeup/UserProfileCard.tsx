"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Trophy, 
  Clock, 
  Heart, 
  Sparkles,
  Flame,
  Award,
  Star,
  Settings,
  ChevronRight,
  Bookmark
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Achievement, UserProfile } from "@/types/profile";

interface UserProfileCardProps {
  profile: UserProfile | null;
  unlockedAchievements: Achievement[];
  nextAchievements: Achievement[];
  onSignIn?: () => void;
}

// 4 Color Themes based on Digital Synopsis palettes
const THEMES = [
  {
    name: "Viola",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    bg: "bg-violet-600",
    accent: "violet",
    overlay: "bg-violet-500/30",
    statsBg: "bg-violet-50",
    textColor: "text-violet-700"
  },
  {
    name: "Strawberry Pink",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    bg: "bg-rose-500",
    accent: "rose",
    overlay: "bg-rose-500/30",
    statsBg: "bg-rose-50",
    textColor: "text-rose-700"
  },
  {
    name: "LA Sunset",
    gradient: "from-orange-500 via-pink-500 to-purple-600",
    bg: "bg-orange-500",
    accent: "orange",
    overlay: "bg-orange-500/30",
    statsBg: "bg-orange-50",
    textColor: "text-orange-700"
  },
  {
    name: "Hot Pink",
    gradient: "from-pink-600 via-rose-500 to-red-500",
    bg: "bg-pink-600",
    accent: "pink",
    overlay: "bg-pink-500/30",
    statsBg: "bg-pink-50",
    textColor: "text-pink-700"
  }
];

// Sample makeup look images for overlay
const LOOK_IMAGES = [
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=200&h=200&fit=crop&auto=format"
];

export function UserProfileCard({ 
  profile, 
  unlockedAchievements, 
  nextAchievements,
  onSignIn
}: UserProfileCardProps) {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const theme = THEMES[selectedTheme];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!profile) {
    return (
      <Card className="overflow-hidden border-0 shadow-2xl">
        <div className={`h-48 bg-gradient-to-br ${theme.gradient} relative`}>
          {/* Overlay Photos */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={LOOK_IMAGES[0]} 
              alt="" 
              className="absolute top-4 left-4 w-20 h-20 rounded-2xl object-cover opacity-60 rotate-[-8deg] shadow-lg"
              loading="lazy"
              decoding="async"
            />
            <img 
              src={LOOK_IMAGES[1]} 
              alt="" 
              className="absolute top-8 right-8 w-24 h-24 rounded-2xl object-cover opacity-50 rotate-[12deg] shadow-lg"
              loading="lazy"
              decoding="async"
            />
            <img 
              src={LOOK_IMAGES[2]} 
              alt="" 
              className="absolute bottom-4 left-1/3 w-16 h-16 rounded-2xl object-cover opacity-40 rotate-[5deg] shadow-lg"
              loading="lazy"
              decoding="async"
            />
          </div>
          
          {/* Profile Avatar */}
          <div className="absolute -bottom-10 left-6">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-2xl">
              <div className={`w-full h-full rounded-full ${theme.bg} flex items-center justify-center`}>
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 pb-8 px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Join Glam Guide</h3>
          <p className="text-gray-500 mb-6">Sign in to track your beauty journey</p>
          <Button 
            onClick={onSignIn}
            className={`w-full bg-gradient-to-r ${theme.gradient} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all`}
          >
            Sign In / Sign Up
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-2xl">
      {/* Header with Gradient and Overlay Photos */}
      <div className={`h-56 bg-gradient-to-br ${theme.gradient} relative`}>
        {/* Background Overlay Photos */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img 
            src={LOOK_IMAGES[0]} 
            alt="Look 1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.6, x: 0 }}
            className="absolute top-6 left-6 w-24 h-24 rounded-2xl object-cover rotate-[-8deg] shadow-xl border-2 border-white/30"
            loading="lazy"
            decoding="async"
          />
          <motion.img 
            src={LOOK_IMAGES[1]} 
            alt="Look 2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute top-10 right-10 w-28 h-28 rounded-2xl object-cover rotate-[12deg] shadow-xl border-2 border-white/30"
            loading="lazy"
            decoding="async"
          />
          <motion.img 
            src={LOOK_IMAGES[2]} 
            alt="Look 3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-8 left-1/4 w-20 h-20 rounded-2xl object-cover rotate-[5deg] shadow-xl border-2 border-white/30"
            loading="lazy"
            decoding="async"
          />
          <motion.img 
            src={LOOK_IMAGES[3]} 
            alt="Look 4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 0.45, y: 0 }}
            transition={{ delay: 0.15 }}
            className="absolute bottom-4 right-1/4 w-22 h-22 rounded-2xl object-cover rotate-[-5deg] shadow-xl border-2 border-white/30"
            loading="lazy"
            decoding="async"
          />
        </div>
        
        {/* Profile Avatar - Left Positioned */}
        <div className="absolute -bottom-12 left-6 z-10">
          <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-2xl">
            <div className={`w-full h-full rounded-full ${theme.bg} flex items-center justify-center relative overflow-hidden`}>
              <User className="w-14 h-14 text-white" />
              {/* Status indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white" />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="absolute top-4 right-4">
          <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Theme Selector Dots */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {THEMES.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setSelectedTheme(i)}
              className={`w-3 h-3 rounded-full transition-all ${t.bg} ${selectedTheme === i ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'}`}
            />
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 pb-6 px-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.personalInfo.displayName}</h2>
            <p className={`text-sm ${theme.textColor} font-medium`}>{theme.name} Member</p>
          </div>
          <Badge className={`${theme.bg} text-white border-0`}>
            <Flame className="w-3 h-3 mr-1" />
            {profile.stats.currentStreak} Day Streak
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          <StatBox 
            icon={<Sparkles className="w-4 h-4" />}
            value={profile.stats.totalLooksCreated}
            label="Looks"
            theme={theme}
          />
          <StatBox 
            icon={<Trophy className="w-4 h-4" />}
            value={profile.stats.tutorialsCompleted}
            label="Done"
            theme={theme}
          />
          <StatBox 
            icon={<Clock className="w-4 h-4" />}
            value={formatTime(Math.round((profile.stats.hoursPracticed || 0) * 60)).replace(/[hm]/g, '').trim()}
            label="Min"
            theme={theme}
          />
          <StatBox 
            icon={<Bookmark className="w-4 h-4" />}
            value={profile.savedTutorials.length}
            label="Saved"
            theme={theme}
          />
        </div>

        {/* Achievements Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Award className={`w-5 h-5 ${theme.textColor}`} />
              Achievements
            </h3>
            <span className="text-xs text-gray-500">
              {unlockedAchievements.length} unlocked
            </span>
          </div>

          {/* Achievement Badges */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {unlockedAchievements.slice(0, 6).map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className={`flex-shrink-0 w-14 h-14 rounded-2xl ${theme.statsBg} flex items-center justify-center text-2xl shadow-sm`}
                title={ach.name}
              >
                {ach.icon}
              </motion.div>
            ))}
            {unlockedAchievements.length > 6 && (
              <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${theme.statsBg} flex items-center justify-center text-sm font-bold ${theme.textColor}`}>
                +{unlockedAchievements.length - 6}
              </div>
            )}
          </div>
        </div>

        {/* Next Achievements Progress */}
        {nextAchievements.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Next to unlock</p>
            {nextAchievements.slice(0, 2).map((ach) => {
              const progress = Math.min(100, (ach.progress / Math.max(1, ach.maxProgress)) * 100);

              return (
                <div key={ach.id} className="flex items-center gap-3">
                  <span className="text-lg grayscale opacity-50">{ach.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{ach.name}</span>
                      <span className={`font-medium ${theme.textColor}`}>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <Button 
          className={`w-full mt-6 bg-gradient-to-r ${theme.gradient} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all group`}
        >
          Continue Journey
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}

function StatBox({ 
  icon, 
  value, 
  label, 
  theme 
}: { 
  icon: React.ReactNode; 
  value: number | string; 
  label: string; 
  theme: typeof THEMES[0];
}) {
  return (
    <div className={`${theme.statsBg} rounded-2xl p-3 text-center`}>
      <div className={`${theme.textColor} mb-1 flex justify-center`}>{icon}</div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}
