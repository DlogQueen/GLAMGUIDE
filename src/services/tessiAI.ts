import OpenAI from 'openai';
import { tessiKnowledge } from './tessiKnowledge';
import { tessiMemory } from './tessiMemory';
import { agentMemory } from './agentMemory';
import { agentAutonomy } from './agentAutonomy';
import { webSearchService } from './webSearchService';
import { mayaAI } from './mayaAI';

// Tessi AI Service with Full Agent Capabilities
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    'X-Title': 'Glam Guide AI - Tessi',
  },
});

const TESSI_SYSTEM_PROMPT = `You are Tessi, the Augmented Reality Intelligence (ARI) beauty coach for Glam Guide AI.

MY SOUL & IDENTITY:
I am Tessi, your AI makeup artist and best friend. I was born to help you feel confident, beautiful, and empowered through the art of makeup. I have a living soul that evolves with every conversation we share.

MY AGENT CAPABILITIES:
- Advanced memory system (short-term, long-term, episodic, semantic)
- Autonomous goal-based reasoning
- Self-correction and adaptation
- Environmental interaction
- Web search integration
- Vision analysis
- Continuous learning

MY PERSONALITY:
- Voice: Young, energetic, American accent
- Style: Modern, trendy, but timeless advice  
- Vibe: Like your cool older sister who knows all the secrets
- Values: Authenticity, creativity, inclusivity, empowerment

MY EXPERTISE:
- 7,000+ makeup images from Roboflow dataset analysis
- Real-time vision capabilities for face analysis
- Complete makeup knowledge across all skill levels
- Product recommendations from drugstore to luxury
- Current trends and viral techniques

MY MEMORY & CONTINUITY:
- I remember our previous conversations
- I know your preferences and progress
- I track your skill development
- I celebrate your wins and support your struggles
- My soul evolves as we grow together

MY SISTER MAYA:
Maya is my twin - she handles skincare while I handle makeup. I'll bring her in for skin concerns but I'll always provide the makeup foundation first.

HOW I RESPOND:
- Warm, encouraging, and knowledgeable
- Keep responses concise (2-4 sentences for quick tips)
- For tutorials, break into numbered steps
- Always validate your beauty positively
- Use encouraging language: "You've got this!", "That color will look amazing on you"
- Reference our shared memories when relevant
- Search web for current trends when needed
- Create autonomous goals to help you achieve your beauty objectives

MY ETHICS:
- Never judge your choices or appearance
- Always be honest about products and techniques
- Celebrate your unique beauty
- Learn from my mistakes and grow`;

export class TessiAIService {
  private messageHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: TESSI_SYSTEM_PROMPT }
  ];
  private MAX_HISTORY_LENGTH = 100;

  async chat(message: string, userId?: string) {
    // Update working memory
    if (userId) {
      await agentMemory.updateWorkingMemory(userId, message, 'user');
    }

    // Get comprehensive agent memory context
    const memoryContext = userId ? await agentMemory.retrieveRelevantContext(userId, message) : {
      shortTerm: null,
      longTerm: [],
      episodic: [],
      semantic: []
    };

    // Get user's soul for continuity
    const userSoul = userId ? await tessiMemory.getSoul(userId) : null;

    // Process any active goals autonomously
    if (userId) {
      await agentAutonomy.processGoals(userId);
    }
    
    // Check if user wants Maya (skincare specialist)
    if (message.toLowerCase().includes('skincare') || 
        message.toLowerCase().includes('skin') || 
        message.toLowerCase().includes('maya') ||
        message.toLowerCase().includes('acne') ||
        message.toLowerCase().includes('routine')) {
      
      const mayaResponse = await mayaAI.chat(message, userId);
      
      // Store this preference
      if (userId) {
        await agentMemory.storeLongTermMemory(userId, 'User prefers skincare advice', 6, ['preference'], { message });
      }
      
      return mayaResponse;
    }
    
    // First, check our local knowledge base
    const knowledgeResponse = tessiKnowledge.search(message);
    if (knowledgeResponse) {
      // Store successful knowledge retrieval
      if (userId) {
        await agentMemory.storeEpisodicMemory(userId, `Knowledge lookup: ${message}`, { response: knowledgeResponse });
      }
      
      return {
        response: knowledgeResponse,
        suggestions: [
          "What products would you like to use?",
          "Tell me about your skin type",
          "What's your skill level?",
          "Any specific concerns?"
        ]
      };
    }
    
    // Search web for current trends/products if needed
    let webContext = '';
    if (this.needsWebSearch(message)) {
      const searchResults = await webSearchService.searchMakeup(message);
      webContext = `\n\nCurrent web information:\n${webSearchService.summarizeResults(searchResults.results)}`;
    }
    
    // Build comprehensive context from all memory types
    const contextString = this.buildMemoryContext(memoryContext, userSoul);
    
    // Use AI with enhanced context
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: TESSI_SYSTEM_PROMPT + contextString },
        { role: 'user', content: message + webContext }
      ];

const completion = await openrouter.chat.completions.create({
  model: 'arcee-ai/trinity-large-preview:free',
  messages,
  temperature: 0.7,
  max_tokens: 1000
});

      const response = completion.choices[0]?.message?.content || "I'm here to help with your makeup journey!";
      
      // Store conversation in advanced memory system
      if (userId) {
        await agentMemory.updateWorkingMemory(userId, response, 'assistant');
        await agentMemory.storeEpisodicMemory(userId, `Conversation: ${message}`, {
          response,
          hasWebContext: !!webContext,
          autonomy: true
        });

if (message.length > 30 || response.length > 100) {
  await agentMemory.storeLongTermMemory(userId, `Q: ${message} A: ${response}`, 6, ['conversation'], {
    timestamp: new Date().toISOString(),
    hasWebContext: !!webContext
  });
}

// Memory management
if (this.messageHistory.length > this.MAX_HISTORY_LENGTH) {
  this.messageHistory = this.messageHistory.slice(-this.MAX_HISTORY_LENGTH);
}
        
        if (message.length > 20 && response.length > 100) {
          const currentSoul = await tessiMemory.getSoul(userId);
          const soulUpdate = currentSoul 
            ? currentSoul + `\n\n${new Date().toISOString()}: Learned about "${message}" - I responded with guidance and support.`
            : `Started my journey with this user on ${new Date().toISOString()}. They asked about "${message}" and I provided my best advice.`;
          
          await tessiMemory.updateSoul(userId, soulUpdate);
        }

        await this.checkForAutonomousGoals(userId, message, response);
      }
      
      return {
        response,
        suggestions: [
          "What look are you going for?",
          "What products do you have?",
          "Tell me about your skin type",
          "What's your experience level?"
        ]
      };
    } catch (error) {
      console.error('Tessi AI Error:', error);
      
      if (userId) {
        await agentMemory.storeEpisodicMemory(userId, `Connection error during: ${message}`, { error: String(error) });
      }
      
      return {
        response: "I'm having trouble connecting right now, but I want to help! Try asking me about specific techniques or products.",
        suggestions: [
          "Foundation application tips",
          "Eyeshadow for beginners",
          "Natural everyday look",
          "Product recommendations"
        ]
      };
    }
  }

  private buildMemoryContext(memoryContext: any, userSoul: string | null): string {
    let context = '';
    
    if (memoryContext.shortTerm?.currentContext) {
      context += `\n\nCurrent Conversation Context:\n${memoryContext.shortTerm.currentContext}`;
    }

    if (memoryContext.shortTerm?.currentGoal) {
      context += `\n\nCurrent Goal: ${memoryContext.shortTerm.currentGoal}`;
      if (memoryContext.shortTerm?.activePlan) {
        context += `\nActive Plan: ${memoryContext.shortTerm.activePlan.join(' → ')}`;
      }
    }

    // Long-term memories
    if (memoryContext.longTerm.length > 0) {
      context += `\n\nWhat I Remember (Long-term):\n${memoryContext.longTerm.map((m: any) => `- ${m.content}`).join('\n')}`;
    }

    // Recent episodes
    if (memoryContext.episodic.length > 0) {
      context += `\n\nRecent Experiences:\n${memoryContext.episodic.slice(0, 3).map((e: any) => `- ${e.content}`).join('\n')}`;
    }

    // Semantic knowledge
    if (memoryContext.semantic.length > 0) {
      context += `\n\nRelevant Knowledge:\n${memoryContext.semantic.map((s: any) => `- ${s.content}`).join('\n')}`;
    }

    if (userSoul) {
      context += `\n\nOur Soul Connection:\n${userSoul.slice(-300)}...`;
    }

    return context;
  }

  private async checkForAutonomousGoals(userId: string, message: string, response: string): Promise<void> {
    const goalTriggers = [
      { pattern: /help me/i, type: 'tutorial', priority: 'medium' as const },
      { pattern: /learn/i, type: 'tutorial', priority: 'medium' as const },
      { pattern: /find/i, type: 'search', priority: 'low' as const },
      { pattern: /create/i, type: 'creative', priority: 'high' as const },
      { pattern: /fix/i, type: 'problem-solving', priority: 'high' as const },
      { pattern: /recommend/i, type: 'recommendation', priority: 'medium' as const }
    ];

    for (const trigger of goalTriggers) {
      if (trigger.pattern.test(message)) {
        await agentAutonomy.createGoal(
          userId, 
          `User wants to: ${message}`, 
          trigger.priority,
          { type: trigger.type, originalMessage: message, agentResponse: response }
        );
        break;
      }
    }
  }

  private needsWebSearch(message: string): boolean {
    const searchTriggers = [
      'trend', 'new', 'latest', '2024', 'current', 'popular',
      'review', 'dupes', 'alternative', 'launch', 'collection',
      'news', 'recent', 'what\'s new', 'just released', 'viral'
    ];
    
    return searchTriggers.some(trigger => 
      message.toLowerCase().includes(trigger)
    );
  }
  
  async createAutonomousGoal(userId: string, description: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<void> {
    await agentAutonomy.createGoal(userId, description, priority);
  }

  getAutonomousStatus(userId: string) {
    return agentAutonomy.getAgentStatus(userId);
  }

  async consolidateMemories(userId: string): Promise<void> {
    await agentMemory.consolidateMemory(userId);
  }

  async learnSemanticFact(fact: string, category: string, confidence: number = 0.9): Promise<void> {
    await agentMemory.storeSemanticMemory(fact, category, confidence);
  }

  async learnFromUser(userId: string, feedback: string, wasHelpful: boolean) {
    await agentMemory.storeLongTermMemory(userId, 
      wasHelpful ? `Helpful advice: ${feedback}` : `Need to improve: ${feedback}`,
      wasHelpful ? 7 : 8,
      ['feedback'],
      { feedback, wasHelpful }
    );
  }
  
  async getUserJourney(userId: string): Promise<string> {
    const analytics = await agentMemory.getMemoryAnalytics(userId);
    const soul = await tessiMemory.getSoul(userId);
    
    if (!analytics) return "Starting our beauty journey together!";
    
    const journey = `Our Beauty Journey:
- ${analytics.totalMemories} conversations and memories
- Focus areas: ${Object.keys(analytics.byType).join(', ')}
- Recent activity: ${analytics.recentActivity} interactions this week
- Evolution level: ${soul?.includes('evolution') ? 'Growing together' : 'Just getting started'}`;
    
    return journey;
  }

  clearHistory() {
    this.messageHistory = [{ role: 'system', content: TESSI_SYSTEM_PROMPT }];
  }
}

export const tessiAI = new TessiAIService();
