// 👤 USER PROFILE TYPES - Complete Profile System

export type ProfileTheme = 
  | 'elegant'      // Minimal, white/gold
  | 'glamorous'    // Dark purple, luxury
  | 'playful'      // Pastel, fun
  | 'artistic'     // Bold, creative
  | 'natural'      // Earth tones
  | 'minimalist';  // Black/white

export type ProfileLayout = 'grid' | 'masonry' | 'carousel' | 'timeline';

export interface PersonalInfo {
  displayName: string;
  username: string;
  bio: string;
  location: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  joinedDate: string;
  lastActive: string;
  accountType: 'free' | 'pro' | 'influencer' | 'mua';
  verified: boolean;
}

export interface SkinProfile {
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  skinTone: 'fair' | 'light' | 'medium' | 'tan' | 'deep' | 'rich';
  undertone: 'cool' | 'warm' | 'neutral' | 'olive';
  concerns: string[];
  
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'long';
  eyeShape: 'almond' | 'round' | 'hooded' | 'monolid' | 'upturned' | 'downturned';
  lipShape: 'full' | 'thin' | 'heart' | 'wide' | 'small';
  
  foundationShade?: string;
  concealerShade?: string;
  powderShade?: string;
  
  // AI confidence scores
  analysisConfidence: {
    faceShape: number;
    skinType: number;
    undertone: number;
  };
}

export interface MakeupPreferences {
  favoriteStyles: string[];
  preferredBrands: string[];
  budgetRange: 'budget' | 'mid' | 'luxury' | 'mix';
  
  // Routine
  morningRoutine: number; // minutes
  eveningRoutine: number;
  weekendStyle: 'natural' | 'glamorous' | 'creative' | 'minimal';
  
  // Product prefs
  preferredFinish: 'matte' | 'dewy' | 'satin' | 'natural';
  coverageLevel: 'sheer' | 'light' | 'medium' | 'full';
  crueltyFree: boolean;
  vegan: boolean;
  
  // Colors
  favoriteColors: string[];
  avoidedColors: string[];
  
  // Learning
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  preferredTutorialLength: 'short' | 'medium' | 'long';
}

export interface PortfolioLook {
  id: string;
  userId: string;
  title: string;
  description: string;
  style: string;
  date: string;
  
  // Photos
  beforePhoto?: string;
  afterPhoto: string;
  processPhotos: string[];
  arTryOnScreenshot?: string;
  
  // Products used
  productsUsed: {
    name: string;
    brand: string;
    shade?: string;
    category: string;
  }[];
  
  // Details
  techniques: string[];
  inspiration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeSpent: number;
  
  // Algorithm tracking
  skinCondition?: {
    before: string;
    after: string;
    concernsAddressed: string[];
  };
  
  // Engagement
  likes: number;
  comments: Comment[];
  shares: number;
  
  // Visibility
  isPublic: boolean;
  featured: boolean;
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
  isDeleted?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'skill' | 'social' | 'dedication' | 'special';
  unlockedAt?: string;
  progress: number; // 0-100
  maxProgress: number;
  hidden?: boolean; // Secret achievements
}

export interface UserStats {
  // Activity
  totalLooksCreated: number;
  tutorialsCompleted: number;
  tutorialsStarted: number;
  hoursPracticed: number;
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: string;
  weeklyPracticeDays: number[]; // [1,3,5] = Mon, Wed, Fri
  
  // Skills (0-100, calculated by algorithm)
  skills: {
    foundation: number;
    concealer: number;
    powder: number;
    blush: number;
    bronzer: number;
    highlighter: number;
    eyeshadow: number;
    eyeliner: number;
    mascara: number;
    eyebrows: number;
    lips: number;
    contouring: number;
    overall: number;
  };
  
  // Social
  followers: number;
  following: number;
  totalLikes: number;
  totalComments: number;
  featuredLooks: number;
  
  // Algorithm insights
  topTechniques: string[];
  improvementAreas: string[];
  recommendedStyles: string[];
  practiceHeatmap: { date: string; minutes: number }[];
}

export interface HabitTracking {
  dailyGoals: {
    practiceMinutes: number;
    tutorialsCompleted: number;
    looksCreated: number;
  };
  
  weeklyGoals: {
    practiceDays: number;
    newTechniques: number;
    productsTried: number;
  };
  
  monthlyGoals: {
    tutorialsCompleted: number;
    looksCreated: number;
    skillImprovement: number; // percentage
  };
  
  reminders: {
    enabled: boolean;
    time: string; // "09:00"
    days: number[]; // [1,2,3,4,5] = weekdays
    message: string;
  };
  
  // Algorithm learning
  optimalPracticeTimes: string[]; // When user is most active
  preferredTutorialTypes: string[];
  productiveDays: number[]; // Days with highest completion
}

export interface UserSettings {
  // Theme
  theme: ProfileTheme;
  layout: ProfileLayout;
  accentColor: string;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  tutorialReminders: boolean;
  weeklyDigest: boolean;
  achievementNotifications: boolean;
  socialNotifications: boolean;
  
  // Privacy
  profileVisibility: 'public' | 'followers' | 'private';
  showEmail: boolean;
  showLocation: boolean;
  allowComments: boolean;
  allowSharing: boolean;
  allowDownloads: boolean;
  
  // Content
  autoSaveLooks: boolean;
  arMirrorMode: 'front' | 'back';
  highQualityAR: boolean;
  dataSaver: boolean;
  
  // Algorithm
  allowSuggestions: boolean;
  allowDataAnalysis: boolean;
  personalizedAds: boolean;
}

// Main User Profile Interface
export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  
  avatar: {
    url: string;
    type: 'upload' | 'ar' | 'ai' | 'default';
    frame?: string;
  };
  
  coverPhoto?: string;
  headerStyle: 'banner' | 'quote' | 'achievement' | 'status' | 'moodboard';
  headerContent?: {
    title?: string;
    subtitle?: string;
    quote?: string;
    achievement?: string;
    status?: string;
  };
  
  personalInfo: PersonalInfo;
  skinProfile: SkinProfile;
  preferences: MakeupPreferences;
  settings: UserSettings;
  stats: UserStats;
  habitTracking: HabitTracking;
  
  // Collections
  achievements: Achievement[];
  portfolio: PortfolioLook[];
  savedTutorials: string[];
  favoriteProducts: string[];
  
  // Algorithm data
  suggestions: {
    tutorials: string[];
    products: string[];
    techniques: string[];
    styles: string[];
    generatedAt: string;
  };
  
  createdAt: string;
  updatedAt: string;
}
