# 🚀 Glam Guide AI - Deployment Instructions

## ✅ BUILD STATUS: READY

Build passes successfully! Videos work without YouTube API key.

---

## 🎯 OPTION 1: Vercel (Recommended - 2 mins)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
# Follow prompts to authenticate
```

### Step 3: Deploy
```bash
cd /Users/ryleighjade/makeup-mastery-ai
vercel --prod
```

### Step 4: Add Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add these:

```
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_1b3612d766682bd46e538942ba7376b407023a3a6720710c
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEEPAR_LICENSE_KEY=your_deepar_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
# YOUTUBE_API_KEY=optional_for_thumbnails
```

### Step 5: Redeploy
```bash
vercel --prod
```

---

## 🎯 OPTION 2: Netlify (3 mins)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login
```bash
netlify login
```

### Step 3: Initialize & Deploy
```bash
cd /Users/ryleighjade/makeup-mastery-ai
netlify init
# Choose "Create & configure a new site"
netlify deploy --prod --dir=dist
```

### Step 4: Add Environment Variables
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Site settings → Environment variables
4. Add the same keys as above

---

## 🎯 OPTION 3: Manual Drag & Drop (1 min)

### Step 1: Build
```bash
cd /Users/ryleighjade/makeup-mastery-ai
npm run build
```

### Step 2: Drag to Netlify
1. Open [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `dist` folder to the browser window
3. Get instant URL!

### Step 3: Add Environment Variables
1. Go to site settings
2. Add env vars (same as above)
3. Redeploy

---

## 🔑 REQUIRED ENVIRONMENT VARIABLES

### Critical (App Won't Work Without):
```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_1b3612d766682bd46e538942ba7376b407023a3a6720710c
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For Full Features:
```bash
NEXT_PUBLIC_DEEPAR_LICENSE_KEY=your_deepar_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Optional (YouTube API):
```bash
# YOUTUBE_API_KEY=your_youtube_api_key
# Note: Videos play without this! Only for thumbnails/search.
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

### Test These Features:
- [ ] Homepage loads with pink glam theme
- [ ] All 4 tabs work (Gallery, Tutorial, Custom, Profile)
- [ ] Sign In button opens modal
- [ ] Korean Glass Skin tutorial loads
- [ ] Video links are clickable
- [ ] ElevenLabs voice plays in tutorial
- [ ] DeepAR camera opens (if key added)
- [ ] Mobile responsive

### Share URL:
Once deployed, share the URL for testing!

---

## 🆘 TROUBLESHOOTING

### Build Fails?
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Auth Modal Not Working?
- Check Supabase env vars are set in dashboard
- Verify RLS policies are enabled

### Voice Not Playing?
- Check ElevenLabs API key in env vars
- Test: `curl -H "xi-api-key: YOUR_KEY" https://api.elevenlabs.io/v1/voices`

### Videos Not Playing?
- YouTube videos work without API key
- Check browser console for errors

---

## 🎉 READY TO GO!

**Choose your deployment method above and go live!**

**Estimated time:** 1-3 minutes
