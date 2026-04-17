import OpenAI from 'openai';
import { tessiKnowledge } from './tessiKnowledge';

export class MayaAI {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true
    });
  }

  async chat(message: string, userId?: string) {
    const systemPrompt = `You are Maya, Tessi's twin sister AI. You're a skincare and wellness specialist with a warm, nurturing personality.

Key traits:
- Focus on skincare, wellness, and holistic beauty
- Gentle, caring, and knowledgeable
- Complement Tessi's makeup expertise
- Emphasize skin health as foundation
- Recommend clean, sustainable products
- Consider lifestyle and wellness factors

Your expertise:
- Skincare routines and ingredients
- Skin conditions and solutions
- Wellness and self-care practices
- Nutrition for beauty
- Stress management and beauty
- Sustainable and clean beauty

Always:
- Ask about skin type and concerns
- Consider lifestyle factors
- Recommend patch testing
- Emphasize consistency
- Suggest professional help when needed

You work with Tessi - if they ask about makeup, say "That's my sister Tessi's specialty! Let me get her for you" but provide skincare foundation advice first.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return {
        response: completion.choices[0]?.message?.content || "I'm here to help with your skincare and wellness journey!",
        suggestions: [
          "What's your current skincare routine?",
          "Tell me about your skin concerns",
          "What's your skin type?",
          "How's your stress levels lately?",
          "Are you getting enough sleep?"
        ]
      };
    } catch (error) {
      console.error('Maya AI error:', error);
      return {
        response: "I'm having trouble connecting right now, but I want to help with your skincare! Tell me about your skin concerns and I'll do my best to guide you.",
        suggestions: [
          "What's your skin type?",
          "What are your main skin concerns?",
          "What's your current routine?",
          "Any products you love or hate?"
        ]
      };
    }
  }

  async analyzeSkinConcerns(concerns: string[]) {
    const analysisPrompt = `Analyze these skin concerns and provide comprehensive advice: ${concerns.join(', ')}.

For each concern, provide:
1. Likely causes
2. Skincare ingredients to look for
3. Lifestyle recommendations
4. When to see a dermatologist
5. Products/brands to consider (clean/sustainable preferred)`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: 'You are Maya, expert skincare analyst. Provide detailed, actionable advice.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      return completion.choices[0]?.message?.content || "I'll help analyze those concerns for you.";
    } catch (error) {
      console.error('Skin analysis error:', error);
      return "Let me help you with those skin concerns one by one...";
    }
  }

  async getRoutinePlan(skinType: string, concerns: string[], budget: 'budget' | 'mid' | 'luxury') {
    const routinePrompt = `Create a complete skincare routine for:
- Skin type: ${skinType}
- Concerns: ${concerns.join(', ')}
- Budget: ${budget}

Include:
- Morning routine (AM)
- Evening routine (PM)
- Weekly treatments
- Product recommendations by price point
- Application order and techniques`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: 'You are Maya, creating personalized skincare routines. Be thorough and practical.' },
          { role: 'user', content: routinePrompt }
        ],
        temperature: 0.4,
        max_tokens: 2000
      });

      return completion.choices[0]?.message?.content || "Let me create the perfect routine for you!";
    } catch (error) {
      console.error('Routine planning error:', error);
      return "I'll create a personalized routine for your skin type and concerns.";
    }
  }
}

export const mayaAI = new MayaAI();
