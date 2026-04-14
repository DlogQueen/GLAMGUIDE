# 🌟 Glam Guide AI - Advanced Profile & Features Plan

## Current State → Target Vision

### 1. ENHANCED USER PROFILE SCHEMA

```typescript
// Extended Profile with AI Analysis
interface EnhancedProfile {
  // Current fields
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  
  // NEW: AI Skin Analysis
  skin_analysis: {
    tone: 'fair' | 'light' | 'medium' | 'tan' | 'deep' | 'dark';
    undertone: 'cool' | 'warm' | 'neutral' | 'olive';
    type: 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';
    concerns: string[]; // acne, wrinkles, dark spots, redness, etc.
    texture_score: number; // 1-10
    hydration_level: number; // 1-10
    analyzed_at: string;
  };
  
  // NEW: 3D Facial Mapping (400+ landmarks)
  facial_geometry: {
    face_shape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong';
    eye_shape: 'almond' | 'round' | 'hooded' | 'monolid' | 'upturned' | 'downturned';
    eye_distance: 'close' | 'average' | 'wide';
    lip_shape: 'full' | 'thin' | 'heart' | 'round' | 'wide';
    nose_shape: string;
    cheekbone_height: 'high' | 'medium' | 'low';
    jawline_type: 'strong' | 'soft' | 'narrow' | 'wide';
    landmarks_3d: number[][]; // 468 MediaPipe landmarks
    face_measurements: {
      face_width: number;
      face_length: number;
      eye_distance: number;
      lip_width: number;
    };
  };
  
  // NEW: Beauty Preferences
  preferences: {
    preferred_styles: string[];
    preferred_brands: string[];
    budget_range: 'budget' | 'mid' | 'luxury' | 'mix';
    makeup_skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
    time_available: number; // minutes for daily routine
    preferred_finish: 'matte' | 'dewy' | 'natural' | 'glowy';
    color_comfort_zone: string[]; // preferred color families
  };
  
  // NEW: Portfolio/Lookbook
  portfolio: {
    saved_looks: SavedLook[];
    created_looks: CustomLook[];
    face_charts: FaceChart[];
    before_afters: BeforeAfter[];
  };
  
  // NEW: Product Arsenal
  product_collection: {
    owned_products: UserProduct[];
    wishlist: ProductWishlistItem[];
    shade_matches: ShadeMatch[];
  };
  
  // Stats (existing)
  total_looks_created: number;
  total_tutorials_completed: number;
  total_time_spent: number;
  streak_days: number;
  last_active_date: string;
  
  // NEW: Social
  followers_count: number;
  following_count: number;
  is_public: boolean;
  share_profile: boolean;
}

// Digital Face Chart (Procreate-style)
interface FaceChart {
  id: string;
  name: string;
  thumbnail_url: string;
  layers: FaceChartLayer[];
  created_at: string;
  is_template: boolean;
}

interface FaceChartLayer {
  id: string;
  name: 'base' | 'eyes' | 'lashes' | 'brows' | 'lips' | 'contour' | 'blush' | 'highlight' | 'accessories';
  opacity: number; // 0-1
  blend_mode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
  products: FaceChartProduct[];
  notes: string;
}

interface FaceChartProduct {
  name: string;
  brand: string;
  shade: string;
  texture: 'matte' | 'gloss' | 'glitter' | 'metallic' | 'satin' | 'cream';
  application_notes: string;
}

// User's Saved/Custom Looks
interface SavedLook {
  id: string;
  name: string;
  style_id: string;
  thumbnail_url: string;
  products_used: ProductUsage[];
  tutorial_completed: boolean;
  rating: number; // 1-5
  notes: string;
  tags: string[];
  occasion: string;
  saved_at: string;
}

interface CustomLook {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  face_chart_id: string;
  inspiration_photo_url?: string;
  ai_generated: boolean;
  products: ProductUsage[];
  steps: CustomStep[];
  is_public: boolean;
  likes_count: number;
  created_at: string;
}

interface ProductUsage {
  product_id: string;
  product_name: string;
  brand: string;
  shade: string;
  step: string;
  amount: string;
}

// Before & After Comparison
interface BeforeAfter {
  id: string;
  title: string;
  before_photo_url: string;
  after_photo_url: string;
  look_id: string;
  products_used: string[];
  notes: string;
  created_at: string;
}

// User's Product Collection
interface UserProduct {
  id: string;
  product_id: string;
  name: string;
  brand: string;
  category: string;
  shade: string;
  shade_match_score: number; // AI match %
  purchase_date?: string;
  expiry_date?: string;
  rating: number;
  repurchase: boolean;
  notes: string;
  photos: string[];
}

// Shade Matching
interface ShadeMatch {
  category: 'foundation' | 'concealer' | 'powder' | 'blush' | 'lipstick' | 'eyeshadow';
  brand: string;
  product_line: string;
  shade_name: string;
  shade_code: string;
  match_confidence: number;
  skin_tone_match: string;
  undertone_match: string;
  swatch_url?: string;
  buy_link: string;
  price: string;
}

// Wishlist with Price Tracking
interface ProductWishlistItem {
  product_id: string;
  name: string;
  brand: string;
  current_price: string;
  original_price?: string;
  priority: 'high' | 'medium' | 'low';
  notified_at_price?: string;
  added_at: string;
}
```

---

## 2. ADVANCED FEATURES IMPLEMENTATION

### A. AI Skin Analysis Engine
```typescript
// Services/skinAnalysisAdvanced.ts

interface SkinAnalysisResult {
  tone: SkinTone;
  undertone: Undertone;
  type: SkinType;
  concerns: SkinConcern[];
  texture: TextureAnalysis;
  recommendations: ProductRecommendation[];
}

interface TextureAnalysis {
  smoothness: number;
  pore_visibility: number;
  fine_lines: number;
  unevenness: number;
  acne_score: number;
}

// Implementation steps:
// 1. Use MediaPipe Face Mesh (468 landmarks)
// 2. Extract skin regions from face mesh
// 3. Analyze color histograms for tone/undertone
// 4. Detect texture patterns (pores, lines, acne)
// 5. ML model for concern classification
```

### B. 3D Face Mesh & AR Try-On
```typescript
// hooks/useAdvancedFaceMesh.ts

interface FaceMeshData {
  landmarks: NormalizedLandmark[]; // 468 points
  face_geometry: FaceGeometry;
  transformation_matrix: Matrix4;
  lighting_estimate: LightingData;
}

// Features:
// - Real-time 3D tracking
// - Occlusion handling (hand over face)
// - Lighting adaptation
// - Multiple face support
// - Expression tracking (smile, blink, etc.)
```

### C. Digital Face Chart Creator
```typescript
// components/makeup/FaceChartCreator.tsx

// Features:
// - Layer-based editing (like Procreate)
// - Texture libraries (matte, gloss, glitter, metallic)
// - Brush tools with pressure sensitivity
// - Color picker with skin tone adaptation
// - Template system (blank, with guidelines, celebrity refs)
// - Export to PNG/Share to social
```

### D. "Show Your Own" Feature
```typescript
// services/inspirationAnalyzer.ts

// User uploads makeup photo → AI analyzes
interface InspirationAnalysis {
  detected_products: string[];
  color_palette: string[];
  style_category: string;
  difficulty_level: string;
  estimated_time: number;
  adapted_tutorial: TutorialStep[];
  product_matches: ProductRecommendation[];
}

// Steps:
// 1. User uploads inspiration photo
// 2. AI detects makeup elements (colors, placement, style)
// 3. Analyze user's face for adaptation
// 4. Generate personalized tutorial
// 5. Find matching products
```

### E. Before/After Comparison Tool
```typescript
// components/makeup/BeforeAfterSlider.tsx

// Features:
// - Side-by-side or slider comparison
// - Automatic alignment using face landmarks
// - Lighting normalization
// - Shareable comparison cards
// - Progress tracking over time
```

### F. E-commerce Integration
```typescript
// services/productRecommendations.ts

// Affiliate partnerships:
// - Sephora
// - Ulta
// - Amazon Beauty
// - MAC Cosmetics
// - Fenty Beauty

// Features:
// - "Buy Now" buttons on every product
// - Shade matching with in-stock availability
// - Price comparison across retailers
// - Wishlist with price drop alerts
// - Virtual try-on before purchase
```

---

## 3. DATABASE MIGRATIONS

### Supabase Schema Updates

```sql
-- Add skin analysis table
CREATE TABLE skin_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tone VARCHAR(20),
  undertone VARCHAR(20),
  type VARCHAR(20),
  concerns TEXT[],
  texture_score INT,
  hydration_level INT,
  landmarks_3d JSONB,
  analyzed_at TIMESTAMP DEFAULT NOW(),
  photo_url TEXT
);

-- Add face charts table
CREATE TABLE face_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  thumbnail_url TEXT,
  layers JSONB,
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add portfolio looks table
CREATE TABLE portfolio_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  description TEXT,
  face_chart_id UUID REFERENCES face_charts(id),
  inspiration_photo_url TEXT,
  ai_generated BOOLEAN DEFAULT false,
  products JSONB,
  steps JSONB,
  is_public BOOLEAN DEFAULT false,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add before/after table
CREATE TABLE before_afters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  before_photo_url TEXT,
  after_photo_url TEXT,
  look_id UUID REFERENCES portfolio_looks(id),
  products_used TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add user products table
CREATE TABLE user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  product_id TEXT,
  name TEXT,
  brand TEXT,
  category TEXT,
  shade TEXT,
  shade_match_score INT,
  purchase_date DATE,
  expiry_date DATE,
  rating INT,
  repurchase BOOLEAN,
  notes TEXT,
  photos TEXT[]
);

-- Add wishlist table
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  product_id TEXT,
  name TEXT,
  brand TEXT,
  current_price TEXT,
  original_price TEXT,
  priority VARCHAR(10),
  notified_at_price TEXT,
  added_at TIMESTAMP DEFAULT NOW()
);

-- Add shade matches table
CREATE TABLE shade_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category VARCHAR(30),
  brand TEXT,
  product_line TEXT,
  shade_name TEXT,
  shade_code TEXT,
  match_confidence INT,
  skin_tone_match TEXT,
  undertone_match TEXT,
  swatch_url TEXT,
  buy_link TEXT,
  price TEXT
);

-- Enable RLS
ALTER TABLE skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE before_afters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shade_matches ENABLE ROW LEVEL SECURITY;

-- RLS policies (user can only see their own data)
CREATE POLICY "Users can CRUD own skin analyses" ON skin_analyses FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can CRUD own face charts" ON face_charts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can CRUD own portfolio looks" ON portfolio_looks FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can CRUD own before afters" ON before_afters FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can CRUD own products" ON user_products FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can CRUD own wishlists" ON wishlists FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can CRUD own shade matches" ON shade_matches FOR ALL USING (user_id = auth.uid());
```

---

## 4. UI/UX COMPONENTS NEEDED

### New Profile Sections:

1. **Beauty DNA Card**
   - Skin analysis results
   - Facial geometry visualization
   - Undertone badge
   - Skin type indicator

2. **Digital Face Chart Studio**
   - Canvas with face outline
   - Layer panel (like Photoshop)
   - Brush/texture tools
   - Product palette

3. **Portfolio Gallery**
   - Grid of saved looks
   - Before/after comparisons
   - Public/private toggle
   - Share buttons

4. **Product Arsenal**
   - Virtual makeup bag
   - Expiry date tracking
   - Shade match visualizer
   - "Shop My Stash" feature

5. **Wishlist & Shopping**
   - Price tracking
   - In-stock alerts
   - Sale notifications
   - One-click purchase

6. **Social Profile**
   - Follower/following counts
   - Public looks gallery
   - Collaboration features
   - "Get This Look" button

---

## 5. API INTEGRATIONS NEEDED

### Retailer APIs:
- Sephora API (product catalog, availability)
- Ulta API (pricing, promotions)
- Amazon Product API (affiliate links)
- Google Shopping API (price comparison)

### AI/ML Services:
- Enhanced MediaPipe (468 landmarks)
- Skin analysis ML model (train custom or use pre-built)
- Color matching algorithm
- Style transfer for "Show Your Own"

### Storage:
- Supabase Storage (photos, face charts)
- CDN for fast image delivery

---

## 6. DEVELOPMENT PRIORITY

### Phase 1: Core Profile Enhancement (Week 1)
1. Database migrations
2. Enhanced profile types
3. Skin analysis mock service
4. Update profile UI

### Phase 2: Face Charts (Week 2)
1. Canvas-based face chart editor
2. Layer system
3. Texture brushes
4. Save/export functionality

### Phase 3: Portfolio & Before/After (Week 3)
1. Look gallery
2. Photo upload
3. Before/after comparison
4. Social sharing

### Phase 4: E-commerce (Week 4)
1. Product database
2. Affiliate links
3. Wishlist functionality
4. Price tracking

### Phase 5: Advanced AR (Week 5-6)
1. 468-landmark face mesh
2. Improved AR rendering
3. Lighting adaptation
4. Occlusion handling

### Phase 6: "Show Your Own" (Week 7)
1. Photo upload
2. AI analysis
3. Tutorial generation
4. Product matching

---

## 7. MONETIZATION OPPORTUNITIES

### Premium Subscription Tiers:

**Glam Guide Pro ($9.99/month)**
- Unlimited face charts
- Advanced skin analysis
- Unlimited portfolio looks
- Before/after comparisons
- Priority support

**Glam Guide Creator ($19.99/month)**
- Everything in Pro
- Public profile & followers
- Monetize looks (tips/donations)
- Brand collaboration tools
- Analytics dashboard

**Affiliate Revenue:**
- 5-15% commission on product sales
- Featured product placements
- Sponsored tutorials

---

**Ready to start? Which phase first?**
1. **Database setup** (1 hour)
2. **Enhanced profile UI** (2 hours)
3. **Skin analysis mock** (30 mins)
4. **Face chart starter** (4 hours)
