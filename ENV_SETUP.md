# 🔑 ENVIRONMENT VARIABLES SETUP - Glam Guide AI

## ✅ COMPLETE CHECKLIST OF ALL ENV VARS

**Copy this file to `.env.local` and fill in your values**

---

## 🚨 CRITICAL - App Won't Work Without These

### 1. Supabase (Database & Auth)
```bash
# Get from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```
**Where to find:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key

**Status:** ❌ REQUIRED - Auth won't work without this

---

### 2. ElevenLabs (AI Voice Coaching)
```bash
# Get from: https://elevenlabs.io/app/settings/api-keys
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx
```
**Where to find:**
1. Go to [ElevenLabs](https://elevenlabs.io)
2. Sign up/login
3. Profile → API Keys
4. Create new key

**Status:** ❌ REQUIRED - Voice coaching won't work
**Cost:** Free tier = 10k characters/month

---

## ⚠️ IMPORTANT - Features Won't Work Without These

### 3. DeepAR (AR Try-On Camera)
```bash
# Get from: https://developers.deepar.ai/
NEXT_PUBLIC_DEEPAR_LICENSE_KEY=your_license_key_here
```
**Where to find:**
1. Go to [DeepAR](https://developers.deepar.ai)
2. Create account
3. Create new project
4. Copy license key

**Status:** ⚠️ IMPORTANT - AR camera won't work
**Cost:** Free tier available

---

### 4. Groq (Fast AI Responses)
```bash
# Get from: https://console.groq.com/keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```
**Where to find:**
1. Go to [Groq Console](https://console.groq.com)
2. Sign up
3. API Keys → Create Key

**Status:** ⚠️ IMPORTANT - AI style generation won't work
**Cost:** Free tier = generous limits

---

### 5. OpenRouter (Backup AI)
```bash
# Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
```
**Where to find:**
1. Go to [OpenRouter](https://openrouter.ai)
2. Sign up
3. Settings → API Keys

**Status:** ⚠️ BACKUP - Used if Groq fails
**Cost:** Pay per use, cheap

---

## 🎨 OPTIONAL - Enhanced Features

### 6. YouTube API (Video Thumbnails)
```bash
# Get from: https://console.cloud.google.com/apis/library/youtube.googleapis.com
YOUTUBE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx
```
**Where to find:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project
3. Enable "YouTube Data API v3"
4. Create API key

**Status:** ✅ OPTIONAL - Videos play without this
**Purpose:** Thumbnails, view counts, search
**Cost:** Free = 10k quota units/day

---

### 7. Google Analytics (Tracking)
```bash
# Get from: https://analytics.google.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
**Where to find:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create property
3. Data Streams → Web
4. Copy Measurement ID

**Status:** ✅ OPTIONAL - Analytics only

---

### 8. Sentry (Error Tracking)
```bash
# Get from: https://sentry.io/settings/projects/
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```
**Where to find:**
1. Go to [Sentry](https://sentry.io)
2. Create project
3. Settings → Client Keys (DSN)

**Status:** ✅ OPTIONAL - Error tracking only

---

## 📱 MOBILE BUILD (Capacitor/Cordova)

### Android Build
```bash
# Android SDK Path (MacPorts example)
ANDROID_SDK_ROOT=/opt/local/share/android-sdk
ANDROID_HOME=/opt/local/share/android-sdk

# Keystore for app signing (create your own)
ANDROID_KEYSTORE_PATH=/path/to/your.keystore
ANDROID_KEYSTORE_PASSWORD=your_keystore_password
ANDROID_KEY_ALIAS=your_key_alias
ANDROID_KEY_PASSWORD=your_key_password
```

**Status:** ⚠️ REQUIRED only for Android builds

---

## 🔐 COMPLETE .ENV.LOCAL TEMPLATE

Copy this entire block to `.env.local`:

```bash
# ============================================
# CRITICAL - App Won't Work Without These
# ============================================

# Supabase (Auth + Database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# ElevenLabs (AI Voice)
NEXT_PUBLIC_ELEVENLABS_API_KEY=

# ============================================
# IMPORTANT - Features Won't Work
# ============================================

# DeepAR (AR Camera)
NEXT_PUBLIC_DEEPAR_LICENSE_KEY=

# Groq (AI Generation)
GROQ_API_KEY=

# OpenRouter (Backup AI)
OPENROUTER_API_KEY=

# ============================================
# OPTIONAL - Enhanced Features
# ============================================

# YouTube API (Thumbnails)
YOUTUBE_API_KEY=

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=

# ============================================
# MOBILE BUILD (Android)
# ============================================

ANDROID_SDK_ROOT=
ANDROID_HOME=
ANDROID_KEYSTORE_PATH=
ANDROID_KEYSTORE_PASSWORD=
ANDROID_KEY_ALIAS=
ANDROID_KEY_PASSWORD=
```

---

## ✅ SETUP PRIORITY ORDER

### Phase 1: Critical (Do First!)
1. ☐ Supabase URL
2. ☐ Supabase Anon Key
3. ☐ ElevenLabs API Key

**Test:** Sign in should work after these

### Phase 2: Important (Do Next!)
4. ☐ DeepAR License Key
5. ☐ Groq API Key
6. ☐ OpenRouter API Key

**Test:** AR camera + AI generation should work

### Phase 3: Optional (Do Later!)
7. ☐ YouTube API Key
8. ☐ Google Analytics
9. ☐ Sentry DSN

**Test:** Enhanced features active

### Phase 4: Mobile (For App Store)
10. ☐ Android SDK setup
11. ☐ Keystore created
12. ☐ Build successful

---

## 🧪 TESTING CHECKLIST

After adding env vars, test each feature:

- [ ] **Sign In** - Supabase working
- [ ] **Voice Coaching** - ElevenLabs plays
- [ ] **AR Camera** - DeepAR opens
- [ ] **AI Generation** - Groq responds
- [ ] **YouTube Thumbs** - (if API key added)

---

## 💰 COST SUMMARY

| Service | Free Tier | Paid Cost |
|---------|-----------|-----------|
| Supabase | 500MB, 2M requests | $25/month |
| ElevenLabs | 10k chars/month | $5/month |
| DeepAR | 1k sessions | $0.05/session |
| Groq | Generous limits | Cheap |
| OpenRouter | Varies | Per use |
| YouTube API | 10k units/day | Free |
| GA | 10M events | Free |
| Sentry | 5k errors | $26/month |

**Total Free Tier:** ✅ All core features work free!

---

## 🚀 QUICK START

1. **Copy template above** → `.env.local`
2. **Fill in Supabase + ElevenLabs** (critical)
3. **Restart dev server** `npm run dev`
4. **Test sign in** - Should work now!
5. **Add others gradually**

---

## 🆘 TROUBLESHOOTING

### Sign In Not Working?
- ☐ Check Supabase URL has `https://`
- ☐ Check Supabase key is "anon public" not service_role
- ☐ Restart Next.js after adding env vars

### Voice Not Playing?
- ☐ Check ElevenLabs key starts with `sk_`
- ☐ Test key: `curl -H "xi-api-key: YOUR_KEY" https://api.elevenlabs.io/v1/voices`

### AR Camera Blank?
- ☐ Check DeepAR license is valid
- ☐ Check camera permissions in browser
- ☐ Try HTTPS (not HTTP)

---

## 📁 FILES THAT USE THESE VARS

- `src/lib/supabase.ts` - Supabase vars
- `src/services/voiceService.ts` - ElevenLabs
- `src/services/deepArService.ts` - DeepAR
- `src/services/aiService.ts` - Groq, OpenRouter
- `src/services/youtubeService.ts` - YouTube API

---

**Save this file and check off each env var as you add it!** ✅
