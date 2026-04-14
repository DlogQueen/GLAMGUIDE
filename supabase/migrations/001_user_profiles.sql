-- 👤 USER PROFILES DATABASE SCHEMA
-- Run this in Supabase SQL Editor

-- ============================================
-- CORE PROFILE TABLES
-- ============================================

-- Main user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT,
  
  -- Avatar & Visual
  avatar_url TEXT,
  avatar_type TEXT DEFAULT 'default', -- 'upload', 'ar', 'ai', 'default'
  avatar_frame TEXT,
  cover_photo_url TEXT,
  
  -- Header Style
  header_style TEXT DEFAULT 'banner', -- 'banner', 'quote', 'achievement', 'status', 'moodboard'
  header_content JSONB DEFAULT '{}',
  
  -- Personal Info
  display_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  location TEXT,
  website TEXT,
  instagram TEXT,
  tiktok TEXT,
  youtube TEXT,
  
  -- Account
  account_type TEXT DEFAULT 'free', -- 'free', 'pro', 'influencer', 'mua'
  verified BOOLEAN DEFAULT FALSE,
  
  -- Settings
  profile_theme TEXT DEFAULT 'glamorous', -- 'elegant', 'glamorous', 'playful', 'artistic', 'natural', 'minimalist'
  profile_layout TEXT DEFAULT 'grid', -- 'grid', 'masonry', 'carousel', 'timeline'
  accent_color TEXT DEFAULT '#a855f7',
  
  -- Privacy
  profile_visibility TEXT DEFAULT 'public', -- 'public', 'followers', 'private'
  show_email BOOLEAN DEFAULT FALSE,
  show_location BOOLEAN DEFAULT TRUE,
  allow_comments BOOLEAN DEFAULT TRUE,
  allow_sharing BOOLEAN DEFAULT TRUE,
  allow_suggestions BOOLEAN DEFAULT TRUE,
  
  -- Notifications
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  tutorial_reminders BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  achievement_notifications BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$')
);

-- Skin profile table
CREATE TABLE IF NOT EXISTS public.skin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Skin Characteristics
  skin_type TEXT, -- 'oily', 'dry', 'combination', 'normal', 'sensitive'
  skin_tone TEXT, -- 'fair', 'light', 'medium', 'tan', 'deep', 'rich'
  undertone TEXT, -- 'cool', 'warm', 'neutral', 'olive'
  concerns TEXT[] DEFAULT '{}',
  
  -- Face Analysis
  face_shape TEXT, -- 'oval', 'round', 'square', 'heart', 'diamond', 'long'
  eye_shape TEXT, -- 'almond', 'round', 'hooded', 'monolid', 'upturned', 'downturned'
  lip_shape TEXT, -- 'full', 'thin', 'heart', 'wide', 'small'
  
  -- Product Shades
  foundation_shade TEXT,
  concealer_shade TEXT,
  powder_shade TEXT,
  
  -- AI Confidence
  analysis_confidence JSONB DEFAULT '{}',
  
  -- Analysis data
  face_analysis_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Makeup preferences table
CREATE TABLE IF NOT EXISTS public.makeup_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Style Preferences
  favorite_styles TEXT[] DEFAULT '{}',
  preferred_brands TEXT[] DEFAULT '{}',
  budget_range TEXT DEFAULT 'mid', -- 'budget', 'mid', 'luxury', 'mix'
  
  -- Routine
  morning_routine INTEGER DEFAULT 15, -- minutes
  evening_routine INTEGER DEFAULT 10,
  weekend_style TEXT DEFAULT 'natural', -- 'natural', 'glamorous', 'creative', 'minimal'
  
  -- Product Preferences
  preferred_finish TEXT DEFAULT 'dewy', -- 'matte', 'dewy', 'satin', 'natural'
  coverage_level TEXT DEFAULT 'medium', -- 'sheer', 'light', 'medium', 'full'
  cruelty_free BOOLEAN DEFAULT FALSE,
  vegan BOOLEAN DEFAULT FALSE,
  
  -- Colors
  favorite_colors TEXT[] DEFAULT '{}',
  avoided_colors TEXT[] DEFAULT '{}',
  
  -- Learning
  skill_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  learning_goals TEXT[] DEFAULT '{}',
  preferred_tutorial_length TEXT DEFAULT 'medium', -- 'short', 'medium', 'long'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PORTFOLIO & CONTENT TABLES
-- ============================================

-- Portfolio looks table
CREATE TABLE IF NOT EXISTS public.portfolio_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  style TEXT,
  
  -- Photos
  before_photo_url TEXT,
  after_photo_url TEXT NOT NULL,
  process_photos TEXT[] DEFAULT '{}',
  ar_tryon_screenshot_url TEXT,
  
  -- Details
  difficulty TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  time_spent INTEGER, -- minutes
  inspiration TEXT,
  techniques TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Skin condition tracking
  skin_condition JSONB DEFAULT '{}',
  
  -- Visibility
  is_public BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products used in looks
CREATE TABLE IF NOT EXISTS public.look_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  look_id UUID REFERENCES public.portfolio_looks(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  brand TEXT,
  shade TEXT,
  category TEXT NOT NULL, -- 'foundation', 'concealer', 'eyeshadow', etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  look_id UUID REFERENCES public.portfolio_looks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  text TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- For nested comments (replies)
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table (for both looks and comments)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Polymorphic like (either look or comment)
  look_id UUID REFERENCES public.portfolio_looks(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure only one type is liked
  CONSTRAINT one_like_target CHECK (
    (look_id IS NOT NULL AND comment_id IS NULL) OR
    (look_id IS NULL AND comment_id IS NOT NULL)
  ),
  -- Prevent duplicate likes
  CONSTRAINT unique_like UNIQUE (user_id, look_id, comment_id)
);

-- ============================================
-- STATS & ACHIEVEMENTS TABLES
-- ============================================

-- User stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Activity
  total_looks_created INTEGER DEFAULT 0,
  tutorials_completed INTEGER DEFAULT 0,
  tutorials_started INTEGER DEFAULT 0,
  hours_practiced DECIMAL(10,2) DEFAULT 0,
  
  -- Streaks
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  
  -- Skills (0-100)
  skill_foundation INTEGER DEFAULT 0,
  skill_concealer INTEGER DEFAULT 0,
  skill_powder INTEGER DEFAULT 0,
  skill_blush INTEGER DEFAULT 0,
  skill_bronzer INTEGER DEFAULT 0,
  skill_highlighter INTEGER DEFAULT 0,
  skill_eyeshadow INTEGER DEFAULT 0,
  skill_eyeliner INTEGER DEFAULT 0,
  skill_mascara INTEGER DEFAULT 0,
  skill_eyebrows INTEGER DEFAULT 0,
  skill_lips INTEGER DEFAULT 0,
  skill_contouring INTEGER DEFAULT 0,
  skill_overall INTEGER DEFAULT 0,
  
  -- Social
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  total_likes_received INTEGER DEFAULT 0,
  total_comments_received INTEGER DEFAULT 0,
  featured_looks_count INTEGER DEFAULT 0,
  
  -- Algorithm data (stored as JSON for flexibility)
  top_techniques TEXT[] DEFAULT '{}',
  improvement_areas TEXT[] DEFAULT '{}',
  recommended_styles TEXT[] DEFAULT '{}',
  practice_heatmap JSONB DEFAULT '[]',
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements definitions table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT DEFAULT '🏆',
  color TEXT DEFAULT '#fbbf24',
  tier TEXT NOT NULL, -- 'bronze', 'silver', 'gold', 'platinum'
  category TEXT NOT NULL, -- 'skill', 'social', 'dedication', 'special'
  
  -- Requirements to unlock
  requirement_type TEXT, -- 'streak', 'tutorials', 'looks', 'followers', 'likes', 'custom'
  requirement_value INTEGER,
  
  hidden BOOLEAN DEFAULT FALSE, -- Secret achievements
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements (junction table)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  
  progress INTEGER DEFAULT 0,
  max_progress INTEGER DEFAULT 100,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- HABIT TRACKING TABLES
-- ============================================

-- Habit tracking table
CREATE TABLE IF NOT EXISTS public.habit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Daily goals
  daily_practice_minutes INTEGER DEFAULT 15,
  daily_tutorials_target INTEGER DEFAULT 1,
  daily_looks_target INTEGER DEFAULT 0,
  
  -- Weekly goals
  weekly_practice_days INTEGER DEFAULT 3,
  weekly_new_techniques INTEGER DEFAULT 1,
  weekly_products_tried INTEGER DEFAULT 2,
  
  -- Monthly goals
  monthly_tutorials_target INTEGER DEFAULT 5,
  monthly_looks_target INTEGER DEFAULT 3,
  monthly_skill_improvement INTEGER DEFAULT 10, -- percentage
  
  -- Reminders
  reminders_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '09:00',
  reminder_days INTEGER[] DEFAULT '{1,2,3,4,5}', -- Mon-Fri
  
  -- Algorithm learning
  optimal_practice_times TEXT[] DEFAULT '{}',
  preferred_tutorial_types TEXT[] DEFAULT '{}',
  productive_days INTEGER[] DEFAULT '{}',
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice log (for detailed tracking)
CREATE TABLE IF NOT EXISTS public.practice_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  minutes_practiced INTEGER NOT NULL,
  tutorial_id UUID, -- If practicing a specific tutorial
  look_id UUID, -- If creating a look
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- ============================================
-- SAVED CONTENT TABLES
-- ============================================

-- Saved tutorials
CREATE TABLE IF NOT EXISTS public.saved_tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tutorial_id TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, tutorial_id)
);

-- Favorite products
CREATE TABLE IF NOT EXISTS public.favorite_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  product_name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  shade TEXT,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follows system
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Profile indexes
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_account_type ON public.profiles(account_type);

-- Portfolio indexes
CREATE INDEX idx_portfolio_user_id ON public.portfolio_looks(user_id);
CREATE INDEX idx_portfolio_is_public ON public.portfolio_looks(is_public);
CREATE INDEX idx_portfolio_featured ON public.portfolio_looks(featured);
CREATE INDEX idx_portfolio_created_at ON public.portfolio_looks(created_at DESC);

-- Comments indexes
CREATE INDEX idx_comments_look_id ON public.comments(look_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- Stats indexes
CREATE INDEX idx_user_stats_streak ON public.user_stats(current_streak DESC);
CREATE INDEX idx_user_stats_overall_skill ON public.user_stats(skill_overall DESC);

-- Follows indexes
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skin_profiles_updated_at
  BEFORE UPDATE ON public.skin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_makeup_preferences_updated_at
  BEFORE UPDATE ON public.makeup_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_looks_updated_at
  BEFORE UPDATE ON public.portfolio_looks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update stats on new look
CREATE OR REPLACE FUNCTION increment_look_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_looks_created = total_looks_created + 1,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_look_created
  AFTER INSERT ON public.portfolio_looks
  FOR EACH ROW EXECUTE FUNCTION increment_look_count();

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.look_id IS NOT NULL THEN
    UPDATE public.portfolio_looks
    SET likes_count = likes_count + 1
    WHERE id = NEW.look_id;
  ELSIF NEW.comment_id IS NOT NULL THEN
    UPDATE public.comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_like_created
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_like_counts();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.makeup_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.look_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read public profiles, only edit own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (profile_visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Portfolio: Public looks viewable, private only by owner
CREATE POLICY "Public looks are viewable by everyone"
  ON public.portfolio_looks FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can manage own looks"
  ON public.portfolio_looks FOR ALL
  USING (auth.uid() = user_id);

-- Comments: Viewable by all if look is public, manage own
CREATE POLICY "Comments on public looks are viewable"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_looks 
      WHERE id = comments.look_id 
      AND (is_public = TRUE OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own comments"
  ON public.comments FOR ALL
  USING (auth.uid() = user_id);

-- Add more policies as needed...

-- ============================================
-- DEFAULT ACHIEVEMENTS DATA
-- ============================================

INSERT INTO public.achievements (name, description, icon, color, tier, category, requirement_type, requirement_value) VALUES
-- Streak achievements
('Getting Started', 'Practiced makeup for 3 days in a row', '🔥', '#f59e0b', 'bronze', 'dedication', 'streak', 3),
('Week Warrior', 'Practiced makeup for 7 days in a row', '🔥', '#f59e0b', 'silver', 'dedication', 'streak', 7),
('Two Week Wonder', 'Practiced makeup for 14 days in a row', '🔥', '#f59e0b', 'silver', 'dedication', 'streak', 14),
('Monthly Master', 'Practiced makeup for 30 days in a row', '🔥', '#f59e0b', 'gold', 'dedication', 'streak', 30),
('Century Club', 'Practiced makeup for 100 days in a row', '🔥', '#f59e0b', 'platinum', 'dedication', 'streak', 100),

-- Tutorial achievements
('First Steps', 'Completed your first tutorial', '📚', '#3b82f6', 'bronze', 'skill', 'tutorials', 1),
('Tutorial Taker', 'Completed 5 tutorials', '📚', '#3b82f6', 'bronze', 'skill', 'tutorials', 5),
('Dedicated Learner', 'Completed 10 tutorials', '📚', '#3b82f6', 'silver', 'skill', 'tutorials', 10),
('Knowledge Seeker', 'Completed 25 tutorials', '📚', '#3b82f6', 'gold', 'skill', 'tutorials', 25),
('Tutorial Master', 'Completed 50 tutorials', '📚', '#3b82f6', 'platinum', 'skill', 'tutorials', 50),

-- Portfolio achievements
('First Look', 'Created your first portfolio look', '📸', '#ec4899', 'bronze', 'skill', 'looks', 1),
('Portfolio Builder', 'Created 5 looks', '📸', '#ec4899', 'bronze', 'skill', 'looks', 5),
('Creative Collector', 'Created 10 looks', '📸', '#ec4899', 'silver', 'skill', 'looks', 10),
('Gallery Owner', 'Created 25 looks', '📸', '#ec4899', 'gold', 'skill', 'looks', 25),
('Portfolio Legend', 'Created 50 looks', '📸', '#ec4899', 'platinum', 'skill', 'looks', 50),

-- Social achievements
('Rising Star', 'Reached 10 followers', '⭐', '#fbbf24', 'bronze', 'social', 'followers', 10),
('Influencer', 'Reached 100 followers', '⭐', '#fbbf24', 'silver', 'social', 'followers', 100),
('Makeup Guru', 'Reached 1,000 followers', '⭐', '#fbbf24', 'gold', 'social', 'followers', 1000),
('Liked & Loved', 'Received 50 likes', '❤️', '#ef4444', 'silver', 'social', 'likes', 50),
('Popular Artist', 'Received 500 likes', '❤️', '#ef4444', 'gold', 'social', 'likes', 500)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- DONE!
-- ============================================

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
