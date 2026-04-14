# 👤 USER PROFILE DESIGN - Glam Guide AI

## 🎯 CORE PROFILE SECTIONS

### 1. **LAYOUT THEME (Portfolio Style)**

#### Theme Options:
```typescript
type ProfileTheme = 
  | 'elegant'      // Minimal, white/gold, professional
  | 'glamorous'    // Dark purple, sparkly, luxury
  | 'playful'      // Pastel colors, fun, casual
  | 'artistic'     // Bold colors, creative, unique
  | 'natural'      // Earth tones, organic, clean
  | 'minimalist';  // Black/white, simple, modern
```

#### Layout Styles:
- **Grid** - Pinterest-style photo grid
- **Masonry** - Staggered photo layout  
- **Carousel** - Swipe through looks
- **Timeline** - Chronological makeup journey
- **Gallery** - Large featured photos
- **Split** - Left: photos, Right: stats/info

---

### 2. **PROFILE PICTURE SYSTEM**

#### Avatar Options:
- **Upload Photo** - Custom profile pic
- **AR Selfie** - Real-time makeup preview
- **AI Generated** - Create avatar from skin analysis
- **Style Avatars** - Pre-made glamorous avatars
- **Live Camera** - Dynamic profile pic

#### Frame/Border Styles:
- Gold elegant frame
- Neon glow border
- Sparkle animation
- Seasonal themes (holiday, summer)
- Custom color picker

---

### 3. **STYLE HEADERS & BANNERS**

#### Header Types:
- **Hero Banner** - Full-width cover photo
- **Quote Header** - Favorite makeup quote
- **Achievement Badge** - Top achievement display
- **Live Status** - "Currently practicing: Smokey Eye"
- **Mood Board** - Collage of inspiration

#### Header Content:
- Cover photo (makeup look or aesthetic)
- Username & handle
- Tagline/Bio (150 chars)
- Location
- Social links
- Verified badge (for pros)

---

### 4. **PERSONAL INFORMATION**

#### Basic Info:
```typescript
interface PersonalInfo {
  displayName: string;           // "GlamQueen Sarah"
  username: string;              // @sarah_makeup
  bio: string;                   // "Aspiring MUA | Korean beauty lover"
  location: string;              // "Los Angeles, CA"
  website: string;               // Portfolio or Instagram
  joinedDate: Date;              // Member since
  accountType: 'free' | 'pro' | 'influencer' | 'mua';
}
```

#### Contact/Social:
- Instagram handle
- TikTok username
- YouTube channel
- Email (private)
- Website/portfolio

---

### 5. **SKIN ANALYSIS DASHBOARD**

#### Skin Profile:
```typescript
interface SkinProfile {
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  skinTone: 'fair' | 'light' | 'medium' | 'tan' | 'deep' | 'rich';
  undertone: 'cool' | 'warm' | 'neutral' | 'olive';
  concerns: string[];            // ['acne', 'dark circles', 'aging']
  
  // AI Analysis Results
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'long';
  eyeShape: 'almond' | 'round' | 'hooded' | 'monolid' | 'upturned' | 'downturned';
  lipShape: 'full' | 'thin' | 'heart' | 'wide' | 'small';
  
  // Measurements
  foundationShade: string;       // "MAC NC25"
  concealerShade: string;
  powderShade: string;
}
```

#### Visual Skin Map:
- Face diagram with marked areas
- Problem zones highlighted
- Before/after photo slots
- Skin journey timeline

---

### 6. **MAKEUP PREFERENCES**

#### Style Preferences:
```typescript
interface MakeupPreferences {
  favoriteStyles: string[];      // ['korean-glass-skin', 'smokey-eye']
  preferredBrands: string[];     // ['Fenty', 'Rare Beauty', 'MAC']
  budgetRange: 'budget' | 'mid' | 'luxury' | 'mix';
  
  // Daily Routine
  morningRoutine: number;        // minutes
  eveningRoutine: number;
  weekendStyle: string;          // "Glamorous" | "Natural"
  
  // Product Preferences
  preferredFinish: 'matte' | 'dewy' | 'satin' | 'natural';
  coverageLevel: 'sheer' | 'light' | 'medium' | 'full';
  crueltyFree: boolean;
  vegan: boolean;
  
  // Color Preferences
  favoriteColors: string[];      // ['rose gold', 'burgundy']
  avoidedColors: string[];       // ['orange', 'neon green']
}
```

---

### 7. **PORTFOLIO / LOOKS GALLERY**

#### Gallery Structure:
```typescript
interface PortfolioLook {
  id: string;
  title: string;
  description: string;
  style: string;                 // "Evening Glam"
  date: Date;
  
  // Photos
  beforePhoto?: string;
  afterPhoto: string;
  processPhotos: string[];       // Step by step
  arTryOnScreenshot?: string;
  
  // Details
  productsUsed: Product[];
  techniques: string[];
  inspiration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeSpent: number;             // minutes
  
  // Engagement
  likes: number;
  comments: Comment[];
  isPublic: boolean;
  featured: boolean;
}
```

#### Gallery Views:
- **Grid View** - Instagram-style
- **Before/After** - Side by side
- **Process View** - Step timeline
- **AR View** - Virtual try-on results
- **Video Reels** - 15-60 sec clips

---

### 8. **ACHIEVEMENTS & STATS**

#### Achievement System:
```typescript
interface Achievement {
  id: string;
  name: string;                  // "Korean Beauty Master"
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt: Date;
  progress: number;              // 0-100
}

interface UserStats {
  totalLooksCreated: number;
  tutorialsCompleted: number;
  tutorialsStarted: number;
  hoursPracticed: number;
  streakDays: number;
  longestStreak: number;
  
  // Skills
  skills: {
    eyeliner: number;           // 0-100
    foundation: number;
    contouring: number;
    eyeshadow: number;
    lips: number;
  };
  
  // Social
  followers: number;
  following: number;
  totalLikes: number;
  featuredLooks: number;
}
```

#### Badges Display:
- Skill badges (Eyeliner Queen, Foundation Pro)
- Tutorial badges (10 tutorials completed)
- Community badges (100 likes, Top Creator)
- Special badges (Early Adopter, Beta Tester)

---

### 9. **SETTINGS & PRIVACY**

#### Account Settings:
```typescript
interface UserSettings {
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  tutorialReminders: boolean;
  weeklyDigest: boolean;
  
  // Privacy
  profileVisibility: 'public' | 'followers' | 'private';
  showEmail: boolean;
  allowComments: boolean;
  allowSharing: boolean;
  
  // Display
  theme: ProfileTheme;
  layout: 'grid' | 'masonry' | 'carousel' | 'timeline';
  language: string;
  
  // App Preferences
  autoPlayVoice: boolean;
  arMirrorMode: 'front' | 'back';
  highQualityAR: boolean;
  dataSaver: boolean;
}
```

---

## 🎨 UI COMPONENT STRUCTURE

### Profile Page Layout:
```
┌─────────────────────────────────────┐
│  COVER BANNER (Customizable)        │
├─────────────────────────────────────┤
│  [PROFILE PIC]  @username             │
│  Display Name                        │
│  Bio / Tagline                       │
│  [Follow] [Message]                 │
├─────────────────────────────────────┤
│  STATS BAR: Looks | Tutorials |     │
│  Followers | Hours Practiced         │
├─────────────────────────────────────┤
│  SKIN DASHBOARD (Collapsible)       │
│  Face Shape | Skin Type | Concerns  │
├─────────────────────────────────────┤
│  GALLERY VIEW SWITCHER              │
│  [Grid] [Timeline] [Before/After]   │
├─────────────────────────────────────┤
│  PORTFOLIO GRID                     │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │Look1│ │Look2│ │Look3│ ...        │
│  └─────┘ └─────┘ └─────┘           │
├─────────────────────────────────────┤
│  ACHIEVEMENTS ROW                   │
│  🏆 🥇 🎖️ 🏅 (Scrollable)          │
├─────────────────────────────────────┤
│  PREFERENCES SUMMARY                │
│  Favorite Styles | Brands | Colors  │
└─────────────────────────────────────┘
```

---

## 🔐 DATABASE SCHEMA (To Implement After Design)

### Tables:
1. **profiles** - Core profile data
2. **skin_profiles** - AI analysis results
3. **portfolio_looks** - User's makeup looks
4. **achievements** - Badge definitions
5. **user_achievements** - User's unlocked badges
6. **user_stats** - Calculated statistics
7. **user_settings** - Preferences
8. **follows** - Social connections

---

## ✅ NEXT STEPS

1. **Review this design** - Your feedback
2. **Refine & prioritize** - What features first?
3. **Design UI components** - React components for each section
4. **Implement Database** - Supabase schema
5. **Build Profile Page** - Full implementation

---

**Ready for your review! What should we adjust or add?** 🎨
