"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, Profile, UserAchievement, FacialFeatures } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  completeTutorial: (tutorialId: string) => Promise<void>;
  createLook: () => Promise<void>;
  toggleFavorite: (styleId: string) => Promise<boolean>;
  isFavorite: (styleId: string) => boolean;
  saveFacialFeatures: (features: FacialFeatures) => Promise<void>;
  unlockedAchievements: UserAchievement[];
  nextAchievements: UserAchievement[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ACHIEVEMENTS: UserAchievement[] = [
  { id: "first_look", title: "First Steps", description: "Create your first custom look", icon: "✨", unlocked: false, progress: 0, requirement: 1 },
  { id: "tutorial_master", title: "Tutorial Master", description: "Complete 10 tutorials", icon: "🎓", unlocked: false, progress: 0, requirement: 10 },
  { id: "look_creator", title: "Look Creator", description: "Create 5 custom looks", icon: "🎨", unlocked: false, progress: 0, requirement: 5 },
  { id: "ar_explorer", title: "AR Explorer", description: "Try 20 different AR effects", icon: "🥽", unlocked: false, progress: 0, requirement: 20 },
  { id: "perfectionist", title: "Perfectionist", description: "Complete a tutorial with 100% timing", icon: "⭐", unlocked: false, progress: 0, requirement: 1 },
  { id: "daily_user", title: "Daily User", description: "Use the app 7 days in a row", icon: "🔥", unlocked: false, progress: 0, requirement: 7 },
  { id: "style_collector", title: "Style Collector", description: "Save 15 looks to favorites", icon: "💄", unlocked: false, progress: 0, requirement: 15 },
  { id: "time_master", title: "Time Master", description: "Spend 5 hours learning makeup", icon: "⏰", unlocked: false, progress: 0, requirement: 300 },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch or create profile
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      // Create new profile
      const newProfile = {
        user_id: userId,
        name: "Beauty Enthusiast",
        total_looks_created: 0,
        total_tutorials_completed: 0,
        total_time_spent: 0,
        favorite_styles: [],
        streak_days: 0,
        last_active_date: new Date().toISOString(),
        achievements: DEFAULT_ACHIEVEMENTS,
      };

      const { data: created, error: createError } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      if (!createError && created) {
        setProfile(created);
      }
    } else {
      setProfile(data);
      await updateStreak(data);
    }
  };

  // Update daily streak
  const updateStreak = async (currentProfile: Profile) => {
    const today = new Date().toDateString();
    const lastActive = currentProfile.last_active_date 
      ? new Date(currentProfile.last_active_date).toDateString() 
      : null;

    if (lastActive === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = currentProfile.streak_days;
    if (lastActive === yesterday.toDateString()) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    await supabase
      .from("profiles")
      .update({
        streak_days: newStreak,
        last_active_date: new Date().toISOString(),
      })
      .eq("user_id", currentProfile.user_id);

    setProfile(prev => prev ? { ...prev, streak_days: newStreak, last_active_date: new Date().toISOString() } : null);
  };

  // Sign up
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    return { error };
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Complete tutorial
  const completeTutorial = async (tutorialId: string) => {
    if (!user || !profile) return;

    const newCount = profile.total_tutorials_completed + 1;
    const updatedAchievements = profile.achievements.map(ach => {
      if (ach.id === "tutorial_master" && !ach.unlocked) {
        const newProgress = Math.min(newCount, ach.requirement);
        return {
          ...ach,
          progress: newProgress,
          unlocked: newProgress >= ach.requirement,
          unlocked_at: newProgress >= ach.requirement ? new Date().toISOString() : ach.unlocked_at,
        };
      }
      return ach;
    });

    await supabase
      .from("profiles")
      .update({
        total_tutorials_completed: newCount,
        achievements: updatedAchievements,
      })
      .eq("user_id", user.id);

    setProfile(prev => prev ? {
      ...prev,
      total_tutorials_completed: newCount,
      achievements: updatedAchievements,
    } : null);
  };

  // Create look
  const createLook = async () => {
    if (!user || !profile) return;

    const newCount = profile.total_looks_created + 1;
    const updatedAchievements = profile.achievements.map(ach => {
      if (ach.id === "first_look" || ach.id === "look_creator") {
        if (!ach.unlocked) {
          const newProgress = Math.min(newCount, ach.requirement);
          return {
            ...ach,
            progress: newProgress,
            unlocked: newProgress >= ach.requirement,
            unlocked_at: newProgress >= ach.requirement ? new Date().toISOString() : ach.unlocked_at,
          };
        }
      }
      return ach;
    });

    await supabase
      .from("profiles")
      .update({
        total_looks_created: newCount,
        achievements: updatedAchievements,
      })
      .eq("user_id", user.id);

    setProfile(prev => prev ? {
      ...prev,
      total_looks_created: newCount,
      achievements: updatedAchievements,
    } : null);
  };

  // Toggle favorite
  const toggleFavorite = async (styleId: string) => {
    if (!user || !profile) return false;

    const isFav = profile.favorite_styles.includes(styleId);
    const newFavorites = isFav
      ? profile.favorite_styles.filter(id => id !== styleId)
      : [...profile.favorite_styles, styleId];

    const updatedAchievements = profile.achievements.map(ach => {
      if (ach.id === "style_collector" && !ach.unlocked) {
        const newProgress = Math.min(newFavorites.length, ach.requirement);
        return {
          ...ach,
          progress: newProgress,
          unlocked: newProgress >= ach.requirement,
          unlocked_at: newProgress >= ach.requirement ? new Date().toISOString() : ach.unlocked_at,
        };
      }
      return ach;
    });

    await supabase
      .from("profiles")
      .update({
        favorite_styles: newFavorites,
        achievements: updatedAchievements,
      })
      .eq("user_id", user.id);

    setProfile(prev => prev ? {
      ...prev,
      favorite_styles: newFavorites,
      achievements: updatedAchievements,
    } : null);

    return !isFav;
  };

  // Check if style is favorite
  const isFavorite = (styleId: string) => {
    return profile?.favorite_styles.includes(styleId) ?? false;
  };

  // Save facial features
  const saveFacialFeatures = async (features: FacialFeatures) => {
    if (!user || !profile) return;

    await supabase
      .from("profiles")
      .update({ facial_features: features })
      .eq("user_id", user.id);

    setProfile(prev => prev ? { ...prev, facial_features: features } : null);
  };

  // Derived values
  const unlockedAchievements = profile?.achievements.filter(a => a.unlocked) ?? [];
  const nextAchievements = profile?.achievements
    .filter(a => !a.unlocked)
    .sort((a, b) => (b.progress / b.requirement) - (a.progress / a.requirement))
    .slice(0, 3) ?? [];

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
      updateProfile,
      completeTutorial,
      createLook,
      toggleFavorite,
      isFavorite,
      saveFacialFeatures,
      unlockedAchievements,
      nextAchievements,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
