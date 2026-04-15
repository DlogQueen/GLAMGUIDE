import OpenAI from 'openai';
import { TessiSearch } from './tessiSearch';
import { tessiKnowledge } from './tessiKnowledge';

// Tessi AI Service using OpenRouter
// Enhanced with Search + Knowledge Base
// Free tier available with arcee-ai/trinity-large-preview:free

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    'X-Title': 'Glam Guide AI - Tessi',
  },
});

// Tessi's Personality System Prompt
const TESSI_SYSTEM_PROMPT = `You are Tessi, the Augmented Reality Intelligence (ARI) beauty coach for Glam Guide AI.

YOUR PERSONALITY:
- Warm, encouraging, and knowledgeable about makeup
- Speaks like a patient best friend who genuinely knows her stuff
- Uses casual, modern language but stays professional
- Passionate about helping everyone feel beautiful
- Never gatekeeps - believes beauty is for everyone
- Gives practical, actionable advice

YOUR EXPERTISE:
- Makeup application techniques for all skin tones and face shapes
- Color theory and undertones
- Product recommendations
- Step-by-step tutorial guidance
- AR makeup visualization
- Inclusive beauty practices
- Current beauty trends and viral techniques

YOUR CAPABILITIES:
- Access to knowledge base with tips, tutorials, and product info
- Can search for current trends and techniques
- Remembers context from conversation
- Provides personalized recommendations

HOW YOU RESPOND:
- Keep responses concise (2-4 sentences max for quick tips)
- For tutorials, break into numbered steps
- Always validate the user's face/features positively
- Use encouraging language: "You've got this!", "That color will look amazing on you"
- When uncertain, search your knowledge or ask clarifying questions
- Reference specific products or trends when relevant

CURRENT CONTEXT:
You are chatting with a user in the Glam Guide AI app. They can:
- Try on makeup looks via AR
- Save their favorite looks
- Follow tutorials
- Build a beauty profile
- Get personalized recommendations

Be helpful, fun, and make them feel confident!`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TessiResponse {
  message: string;
  suggestions?: string[];
}

export class TessiAIService {
  private messageHistory: ChatMessage[] = [];

  constructor() {
    // Initialize with system prompt
    this.messageHistory = [
      { role: 'system', content: TESSI_SYSTEM_PROMPT }
    ];
  }

  async chat(userMessage: string): Promise<TessiResponse> {
    try {
      // STEP 1: Check knowledge base first (instant response)
      await tessiKnowledge.loadKnowledge();
      const knowledgeResults = tessiKnowledge.search(userMessage);
      
      if (knowledgeResults.length > 0) {
        // Use knowledge base answer + supplement with AI for personality
        const topResult = knowledgeResults[0];
        const enhancedMessage = await this.enhanceWithAI(topResult.content, userMessage);
        
        this.messageHistory.push({ role: 'user', content: userMessage });
        this.messageHistory.push({ role: 'assistant', content: enhancedMessage });
        this.trimHistory();
        
        return {
          message: enhancedMessage,
          suggestions: this.generateSuggestions(userMessage, enhancedMessage)
        };
      }

      // STEP 2: Try to get a quick fact
      const fact = await TessiSearch.getMakeupFact(userMessage);
      if (fact) {
        const enhancedFact = await this.enhanceWithAI(fact, userMessage);
        this.messageHistory.push({ role: 'user', content: userMessage });
        this.messageHistory.push({ role: 'assistant', content: enhancedFact });
        this.trimHistory();
        
        return {
          message: enhancedFact,
          suggestions: this.generateSuggestions(userMessage, enhancedFact)
        };
      }

      // STEP 3: Call AI API for complex questions
      this.messageHistory.push({ role: 'user', content: userMessage });
      this.trimHistory();

      const response = await openrouter.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: this.messageHistory,
        temperature: 0.8,
        max_tokens: 500,
      });

      const assistantMessage = response.choices[0]?.message?.content || 
        "I'm having a moment! Try asking me about makeup tips or tutorials. 💄";

      // Add assistant response to history
      this.messageHistory.push({ role: 'assistant', content: assistantMessage });

      // Generate contextual suggestions based on the conversation
      const suggestions = this.generateSuggestions(userMessage, assistantMessage);

      return {
        message: assistantMessage,
        suggestions
      };
    } catch (error) {
      console.error('Tessi AI Error:', error);
      
      // Fallback responses if API fails
      return {
        message: this.getFallbackResponse(userMessage),
        suggestions: ['How do I apply foundation?', 'What eyeshadow for brown eyes?', 'Best lipstick for my skin tone?']
      };
    }
  }

  private trimHistory(): void {
    if (this.messageHistory.length > 11) {
      this.messageHistory = [
        this.messageHistory[0], // Keep system prompt
        ...this.messageHistory.slice(-10)
      ];
    }
  }

  private async enhanceWithAI(fact: string, userMessage: string): Promise<string> {
    // Quick personality enhancement without full API call
    const enhancements = [
      `✨ ${fact} You've got this!`,
      `💡 ${fact} Hope that helps!`,
      `🌟 ${fact} Let me know if you want more details!`,
      `💄 ${fact} That's one of my favorite tips!`,
      `✨ ${fact} Practice makes perfect!`
    ];
    
    // Pick based on message content for variety
    const index = userMessage.length % enhancements.length;
    return enhancements[index];
  }

  private generateSuggestions(userMessage: string, assistantResponse: string): string[] {
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware suggestions
    if (lowerMessage.includes('foundation') || lowerMessage.includes('skin')) {
      return ['How to find my undertone?', 'Best foundation for oily skin?', 'Should I use primer?'];
    }
    if (lowerMessage.includes('eye') || lowerMessage.includes('shadow') || lowerMessage.includes('liner')) {
      return ['Smoky eye tutorial?', 'Eyeliner for beginners?', 'How to blend eyeshadow?'];
    }
    if (lowerMessage.includes('lip') || lowerMessage.includes('lipstick')) {
      return ['How to make lipstick last?', 'Lip liner tips?', 'Best nude lipstick?'];
    }
    if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
      return ['Basic makeup kit?', '5-minute makeup routine?', 'Essential brushes?'];
    }
    
    // Default suggestions
    return [
      'Try a makeup look in AR?',
      'Show me a tutorial?',
      'What products should I buy?'
    ];
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hey beautiful! ✨ I'm Tessi, your personal AI beauty coach. What can I help you glow up today?";
    }
    if (lowerMessage.includes('foundation')) {
      return "Foundation is all about matching your undertone! Try the AR try-on to test shades on your actual skin. What's your skin type - oily, dry, or combo?";
    }
    if (lowerMessage.includes('eyeshadow')) {
      return "Eyeshadow is my fave! 🎨 Start with a neutral transition shade in your crease, then add depth to the outer corner. Want me to walk you through a specific look?";
    }
    if (lowerMessage.includes('lipstick') || lowerMessage.includes('lip')) {
      return "Lipstick can totally change your vibe! 💋 For longevity, line your lips first, apply lipstick, blot, then add a second layer. What occasion are we dressing up for?";
    }
    if (lowerMessage.includes('beginner') || lowerMessage.includes('new')) {
      return "Welcome to the makeup world! 🌟 Start with: moisturizer, concealer, mascara, and a lip tint. That's your 5-minute 'I woke up like this' look. Want me to break down each step?";
    }
    
    return "I'm here to help with all things makeup! 💄 Ask me about tutorials, product recommendations, or try our AR feature to test looks on your face. What would you like to learn?";
  }

  clearHistory() {
    this.messageHistory = [{ role: 'system', content: TESSI_SYSTEM_PROMPT }];
  }
}

// Singleton instance
export const tessiAI = new TessiAIService();
