import { MakeupStep, MakeupStyle, FacialFeatures } from "@/types";

// YouTube tutorial database - curated professional tutorials
export interface YouTubeTutorial {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  views: string;
  technique: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url: string;
  relevantFor: string[];
}

const YOUTUBE_DATABASE: YouTubeTutorial[] = [
  {
    id: "yt-1",
    title: "How to Apply Eyeshadow for Beginners - Step by Step",
    channel: "Robert Welsh",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE1/maxresdefault.jpg",
    duration: "15:30",
    views: "2.5M",
    technique: "eyeshadow blending",
    difficulty: "beginner",
    url: "https://youtube.com/watch?v=EXAMPLE1",
    relevantFor: ["eyeshadow", "blending", "beginner", "neutral"]
  },
  {
    id: "yt-2",
    title: "Perfect Winged Eyeliner for Hooded Eyes",
    channel: "NikkiTutorials",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE2/maxresdefault.jpg",
    duration: "8:45",
    views: "1.8M",
    technique: "winged liner",
    difficulty: "intermediate",
    url: "https://youtube.com/watch?v=EXAMPLE2",
    relevantFor: ["eyeliner", "winged liner", "hooded eyes"]
  },
  {
    id: "yt-3",
    title: "Korean Glass Skin Tutorial - Dewy Foundation Routine",
    channel: "Sydney Morgan",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE3/maxresdefault.jpg",
    duration: "12:15",
    views: "890K",
    technique: "dewy skin",
    difficulty: "beginner",
    url: "https://youtube.com/watch?v=EXAMPLE3",
    relevantFor: ["glass skin", "k-beauty", "dewy", "foundation"]
  },
  {
    id: "yt-4",
    title: "Smokey Eye for Beginners - Easy 3-Step Method",
    channel: "Lisa Eldridge",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE4/maxresdefault.jpg",
    duration: "10:20",
    views: "3.2M",
    technique: "smokey eye",
    difficulty: "beginner",
    url: "https://youtube.com/watch?v=EXAMPLE4",
    relevantFor: ["smokey eye", "evening", "dark eyeshadow"]
  },
  {
    id: "yt-5",
    title: "Contour & Highlight for Your Face Shape",
    channel: "Wayne Goss",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE5/maxresdefault.jpg",
    duration: "14:00",
    views: "4.1M",
    technique: "contouring",
    difficulty: "intermediate",
    url: "https://youtube.com/watch?v=EXAMPLE5",
    relevantFor: ["contour", "highlight", "face shape", "sculpting"]
  },
  {
    id: "yt-6",
    title: "Perfect Lip Liner Application - Overlining Technique",
    channel: "Jamie Genevieve",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE6/maxresdefault.jpg",
    duration: "6:30",
    views: "750K",
    technique: "lip liner",
    difficulty: "beginner",
    url: "https://youtube.com/watch?v=EXAMPLE6",
    relevantFor: ["lips", "lip liner", "overlining", "full lips"]
  },
  {
    id: "yt-7",
    title: "Arabic Makeup Tutorial - Dramatic Cut Crease",
    channel: "Huda Beauty",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE7/maxresdefault.jpg",
    duration: "18:45",
    views: "5.5M",
    technique: "cut crease",
    difficulty: "advanced",
    url: "https://youtube.com/watch?v=EXAMPLE7",
    relevantFor: ["cut crease", "arabic", "dramatic", "glam"]
  },
  {
    id: "yt-8",
    title: "Natural Brow Tutorial - Fluffy Feathered Brows",
    channel: "Anastasia Beverly Hills",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE8/maxresdefault.jpg",
    duration: "9:15",
    views: "1.2M",
    technique: "brows",
    difficulty: "beginner",
    url: "https://youtube.com/watch?v=EXAMPLE8",
    relevantFor: ["brows", "feathered", "natural", "soap brows"]
  },
  {
    id: "yt-9",
    title: "Bridal Makeup Tutorial - Soft & Elegant",
    channel: "Charlotte Tilbury",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE9/maxresdefault.jpg",
    duration: "20:00",
    views: "2.8M",
    technique: "bridal",
    difficulty: "intermediate",
    url: "https://youtube.com/watch?v=EXAMPLE9",
    relevantFor: ["bridal", "wedding", "elegant", "soft glam"]
  },
  {
    id: "yt-10",
    title: "Blush Placement for Your Face Shape",
    channel: "AlexandrasGirlyTalk",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE10/maxresdefault.jpg",
    duration: "7:30",
    views: "920K",
    technique: "blush placement",
    difficulty: "beginner",
    url: "https://youtube.com/watch?v=EXAMPLE10",
    relevantFor: ["blush", "cheeks", "face shape", "placement"]
  },
  {
    id: "yt-11",
    title: "Color Correcting 101 - Hide Dark Circles & Redness",
    channel: "Katie Jane Hughes",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE11/maxresdefault.jpg",
    duration: "11:20",
    views: "1.5M",
    technique: "color correction",
    difficulty: "intermediate",
    url: "https://youtube.com/watch?v=EXAMPLE11",
    relevantFor: ["color correct", "dark circles", "redness", "concealer"]
  },
  {
    id: "yt-12",
    title: "False Lash Application - Strip & Individual Lashes",
    channel: "Pony Syndrome",
    thumbnail: "https://i.ytimg.com/vi/EXAMPLE12/maxresdefault.jpg",
    duration: "13:00",
    views: "2.1M",
    technique: "false lashes",
    difficulty: "intermediate",
    url: "https://youtube.com/watch?v=EXAMPLE12",
    relevantFor: ["lashes", "false lashes", "strip lashes", "individual"]
  }
];

// Search tutorials based on step or technique
export function searchTutorials(
  query: string,
  faceFeatures?: FacialFeatures,
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
): YouTubeTutorial[] {
  const searchTerms = query.toLowerCase().split(' ');
  
  let results = YOUTUBE_DATABASE.filter(tutorial => {
    // Match by title or technique
    const titleMatch = searchTerms.some(term => 
      tutorial.title.toLowerCase().includes(term) ||
      tutorial.technique.toLowerCase().includes(term)
    );
    
    // Match by relevant tags
    const tagMatch = searchTerms.some(term =>
      tutorial.relevantFor.some((tag: string) => tag.toLowerCase().includes(term))
    );
    
    return titleMatch || tagMatch;
  });
  
  // Filter by difficulty if specified
  if (difficulty) {
    results = results.filter(t => t.difficulty === difficulty);
  }
  
  // Sort by relevance and views
  results.sort((a, b) => {
    const aRelevance = searchTerms.filter(term => 
      a.title.toLowerCase().includes(term)
    ).length;
    const bRelevance = searchTerms.filter(term => 
      b.title.toLowerCase().includes(term)
    ).length;
    
    if (bRelevance !== aRelevance) return bRelevance - aRelevance;
    
    // Parse views for secondary sort
    const aViews = parseFloat(a.views) * (a.views.includes('M') ? 1000000 : 1000);
    const bViews = parseFloat(b.views) * (b.views.includes('M') ? 1000000 : 1000);
    return bViews - aViews;
  });
  
  return results.slice(0, 5);
}

// Get tutorials for specific makeup step
export function getTutorialsForStep(
  step: MakeupStep,
  faceFeatures?: FacialFeatures
): YouTubeTutorial[] {
  const searchQuery = `${step.title} ${step.description}`;
  return searchTutorials(searchQuery, faceFeatures, undefined);
}

// Get tutorials for specific face shape concerns
export function getTutorialsForFaceShape(
  faceShape: string,
  concerns?: string[]
): YouTubeTutorial[] {
  const tutorials: YouTubeTutorial[] = [];
  
  switch (faceShape) {
    case 'round':
      tutorials.push(...searchTutorials('contouring slim face definition'));
      break;
    case 'square':
      tutorials.push(...searchTutorials('soften jawline contour round'));
      break;
    case 'heart':
      tutorials.push(...searchTutorials('balance forehead chin makeup'));
      break;
    case 'long':
    case 'oblong':
      tutorials.push(...searchTutorials('horizontal blush shorten face'));
      break;
    default:
      tutorials.push(...searchTutorials('flattering makeup techniques'));
  }
  
  if (concerns) {
    concerns.forEach(concern => {
      tutorials.push(...searchTutorials(concern));
    });
  }
  
  // Remove duplicates
  return tutorials.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 6);
}

// Get professional tips from web search simulation
export interface ProTip {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
}

export function getProTips(technique: string): ProTip[] {
  const tips: Record<string, ProTip[]> = {
    "eyeshadow": [
      {
        id: "tip-1",
        title: "The Windshield Wiper Motion",
        content: "When blending eyeshadow in the crease, use a small windshield wiper motion rather than circular motions. This follows your natural eye shape and creates a more seamless blend.",
        source: "Charlotte Tilbury Pro Tips",
        category: "blending"
      },
      {
        id: "tip-2",
        title: "Primer is Non-Negotiable",
        content: "Always apply eyeshadow primer - it prevents creasing, makes colors more vibrant, and helps your look last all day. Even concealer works in a pinch!",
        source: "Lisa Eldridge",
        category: "prep"
      },
      {
        id: "tip-3",
        title: "Tap, Don't Sweep",
        content: "When applying shimmer or glitter shadows, pat the product on with your finger or a flat brush. Sweeping motions create fallout and less intensity.",
        source: "Wayne Goss",
        category: "application"
      }
    ],
    "eyeliner": [
      {
        id: "tip-4",
        title: "The Tape Method",
        content: "Place a small piece of tape at the outer corner of your eye, angling toward your brow tail. Use it as a guide for perfect winged liner every time.",
        source: "Robert Welsh",
        category: "technique"
      },
      {
        id: "tip-5",
        title: "Tightlining Secret",
        content: "For fuller-looking lashes without obvious liner, tightline your upper waterline. This fills gaps between lashes and makes them look denser.",
        source: "Huda Kattan",
        category: "definition"
      }
    ],
    "foundation": [
      {
        id: "tip-6",
        title: "Less is More",
        content: "Apply foundation only where you need it - usually center of face, around nose, and chin. Blend outward for a natural, skin-like finish.",
        source: "Bobbi Brown",
        category: "application"
      },
      {
        id: "tip-7",
        title: "The Damp Sponge Method",
        content: "Always use a damp beauty sponge for foundation. It sheers out the product for a second-skin finish and prevents cakey buildup.",
        source: "Nikkia Joy",
        category: "tools"
      }
    ],
    "contour": [
      {
        id: "tip-8",
        title: "The 3-Shape Method",
        content: "Think of contour in a '3' shape: from temple, curve under cheekbone, then curve along jawline. This creates natural-looking shadows.",
        source: "Scott Barnes",
        category: "technique"
      }
    ],
    "blush": [
      {
        id: "tip-9",
        title: "Smile and Dot",
        content: "Smile to find the apples of your cheeks, apply blush there, then blend upward toward the temple. This creates a natural, lifted look.",
        source: "Gucci Westman",
        category: "placement"
      }
    ],
    "lips": [
      {
        id: "tip-10",
        title: "The Lip Flip",
        content: "Overline just the center of your bottom lip and Cupid's bow for a fuller pout that still looks natural. Avoid overlining the corners.",
        source: "Pat McGrath",
        category: "technique"
      }
    ]
  };
  
  // Find matching tips
  const normalizedTechnique = technique.toLowerCase();
  for (const [key, tipList] of Object.entries(tips)) {
    if (normalizedTechnique.includes(key)) {
      return tipList;
    }
  }
  
  // Return general tips if no specific match
  return tips["eyeshadow"].slice(0, 2);
}

// Format duration from seconds to readable
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
