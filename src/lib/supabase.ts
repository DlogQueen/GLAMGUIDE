import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://stalbdpnwfbiqwytelxv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YWxiZHBud2ZiaXF3eXRlbHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDg1NDksImV4cCI6MjA5MTY4NDU0OX0.JBl_hIHaGX4uABKHC6c1djYxHT1TBgeVWoM_4eBuMPk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Database types
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  total_looks_created: number;
  total_tutorials_completed: number;
  total_time_spent: number;
  favorite_styles: string[];
  streak_days: number;
  last_active_date: string;
  achievements: UserAchievement[];
  facial_features?: FacialFeatures;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
  progress: number;
  requirement: number;
}

export interface FacialFeatures {
  faceShape: string;
  eyeShape: string;
  skinTone: string;
  undertone: string;
}
