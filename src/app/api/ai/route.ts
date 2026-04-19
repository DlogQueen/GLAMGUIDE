import { NextRequest, NextResponse } from 'next/server';

// Groq API configuration (primary)
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// OpenRouter fallback configuration
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ||
                       process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
const OPENROUTER_BACKUP = process.env.OPENROUTER_API_KEY_BACKUP ||
                          process.env.NEXT_PUBLIC_OPENROUTER_API_KEY_BACKUP || '';

async function callGroq(
  messages: any[],
  model: string,
  apiKey: string
): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callOpenRouter(
  messages: any[],
  model: string,
  apiKey: string
): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://glamguide-ari.vercel.app',
      'X-Title': 'Glam Guide AI',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model, agent } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Choose model based on provider
    // Groq uses different model names than OpenRouter
    const groqModel = 'llama-3.3-70b-versatile';
    const openRouterModel = model || 'meta-llama/llama-4-scout-17b-16e-instruct';
    
    if (agent === 'maya' || agent === 'vision') {
      // Vision models only available on OpenRouter
    }

    let response = '';

    // Try Groq first (primary)
    if (GROQ_API_KEY) {
      try {
        response = await callGroq(messages, groqModel, GROQ_API_KEY);
        return NextResponse.json({ message: response });
      } catch (groqError) {
        console.warn('[Groq] Failed, trying OpenRouter:', groqError);
      }
    }

    // Fallback to OpenRouter
    const apiKey = OPENROUTER_BACKUP || OPENROUTER_KEY;
    if (apiKey) {
      const fallbackModel = 'arcee-ai/trinity-large-preview:free';
      response = await callOpenRouter(messages, fallbackModel, apiKey);
      return NextResponse.json({ message: response });
    }

    return NextResponse.json(
      { error: 'No AI service available' },
      { status: 503 }
    );
  } catch (error: any) {
    console.error('[AI Proxy] Error:', error);
    return NextResponse.json(
      { error: 'AI service error' },
      { status: 502 }
    );
  }
}
