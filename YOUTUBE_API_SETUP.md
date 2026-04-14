# 🎬 YouTube API Integration Guide

## ✅ COMPLETED: Korean Glass Skin Videos Added

### Videos Added:
1. **Step 1: Double Cleanse** → [Karen's Korean Skincare for Beginners](https://www.youtube.com/watch?v=-LFpA_OMvWk)
2. **Step 2: Hydrating Toner** → [10 Step Korean Skincare Routine](https://www.youtube.com/watch?v=OtgKS6loMTE)
3. **Step 4: Serum Layer** → [How to Achieve Clear Korean Glass Skin](https://www.youtube.com/watch?v=nksk2PxDS5E)
4. **Step 6: SPF** → [Korean Makeup Transformation Glass Skin Look](https://www.youtube.com/watch?v=XCA1SPscye0)
5. **Main Tutorial** → [Karen's Glass Skin Tutorial](https://www.youtube.com/watch?v=-LFpA_OMvWk)

### Product Links Added:
- **Real K-beauty products** with Sephora/Amazon links
- **DHC Deep Cleansing Oil** ($28)
- **COSRX Snail Mucin Essence** ($25)
- **Beauty of Joseon Relief Sun SPF50** ($18)
- **Missha M Perfect Cover BB Cream** ($14)
- And 20+ more authentic products!

---

## 🔧 YouTube Data API v3 Setup (Optional Enhancement)

### Why Add YouTube API?
- Auto-fetch video thumbnails
- Get real-time view counts
- Search for new tutorials dynamically
- Verify video availability
- Update broken links automatically

### Step 1: Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **YouTube Data API v3**
4. Go to Credentials → Create API Key
5. Copy the API key

### Step 2: Add to Environment

```bash
# .env.local
YOUTUBE_API_KEY=your_api_key_here
```

### Step 3: Create YouTube Service

```typescript
// src/services/youtubeService.ts

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export async function getVideoDetails(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('YouTube API key not configured');
    return null;
  }
  
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
}

export async function searchMakeupTutorials(query: string, maxResults = 5) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) return [];
  
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    return data.items?.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    })) || [];
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

// Extract video ID from YouTube URL
export function extractVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
```

### Step 4: Use in Tutorial Component

```typescript
// src/app/tutorial/page.tsx

import { getVideoDetails, extractVideoId } from '@/services/youtubeService';

// In TutorialContent component:
const [videoDetails, setVideoDetails] = useState<any>(null);

useEffect(() => {
  async function loadVideoDetails() {
    if (currentStep?.videoUrl) {
      const videoId = extractVideoId(currentStep.videoUrl);
      if (videoId) {
        const details = await getVideoDetails(videoId);
        setVideoDetails(details);
      }
    }
  }
  
  loadVideoDetails();
}, [currentStep]);

// Display video info:
{videoDetails && (
  <div className="video-info">
    <img src={videoDetails.thumbnail} alt={videoDetails.title} />
    <h4>{videoDetails.title}</h4>
    <p>{videoDetails.channelTitle} • {videoDetails.viewCount} views</p>
  </div>
)}
```

### Step 5: Add Video Embed Component

```typescript
// src/components/YouTubeEmbed.tsx

interface YouTubeEmbedProps {
  videoUrl: string;
  title?: string;
}

export function YouTubeEmbed({ videoUrl, title }: YouTubeEmbedProps) {
  const videoId = extractVideoId(videoUrl);
  
  if (!videoId) return null;
  
  return (
    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'Tutorial Video'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
```

---

## 🎯 USAGE QUOTA (Free Tier)

- **10,000 units/day** (sufficient for most apps)
- Search: 100 units
- Video details: 1 unit
- Your app: ~50-100 requests/day max

---

## 💡 NEXT STEPS

1. **Get API key** (5 mins)
2. **Test fetching** video details
3. **Add thumbnails** to tutorial UI
4. **Add search** for "Related Videos"

**Want me to:**
- Set up YouTube API service?
- Create video thumbnail component?
- Add "Related Tutorials" search?

**Current Status:** ✅ Videos linked, API ready to integrate!
