import { supabase } from '@/lib/supabase';

// Advanced Agent Memory System
// Implements: Short-term, Long-term, Episodic, and Semantic memory

interface MemoryChunk {
  id: string;
  userId: string;
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic';
  content: string;
  embedding?: number[];
  metadata: {
    importance: number; // 1-10
    frequency: number; // How often accessed
    lastAccessed: string;
    tags: string[];
    context?: any;
  };
  createdAt: string;
  updatedAt: string;
}

interface WorkingMemory {
  currentContext: string;
  recentMessages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  currentGoal?: string;
  activePlan?: string[];
}

export interface AgentPlan {
  id: string;
  userId: string;
  goal: string;
  steps: string[];
  currentStep: number;
  status: 'planning' | 'executing' | 'completed' | 'failed';
  reasoning: string;
  createdAt: string;
  updatedAt: string;
}

export class AgentMemory {
  private workingMemory: Map<string, WorkingMemory> = new Map();
  private semanticCache: Map<string, MemoryChunk> = new Map();

  // ============================================
  // SHORT-TERM (WORKING) MEMORY
  // ============================================
  
  async updateWorkingMemory(userId: string, message: string, role: string = 'user') {
    let working = this.workingMemory.get(userId) || {
      currentContext: '',
      recentMessages: [],
      currentGoal: undefined,
      activePlan: undefined
    };

    // Add to recent messages (keep last 10)
    working.recentMessages.push({
      role,
      content: message,
      timestamp: new Date().toISOString()
    });
    
    if (working.recentMessages.length > 10) {
      working.recentMessages = working.recentMessages.slice(-10);
    }

    // Update context based on recent messages
    working.currentContext = this.extractContext(working.recentMessages);
    
    this.workingMemory.set(userId, working);
    
    // Also persist to episodic memory
    await this.storeEpisodicMemory(userId, `Message: ${message}`, { role, context: working.currentContext });
  }

  getWorkingMemory(userId: string): WorkingMemory | null {
    return this.workingMemory.get(userId) || null;
  }

  // ============================================
  // LONG-TERM (PERSISTENT) MEMORY
  // ============================================
  
  async storeLongTermMemory(userId: string, content: string, importance: number = 5, tags: string[] = [], context?: any) {
    const memory: Omit<MemoryChunk, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      type: 'long_term',
      content,
      metadata: {
        importance,
        frequency: 1,
        lastAccessed: new Date().toISOString(),
        tags,
        context
      }
    };

    const { data, error } = await supabase
      .from('agent_memory')
      .insert([memory])
      .select()
      .single();

    if (error) {
      console.error('Failed to store long-term memory:', error);
      return null;
    }

    return data;
  }

  async retrieveLongTermMemory(userId: string, query: string, limit: number = 5): Promise<MemoryChunk[]> {
    // Semantic search using tags and content similarity
    const { data, error } = await supabase
      .from('agent_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'long_term')
      .order('metadata->>importance', { ascending: false })
      .order('metadata->>frequency', { ascending: false })
      .limit(limit * 2); // Get more to filter

    if (error) {
      console.error('Failed to retrieve long-term memory:', error);
      return [];
    }

    // Filter for relevance to query
    const relevant = (data || []).filter(memory => 
      this.isRelevant(memory.content, query) || 
      memory.metadata.tags.some(tag => query.toLowerCase().includes(tag))
    );

    // Update access frequency
    relevant.forEach(async (memory) => {
      await supabase
        .from('agent_memory')
        .update({ 
          'metadata->>frequency': memory.metadata.frequency + 1,
          'metadata->>lastAccessed': new Date().toISOString()
        })
        .eq('id', memory.id);
    });

    return relevant.slice(0, limit);
  }

  // ============================================
  // EPISODIC MEMORY (Experiences)
  // ============================================
  
  async storeEpisodicMemory(userId: string, experience: string, context?: any) {
    const memory: Omit<MemoryChunk, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      type: 'episodic',
      content: experience,
      metadata: {
        importance: this.calculateEpisodicImportance(experience, context),
        frequency: 1,
        lastAccessed: new Date().toISOString(),
        tags: this.extractEpisodicTags(experience),
        context
      }
    };

    const { data, error } = await supabase
      .from('agent_memory')
      .insert([memory])
      .select()
      .single();

    if (error) {
      console.error('Failed to store episodic memory:', error);
      return null;
    }

    return data;
  }

  async getRecentEpisodes(userId: string, hours: number = 24): Promise<MemoryChunk[]> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const { data, error } = await supabase
      .from('agent_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'episodic')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false });

    return data || [];
  }

  // ============================================
  // SEMANTIC MEMORY (Facts & Knowledge)
  // ============================================
  
  async storeSemanticMemory(fact: string, category: string, confidence: number = 0.8) {
    // Check if already exists
    const existingKey = `${category}:${fact}`;
    if (this.semanticCache.has(existingKey)) {
      return this.semanticCache.get(existingKey);
    }

    const memory: Omit<MemoryChunk, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: 'global', // Global semantic memory
      type: 'semantic',
      content: fact,
      metadata: {
        importance: Math.floor(confidence * 10),
        frequency: 1,
        lastAccessed: new Date().toISOString(),
        tags: [category],
        context: { confidence }
      }
    };

    const { data, error } = await supabase
      .from('agent_memory')
      .insert([memory])
      .select()
      .single();

    if (error) {
      console.error('Failed to store semantic memory:', error);
      return null;
    }

    this.semanticCache.set(existingKey, data);
    return data;
  }

  async retrieveSemanticMemory(query: string, category?: string): Promise<MemoryChunk[]> {
    let cacheQuery = category ? `${category}:` : '';
    
    // Search cache first
    const cached = Array.from(this.semanticCache.values())
      .filter(memory => 
        (!category || memory.metadata.tags.includes(category)) &&
        this.isRelevant(memory.content, query)
      );

    if (cached.length > 0) {
      return cached.slice(0, 5);
    }

    // Fallback to database
    const dbQuery = supabase
      .from('agent_memory')
      .select('*')
      .eq('type', 'semantic');

    if (category) {
      dbQuery.contains('metadata->>tags', [category]);
    }

    const { data, error } = await dbQuery.limit(10);

    if (error) {
      console.error('Failed to retrieve semantic memory:', error);
      return [];
    }

    return (data || []).filter(memory => this.isRelevant(memory.content, query));
  }

  // ============================================
  // AGENT PLANNING & AUTONOMY
  // ============================================
  
  async createPlan(userId: string, goal: string, reasoning: string): Promise<AgentPlan> {
    const plan: Omit<AgentPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      goal,
      steps: await this.generateSteps(goal),
      currentStep: 0,
      status: 'planning',
      reasoning
    };

    const { data, error } = await supabase
      .from('agent_plans')
      .insert([plan])
      .select()
      .single();

    if (error) {
      console.error('Failed to create plan:', error);
      throw error;
    }

    // Store in working memory
    const working = this.workingMemory.get(userId) || {
      currentContext: '',
      recentMessages: [],
      currentGoal: goal,
      activePlan: plan.steps
    };
    working.currentGoal = goal;
    working.activePlan = plan.steps;
    this.workingMemory.set(userId, working);

    return data;
  }

  async executePlanStep(userId: string, planId: string): Promise<boolean> {
    const { data: plan, error } = await supabase
      .from('agent_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error || !plan) return false;

    if (plan.currentStep >= plan.steps.length) {
      // Plan completed
      await supabase
        .from('agent_plans')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', planId);
      
      await this.storeEpisodicMemory(userId, `Completed plan: ${plan.goal}`, { planId, steps: plan.steps });
      return true;
    }

    const currentStep = plan.steps[plan.currentStep];
    
    // Execute step (this would integrate with actual capabilities)
    const stepResult = await this.executeStep(currentStep, userId);
    
    if (stepResult.success) {
      // Move to next step
      await supabase
        .from('agent_plans')
        .update({ 
          currentStep: plan.currentStep + 1,
          status: 'executing',
          updated_at: new Date().toISOString()
        })
        .eq('id', planId);

      await this.storeEpisodicMemory(userId, `Executed step: ${currentStep}`, { planId, step: plan.currentStep, result: stepResult });
      return true;
    } else {
      // Self-correction: try alternative approach
      const alternativeStep = await this.generateAlternative(currentStep, stepResult.error);
      if (alternativeStep) {
        plan.steps[plan.currentStep] = alternativeStep;
        await supabase
          .from('agent_plans')
          .update({ 
            steps: plan.steps,
            updated_at: new Date().toISOString()
          })
          .eq('id', planId);
      }
      return false;
    }
  }

  // ============================================
  // RAG INTEGRATION
  // ============================================
  
  async retrieveRelevantContext(userId: string, query: string): Promise<{
    shortTerm: WorkingMemory | null;
    longTerm: MemoryChunk[];
    episodic: MemoryChunk[];
    semantic: MemoryChunk[];
  }> {
    const [workingMemory, longTerm, episodic, semantic] = await Promise.all([
      Promise.resolve(this.getWorkingMemory(userId)),
      this.retrieveLongTermMemory(userId, query),
      this.getRecentEpisodes(userId, 24),
      this.retrieveSemanticMemory(query)
    ]);

    return {
      shortTerm: workingMemory,
      longTerm,
      episodic,
      semantic
    };
  }

  // ============================================
  // HELPER METHODS
  // ============================================
  
  private extractContext(messages: any[]): string {
    return messages.slice(-3).map(m => m.content).join(' ');
  }

  private isRelevant(content: string, query: string): boolean {
    const contentWords = content.toLowerCase().split(' ');
    const queryWords = query.toLowerCase().split(' ');
    
    const overlap = contentWords.filter(word => 
      word.length > 3 && queryWords.includes(word)
    ).length;
    
    return overlap >= 2;
  }

  private calculateEpisodicImportance(experience: string, context?: any): number {
    let importance = 5; // Base importance
    
    // Higher importance for emotional or significant events
    if (experience.includes('success') || experience.includes('failed')) importance += 2;
    if (experience.includes('learned') || experience.includes('discovered')) importance += 1;
    if (context?.error) importance += 1;
    
    return Math.min(10, importance);
  }

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

  private extractEpisodicTags(experience: string): string[] {
    const tags: string[] = [];
    const lower = experience.toLowerCase();
    
    if (lower.includes('tutorial')) tags.push('tutorial');
    if (lower.includes('product')) tags.push('product');
    if (lower.includes('technique')) tags.push('technique');
    if (lower.includes('error') || lower.includes('failed')) tags.push('error');
    if (lower.includes('success') || lower.includes('completed')) tags.push('success');
    
    return tags;
  }

  private async generateSteps(goal: string): Promise<string[]> {
    // This would use LLM to break down goal into steps
    // For now, return basic step structure
    const stepPatterns: Record<string, string[]> = {
      'tutorial': ['Analyze user skill level', 'Find appropriate tutorial', 'Break down into steps', 'Provide guidance'],
      'product': ['Identify user needs', 'Research options', 'Compare features', 'Make recommendation'],
      'technique': ['Explain theory', 'Demonstrate steps', 'Provide tips', 'Practice suggestions']
    };

    const lower = goal.toLowerCase();
    for (const [key, steps] of Object.entries(stepPatterns)) {
      if (lower.includes(key)) return steps;
    }

    return ['Understand request', 'Gather information', 'Provide solution', 'Follow up'];
  }

  private async executeStep(step: string, userId: string): Promise<{ success: boolean; error?: string }> {
    // This would integrate with actual agent capabilities
    // For now, simulate execution
    try {
      // Store step execution attempt
      await this.storeEpisodicMemory(userId, `Executing: ${step}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async generateAlternative(failedStep: string, error: string): Promise<string | null> {
    // This would use LLM to generate alternative approach
    return `Alternative approach to: ${failedStep}`;
  }

  // Memory consolidation and cleanup
  async consolidateMemory(userId: string) {
    // Promote important short-term memories to long-term
    const working = this.getWorkingMemory(userId);
    if (!working) return;

    for (const message of working.recentMessages.slice(-3)) {
      if (message.content.length > 50) {
        await this.storeLongTermMemory(userId, message.content, 6, ['conversation'], { role: message.role });
      }
    }

    // Clean up old episodic memories (keep last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await supabase
      .from('agent_memory')
      .delete()
      .eq('user_id', userId)
      .eq('type', 'episodic')
      .lt('created_at', thirtyDaysAgo.toISOString());
  }

  // Get memory analytics for user
  async getMemoryAnalytics(userId: string) {
    try {
      const { data, error } = await supabase
        .from('agent_memory')
        .select('type, metadata, created_at')
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
        analytics.averageImportance += memory.metadata.importance;
        
        memory.metadata.tags?.forEach((tag: string) => {
          analytics.topTags[tag] = (analytics.topTags[tag] || 0) + 1;
        });

        // Count memories from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (new Date(memory.created_at) > weekAgo) {
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

export const agentMemory = new AgentMemory();
