"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { ProfileService } from "@/services/profileService";
import type { UserProfile, Achievement } from "@/types/profile";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  completeTutorial: (tutorialId: string) => Promise<void>;
  createLook: () => Promise<void>;
  toggleFavorite: (styleId: string) => Promise<boolean>;
  isFavorite: (styleId: string) => boolean;
  saveFacialFeatures: (features: { faceShape?: string; eyeShape?: string; skinTone?: string; undertone?: string }) => Promise<void>;
  unlockedAchievements: Achievement[];
  nextAchievements: Achievement[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email || undefined);
      }
      
      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email || undefined);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch or create profile (rich profile schema)
  const fetchProfile = async (userId: string, email?: string) => {
    const existing = await ProfileService.getFullProfile(userId);
    if (existing) {
      setProfile(existing);
      return;
    }

    // Create on first login/signup
    if (email) {
      const created = await ProfileService.createProfile(userId, email);
      setProfile(created);
      return;
    }

    // If email is missing, retry fetch later
    setProfile(null);
  };

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const refreshed = await ProfileService.getFullProfile(user.id);
    setProfile(refreshed);
  }, [user]);

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

  // Complete tutorial
  const completeTutorial = async (tutorialId: string) => {
    if (!user) return;

    // Best-effort update in DB; fall back to local state if schema isn't deployed.
    try {
      const { data: stats } = await supabase
        .from("user_stats")
        .select("tutorials_completed")
        .eq("user_id", user.id)
        .single();

      const nextCount = (stats?.tutorials_completed || 0) + 1;
      await supabase
        .from("user_stats")
        .update({ tutorials_completed: nextCount })
        .eq("user_id", user.id);
    } catch {
      // no-op
    }

    await refreshProfile();
  };

  // Create look
  const createLook = async () => {
    if (!user) return;
    // Placeholder for beta: create looks via ProfileService when wired from UI.
    await refreshProfile();
  };

  // Toggle favorite
  const toggleFavorite = async (styleId: string) => {
    if (!user || !profile) return false;

    const current = profile.preferences.favoriteStyles || [];
    const isFav = current.includes(styleId);
    const next = isFav ? current.filter((id) => id !== styleId) : [...current, styleId];

    try {
      await supabase
        .from("makeup_preferences")
        .update({ favorite_styles: next })
        .eq("user_id", user.id);
    } catch {
      // no-op
    }

    setProfile((p) =>
      p
        ? {
            ...p,
            preferences: { ...p.preferences, favoriteStyles: next },
          }
        : p
    );

    return !isFav;
  };

  // Check if style is favorite
  const isFavorite = (styleId: string) => {
    return profile?.preferences?.favoriteStyles?.includes(styleId) ?? false;
  };

  // Save facial features
  const saveFacialFeatures = async (features: { faceShape?: string; eyeShape?: string; skinTone?: string; undertone?: string }) => {
    if (!user) return;

    try {
      await supabase
        .from("skin_profiles")
        .update({
          face_shape: features.faceShape,
          eye_shape: features.eyeShape,
          skin_tone: features.skinTone,
          undertone: features.undertone,
        })
        .eq("user_id", user.id);
    } catch {
      // no-op
    }

    await refreshProfile();
  };

  // Derived values
  const unlockedAchievements = profile?.achievements.filter((a) => !!a.unlockedAt) ?? [];
  const nextAchievements =
    profile?.achievements
      .filter((a) => !a.unlockedAt)
      .sort((a, b) => (b.progress / Math.max(1, b.maxProgress)) - (a.progress / Math.max(1, a.maxProgress)))
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
      refreshProfile,
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
