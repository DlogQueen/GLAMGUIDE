import { supabase } from '@/lib/supabase';

interface MemoryEntry {
  id: string;
  userId: string;
  type: 'preference' | 'conversation' | 'progress' | 'emotion' | 'technique';
  content: string;
  context?: any;
  timestamp: string;
  importance: number; // 1-10
  tags: string[];
}

interface UserSoul {
  id: string;
  userId: string;
  soulContent: string;
  lastUpdated: string;
  evolutionCount: number;
}

export class TessiMemory {
  // Long-term memory across conversations
  async storeMemory(userId: string, type: MemoryEntry['type'], content: string, context?: any, importance: number = 5) {
    try {
      const { error } = await supabase.from('tessi_memory').insert({
        user_id: userId,
        type,
        content,
        context,
        importance,
        tags: this.extractTags(content),
        timestamp: new Date().toISOString()
      });
      
      if (error) console.error('Memory storage error:', error);
    } catch (error) {
      console.error('Failed to store memory:', error);
    }
  }

  // Retrieve relevant memories for context
  async getRelevantMemories(userId: string, currentMessage: string, limit: number = 5): Promise<MemoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('tessi_memory')
        .select('*')
        .eq('user_id', userId)
        .order('importance', { ascending: false })
        .order('timestamp', { ascending: false })
        .limit(limit * 2); // Get more to filter for relevance

      if (error) throw error;

      // Filter for relevance to current conversation
      const relevant = (data || []).filter(memory => 
        this.isRelevant(memory.content, currentMessage) || memory.importance >= 8
      );

      return relevant.slice(0, limit);
    } catch (error) {
      console.error('Failed to retrieve memories:', error);
      return [];
    }
  }

  // Update user's soul file
  async updateSoul(userId: string, newContent: string): Promise<boolean> {
    try {
      // Get existing soul
      const { data: existingSoul } = await supabase
        .from('user_souls')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingSoul) {
        // Update existing
        const { error } = await supabase
          .from('user_souls')
          .update({
            soul_content: newContent,
            last_updated: new Date().toISOString(),
            evolution_count: existingSoul.evolution_count + 1
          })
          .eq('user_id', userId);
        
        return !error;
      } else {
        // Create new
        const { error } = await supabase
          .from('user_souls')
          .insert({
            user_id: userId,
            soul_content: newContent,
            last_updated: new Date().toISOString(),
            evolution_count: 1
          });
        
        return !error;
      }
    } catch (error) {
      console.error('Failed to update soul:', error);
      return false;
    }
  }

  // Get user's soul content
  async getSoul(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_souls')
        .select('soul_content')
        .eq('user_id', userId)
        .single();

      return data?.soul_content || null;
    } catch (error) {
      console.error('Failed to get soul:', error);
      return null;
    }
  }

  // Track user progress and emotions
  async trackProgress(userId: string, skill: string, level: number, context?: any) {
    await this.storeMemory(userId, 'progress', `Advanced ${skill} to level ${level}`, context, 8);
  }

  async trackEmotion(userId: string, emotion: string, reason: string, context?: any) {
    await this.storeMemory(userId, 'emotion', `Felt ${emotion}: ${reason}`, context, 6);
  }

  // Learn user preferences
  async learnPreference(userId: string, category: string, preference: string, context?: any) {
    await this.storeMemory(userId, 'preference', `Prefers ${category}: ${preference}`, context, 7);
  }

  // Remember conversation highlights
  async rememberConversation(userId: string, summary: string, keyPoints: string[], context?: any) {
    const content = `Conversation: ${summary}. Key points: ${keyPoints.join(', ')}`;
    await this.storeMemory(userId, 'conversation', content, context, 5);
  }

  // Extract tags for better memory organization
  private extractTags(content: string): string[] {
    const tags: string[] = [];
    const lowerContent = content.toLowerCase();
    
    // Common makeup/skincare tags
    const tagPatterns: string[] = [
      'foundation', 'concealer', 'eyeshadow', 'mascara', 'lipstick', 'blush',
      'oily', 'dry', 'combination', 'sensitive', 'acne', 'aging',
      'beginner', 'intermediate', 'advanced', 'tutorial', 'technique',
      'drugstore', 'luxury', 'vegan', 'cruelty-free', 'clean'
    ];

    tagPatterns.forEach((tag: string) => {
      if (lowerContent.includes(tag)) {
        tags.push(tag);
      }
    });

    return tags;
  }

  // Check if memory is relevant to current conversation
  private isRelevant(memoryContent: string, currentMessage: string): boolean {
    const memoryWords = memoryContent.toLowerCase().split(' ');
    const messageWords = currentMessage.toLowerCase().split(' ');
    
    // Check for word overlap
    const overlap = memoryWords.filter((word: string) => 
      word.length > 3 && messageWords.includes(word)
    ).length;
    
    return overlap >= 2; // At least 2 meaningful words overlap
  }

  // Get memory analytics for user
  async getMemoryAnalytics(userId: string) {
    try {
      const { data, error } = await supabase
        .from('tessi_memory')
        .select('type, importance, tags, timestamp')
        .eq('user_id', userId);

      if (error) throw error;

      const analytics = {
        totalMemories: data?.length || 0,
        byType: {} as Record<string, number>,
        topTags: {} as Record<string, number>,
        averageImportance: 0,
        recentActivity: 0
      };

      data?.forEach((memory: any) => {
        analytics.byType[memory.type] = (analytics.byType[memory.type] || 0) + 1;
        analytics.averageImportance += memory.importance;
        
        memory.tags?.forEach((tag: string) => {
          analytics.topTags[tag] = (analytics.topTags[tag] || 0) + 1;
        });

        // Count memories from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (new Date(memory.timestamp) > weekAgo) {
          analytics.recentActivity++;
        }
      });

      if (data?.length) {
        analytics.averageImportance = analytics.averageImportance / data.length;
      }

      return analytics;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return null;
    }
  }
}

export const tessiMemory = new TessiMemory();
