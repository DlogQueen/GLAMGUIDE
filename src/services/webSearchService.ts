interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
}

export class WebSearchService {
  private apiKey: string;
  private baseUrl = 'https://api.serper.dev/search';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_SERPER_API_KEY || '';
  }

  async searchMakeup(query: string, numResults: number = 5): Promise<SearchResponse> {
    if (!this.apiKey) {
      // Fallback to mock results for development
      return this.getMockResults(query, numResults);
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: `${query} makeup tutorial 2024`,
          num: numResults,
          gl: 'us', // US results
          hl: 'en' // English
        })
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        results: (data.organic || []).map((item: any) => ({
          title: item.title,
          url: item.link,
          snippet: item.snippet,
          publishedDate: item.date
        })),
        totalResults: data.searchInformation?.totalResults || 0,
        query
      };
    } catch (error) {
      console.error('Web search error:', error);
      return this.getMockResults(query, numResults);
    }
  }

  async searchTrends(): Promise<SearchResponse> {
    return this.searchMakeup('makeup trends 2024', 8);
  }

  async searchProductReviews(productName: string): Promise<SearchResponse> {
    return this.searchMakeup(`${productName} review swatches`, 6);
  }

  async searchTechniques(technique: string): Promise<SearchResponse> {
    return this.searchMakeup(`${technique} technique tutorial`, 6);
  }

  async searchDupes(productName: string): Promise<SearchResponse> {
    return this.searchMakeup(`${productName} dupe affordable alternative`, 6);
  }

  private getMockResults(query: string, numResults: number): SearchResponse {
    const mockResults: SearchResult[] = [
      {
        title: `Latest ${query} Tutorial 2024`,
        url: 'https://youtube.com/example',
        snippet: 'Step-by-step guide for achieving the perfect look with modern techniques and products.',
        publishedDate: '2024-03-15'
      },
      {
        title: `${query} Tips and Tricks`,
        url: 'https://beauty-blog.com/example',
        snippet: 'Professional makeup artists share their secrets for flawless application.',
        publishedDate: '2024-03-10'
      },
      {
        title: `Best ${query} Products This Year`,
        url: 'https://makeup-review.com/example',
        snippet: 'Comprehensive review of top-rated products with swatches and detailed analysis.',
        publishedDate: '2024-03-08'
      },
      {
        title: `${query} for Beginners`,
        url: 'https://makeup-guide.com/example',
        snippet: 'Easy-to-follow tutorial perfect for those just starting out with makeup.',
        publishedDate: '2024-03-05'
      },
      {
        title: `Advanced ${query} Techniques`,
        url: 'https://pro-makeup.com/example',
        snippet: 'Take your skills to the next level with these professional techniques.',
        publishedDate: '2024-03-01'
      }
    ];

    return {
      results: mockResults.slice(0, numResults),
      totalResults: mockResults.length,
      query
    };
  }

  // Summarize search results for AI consumption
  summarizeResults(results: SearchResult[]): string {
    if (!results.length) return 'No current information found.';
    
    const summary = results.map((result, index) => 
      `${index + 1}. ${result.title}: ${result.snippet}`
    ).join('\n');
    
    return `Found ${results.length} relevant results:\n${summary}`;
  }

  // Extract key insights from results
  extractInsights(results: SearchResult[]): string[] {
    const insights: string[] = [];
    
    results.forEach(result => {
      // Look for specific patterns in snippets
      if (result.snippet.toLowerCase().includes('tip')) {
        insights.push(`💡 ${result.snippet}`);
      }
      if (result.snippet.toLowerCase().includes('best') || result.snippet.toLowerCase().includes('top')) {
        insights.push(`🏆 ${result.snippet}`);
      }
      if (result.snippet.toLowerCase().includes('tutorial') || result.snippet.toLowerCase().includes('guide')) {
        insights.push(`📚 ${result.snippet}`);
      }
    });
    
    return insights.slice(0, 3); // Top 3 insights
  }
}

export const webSearchService = new WebSearchService();
