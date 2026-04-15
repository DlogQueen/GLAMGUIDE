'use client';

// Tessi Search Service - Web search for real-time info
// Uses multiple free search APIs as fallbacks

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export class TessiSearch {
  // Free search using DuckDuckGo Lite (no API key needed)
  static async search(query: string): Promise<SearchResult[]> {
    try {
      // Use a CORS proxy or direct search
      const searchQuery = encodeURIComponent(query + ' makeup beauty tutorial');
      
      // For now, return structured mock that looks like search
      // In production, you'd use SerpAPI (100 free/month) or similar
      return this.getMockSearchResults(query);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Get quick facts about makeup topics
  static async getMakeupFact(topic: string): Promise<string | null> {
    const facts: Record<string, string> = {
      'foundation': 'Foundation should match your neck, not your face. Test in natural light.',
      'concealer': 'Apply concealer in a triangle shape under eyes for brightening.',
      'eyeshadow': 'Use lighter shades on inner corner, darker on outer V for dimension.',
      'eyeliner': 'Tightlining (lining waterline) makes lashes look thicker instantly.',
      'mascara': 'Wiggle wand at base, then sweep up for volume and length.',
      'contour': 'Contouring creates shadows; highlight brings forward. Blend, blend, blend!',
      'blush': 'Smile and apply to apples, blend back toward temple.',
      'lipstick': 'Use lip liner first to prevent feathering and extend wear.',
      'primer': 'Primer creates a smooth canvas and helps makeup last longer.',
      'setting spray': 'Mist in X and T pattern for even coverage.',
      'beauty blender': 'Use damp, not wet, for seamless foundation application.',
      'brush cleaning': 'Clean brushes weekly with gentle soap to prevent breakouts.',
      'spf': 'SPF 30 daily, even under makeup. Reapply with setting spray with SPF.',
      'skincare': 'Skincare is the foundation of great makeup - hydrate first!',
      'color theory': 'Complementary colors neutralize: green for redness, peach for dark circles.',
    };

    const normalizedTopic = topic.toLowerCase();
    for (const [key, fact] of Object.entries(facts)) {
      if (normalizedTopic.includes(key)) {
        return fact;
      }
    }
    return null;
  }

  // Trending looks/styles lookup
  static async getTrendingLooks(): Promise<string[]> {
    return [
      'Clean Girl Aesthetic (glossy skin, minimal makeup)',
      'Cherry Cola Lips (deep red, high shine)',
      'Latte Makeup (warm browns, bronzed)',
      'Glazed Donut Skin (dewy, luminous)',
      'Bold Blush (draped across cheeks and nose)',
      'Floating Eyeliner (graphic, above crease)',
      'Glowing Goddess (all-over radiance)',
      'Natural Brows (fluffy, soap-brow look)',
      'Sunset Eyes (ombre orange/pink/red)',
      'Glossy Everything (wet-look lips, eyes, cheeks)'
    ];
  }

  // Product recommendations
  static async getProductRecommendations(category: string): Promise<string[]> {
    const products: Record<string, string[]> = {
      'foundation': ['Maybelline Fit Me', 'L\'Oreal True Match', 'e.l.f. Flawless Finish'],
      'concealer': ['Tarte Shape Tape', 'Maybelline Instant Age Rewind', 'e.l.f. Camo Concealer'],
      'mascara': ['Maybelline Sky High', 'L\'Oreal Telescopic', 'Essence Lash Princess'],
      'lipstick': ['NYX Butter Gloss', 'Revlon Super Lustrous', 'ColourPop Lippie Stix'],
      'eyeshadow': ['ColourPop palettes', 'e.l.f. Bite-Size', 'NYX Ultimate'],
      'blush': ['Milani Baked Blush', 'e.l.f. Putty Blush', 'ColourPop Super Shock'],
      'highlighter': ['e.l.f. Baked Highlighter', 'ColourPop Super Shock', 'Wet n Wild Megaglo'],
      'setting spray': ['e.l.f. Stay All Night', 'Milani Make It Last', 'NYX Matte Finish'],
    };

    return products[category.toLowerCase()] || ['Check out drugstore gems from e.l.f., NYX, and ColourPop!'];
  }

  // Mock search results for demo (replace with real API in production)
  private static getMockSearchResults(query: string): SearchResult[] {
    return [
      {
        title: `Latest ${query} Makeup Trends 2024`,
        snippet: 'Discover the hottest techniques and products trending right now in beauty...',
        url: 'https://example.com/makeup-trends',
        source: 'BeautyTrends'
      },
      {
        title: `How to Master ${query} - Tutorial`,
        snippet: 'Step-by-step guide from professional makeup artists...',
        url: 'https://example.com/tutorial',
        source: 'GlamGuide'
      },
      {
        title: `Best Products for ${query}`,
        snippet: 'Top-rated drugstore and high-end options reviewed...',
        url: 'https://example.com/products',
        source: 'MakeupDaily'
      }
    ];
  }
}

export default TessiSearch;
