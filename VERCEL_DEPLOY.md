# 🚀 DEPLOY TO VERCEL

## ⚡ NO GITHUB? NO PROBLEM - CLI DEPLOY (Easiest):

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
# Follow prompts to authenticate
```

### 3. Deploy (from project folder)
```bash
cd /Users/ryleighjade/makeup-mastery-ai
vercel
# Answer questions:
# - Set up "~/makeup-mastery-ai"? [Y/n] → Y
# - Which scope? [your-username] → Enter
# - Link to existing project? [y/N] → N
# - What's your project name? [makeup-mastery-ai] → Enter (or type new name)
```

### 4. Add Environment Variables
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter value: https://your-project.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter value: your-anon-key

# Add other env vars one by one...
```

### 5. Deploy to Production
```bash
vercel --prod
```

**✅ Live URL will be shown!**

---

## 🔄 UPDATE LATER:
```bash
cd /Users/ryleighjade/makeup-mastery-ai
vercel --prod
```

---

## 🌐 OR USE VERCEL DASHBOARD (No CLI):
1. Go to https://vercel.com/new
2. Select "Import Git Repository" → Cancel that
3. Look for "Upload Directory" or use CLI button
4. Drag & drop your project folder
5. Add env vars in dashboard
6. Deploy

---

## 🔗 GITHUB AUTO-DEPLOY (Recommended):

### Your Repo: https://github.com/DlogQueen/GLAMGUIDE.git

### 1. Connect Vercel to GitHub
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Authorize Vercel to access your GitHub
4. Select `DlogQueen/GLAMGUIDE`
5. Click "Import"

### 2. Configure Project
- Framework Preset: Next.js
- Root Directory: ./
- Build Command: next build
- Output Directory: .next

### 3. Add Environment Variables (BEFORE first deploy)
Click "Environment Variables" and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
NEXT_PUBLIC_DEEPAR_LICENSE_KEY=your_deepar_key
```

### 4. Deploy
Click "Deploy" - Vercel will:
- Build your app
- Deploy to `https://glamguide.vercel.app`
- Set up auto-deploy on every git push

### 5. Test Auto-Deploy
```bash
# Make any change
echo "test" >> README.md
git add .
git commit -m "test auto-deploy"
git push origin main

# Vercel will automatically rebuild and deploy!
```

### 6. Custom Domain (Optional)
In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add `glamguide.ai` (or your domain)
3. Follow DNS instructions

---

## 🔄 ENVIRONMENT VARIABLES IN VERCEL DASHBOARD:

Project Settings → Environment Variables:

```bash
# REQUIRED
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Features
NEXT_PUBLIC_ELEVENLABS_API_KEY=your-elevenlabs-key
GROQ_API_KEY=your-groq-key
OPENROUTER_API_KEY=your-openrouter-key

# AR
NEXT_PUBLIC_DEEPAR_LICENSE_KEY=your-deepar-key

# Optional
YOUTUBE_API_KEY=your-youtube-key
```

### 4. Redeploy
Vercel auto-redeploys when you add env vars.

---

## One-Click Deploy Button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/glam-mastery-ai)

---

## CLI Deploy:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set env vars
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Production deploy
vercel --prod
```

---

## Direct Links:
- **Vercel Dashboard**: https://vercel.com/dashboard
- **New Project**: https://vercel.com/new
- **Add Domain**: https://vercel.com/dashboard/domains

---

## After Deploy:
- **Custom Domain**: Settings → Domains → Add `glamguide.ai`
- **Analytics**: Vercel Analytics tab
- **Logs**: Real-time function logs

---

## Test URLs:
- Production: `https://your-app.vercel.app`
- Preview: `https://your-app-git-branch.vercel.app`

---

**Your app will be live in ~2 minutes!** 🎉
