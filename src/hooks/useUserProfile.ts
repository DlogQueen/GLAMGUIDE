"use client";

import { useState, useEffect, useCallback } from "react";
import { MakeupStyle, FacialFeatures } from "@/types";

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: number;
}

export interface UserProfile {
  name: string;
  totalLooksCreated: number;
  totalTutorialsCompleted: number;
  totalTimeSpent: number; // in minutes
  favoriteStyles: string[];
  facialFeatures?: FacialFeatures;
  achievements: UserAchievement[];
  streakDays: number;
  lastActiveDate?: Date;
}

const DEFAULT_ACHIEVEMENTS: UserAchievement[] = [
  { id: "first_look", title: "First Steps", description: "Create your first custom look", icon: "✨", requirement: 1 },
  { id: "tutorial_master", title: "Tutorial Master", description: "Complete 10 tutorials", icon: "🎓", requirement: 10 },
  { id: "look_creator", title: "Look Creator", description: "Create 5 custom looks", icon: "🎨", requirement: 5 },
  { id: "ar_explorer", title: "AR Explorer", description: "Try 20 different AR effects", icon: "🥽", requirement: 20 },
  { id: "perfectionist", title: "Perfectionist", description: "Complete a tutorial with 100% timing", icon: "⭐", requirement: 1 },
  { id: "daily_user", title: "Daily User", description: "Use the app 7 days in a row", icon: "🔥", requirement: 7 },
  { id: "style_collector", title: "Style Collector", description: "Save 15 looks to favorites", icon: "💄", requirement: 15 },
  { id: "time_master", title: "Time Master", description: "Spend 5 hours learning makeup", icon: "⏰", requirement: 300 },
];

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Beauty Enthusiast",
    totalLooksCreated: 0,
    totalTutorialsCompleted: 0,
    totalTimeSpent: 0,
    favoriteStyles: [],
    achievements: DEFAULT_ACHIEVEMENTS,
    streakDays: 0,
  });

  // Load profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("glam_guide_profile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile({
        ...parsed,
        achievements: parsed.achievements || DEFAULT_ACHIEVEMENTS,
      });
    }
  }, []);

  // Save profile when changed
  useEffect(() => {
    localStorage.setItem("glam_guide_profile", JSON.stringify(profile));
  }, [profile]);

  // Track daily streak
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastActive = profile.lastActiveDate 
      ? new Date(profile.lastActiveDate).toDateString() 
      : null;

    if (lastActive === today) return; // Already active today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = profile.streakDays;
    if (lastActive === yesterday.toDateString()) {
      newStreak += 1; // Continued streak
    } else if (!lastActive || lastActive !== today) {
      newStreak = 1; // New streak
    }

    setProfile(prev => ({
      ...prev,
      streakDays: newStreak,
      lastActiveDate: new Date(),
    }));
  }, [profile.lastActiveDate, profile.streakDays]);

  // Record tutorial completion
  const completeTutorial = useCallback((duration: number) => {
    setProfile(prev => {
      const newCount = prev.totalTutorialsCompleted + 1;
      const newTime = prev.totalTimeSpent + Math.floor(duration / 60);

      // Check achievements
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === "tutorial_master" && newCount >= ach.requirement && !ach.unlockedAt) {
          return { ...ach, unlockedAt: new Date() };
        }
        if (ach.id === "time_master" && newTime >= ach.requirement && !ach.unlockedAt) {
          return { ...ach, unlockedAt: new Date() };
        }
        return ach;
      });

      return {
        ...prev,
        totalTutorialsCompleted: newCount,
        totalTimeSpent: newTime,
        achievements: updatedAchievements,
      };
    });
    updateStreak();
  }, [updateStreak]);

  // Record custom look creation
  const createLook = useCallback(() => {
    setProfile(prev => {
      const newCount = prev.totalLooksCreated + 1;

      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === "first_look" && newCount >= 1 && !ach.unlockedAt) {
          return { ...ach, unlockedAt: new Date() };
        }
        if (ach.id === "look_creator" && newCount >= ach.requirement && !ach.unlockedAt) {
          return { ...ach, unlockedAt: new Date() };
        }
        return ach;
      });

      return {
        ...prev,
        totalLooksCreated: newCount,
        achievements: updatedAchievements,
      };
    });
    updateStreak();
  }, [updateStreak]);

  // Save favorite style
  const toggleFavorite = useCallback((styleId: string) => {
    setProfile(prev => {
      const isFavorite = prev.favoriteStyles.includes(styleId);
      const newFavorites = isFavorite
        ? prev.favoriteStyles.filter(id => id !== styleId)
        : [...prev.favoriteStyles, styleId];

      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === "style_collector" && newFavorites.length >= ach.requirement && !ach.unlockedAt) {
          return { ...ach, unlockedAt: new Date() };
        }
        return ach;
      });

      return {
        ...prev,
        favoriteStyles: newFavorites,
        achievements: updatedAchievements,
      };
    });
  }, []);

  // Save facial analysis
  const saveFacialFeatures = useCallback((features: FacialFeatures) => {
    setProfile(prev => ({
      ...prev,
      facialFeatures: features,
    }));
  }, []);

  // Update name
  const updateName = useCallback((name: string) => {
    setProfile(prev => ({ ...prev, name }));
  }, []);

  // Get unlocked achievements
  const unlockedAchievements = profile.achievements.filter(a => a.unlockedAt);
  const nextAchievements = profile.achievements
    .filter(a => !a.unlockedAt)
    .sort((a, b) => (a.requirement - profile.totalTutorialsCompleted) - (b.requirement - profile.totalTutorialsCompleted));

  return {
    profile,
    unlockedAchievements,
    nextAchievements,
    completeTutorial,
    createLook,
    toggleFavorite,
    saveFacialFeatures,
    updateName,
    isFavorite: (styleId: string) => profile.favoriteStyles.includes(styleId),
  };
}
