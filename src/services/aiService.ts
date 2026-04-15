import { AIMakeupAnalysis, MakeupStyle, MakeupStep } from '@/types';

// API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// OpenRouter fallback configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Fallback AI logic for when no API key is available
const STYLE_KEYWORDS: Record<string, { tags: string[]; difficulty: 'beginner' | 'intermediate' | 'advanced'; baseColors: string[] }> = {
  'natural': { tags: ['natural', 'everyday', 'minimal'], difficulty: 'beginner', baseColors: ['nude', 'beige', 'peach'] },
  'soft': { tags: ['soft', 'romantic', 'gentle'], difficulty: 'beginner', baseColors: ['pink', 'peach', 'mauve'] },
  'romantic': { tags: ['romantic', 'soft', 'feminine'], difficulty: 'beginner', baseColors: ['rose', 'pink', 'champagne'] },
  'dewy': { tags: ['dewy', 'glowing', 'k-beauty'], difficulty: 'beginner', baseColors: ['champagne', 'pearl', 'gold'] },
  'glow': { tags: ['glowing', 'dewy', 'luminous'], difficulty: 'beginner', baseColors: ['gold', 'bronze', 'champagne'] },
  'pink': { tags: ['pink', 'feminine', 'romantic'], difficulty: 'beginner', baseColors: ['pink', 'rose', 'mauve'] },
  'smokey': { tags: ['evening', 'glam', 'seductive'], difficulty: 'intermediate', baseColors: ['grey', 'black', 'silver'] },
  'bold': { tags: ['dramatic', 'statement', 'bold'], difficulty: 'intermediate', baseColors: ['red', 'burgundy', 'plum'] },
  'dramatic': { tags: ['dramatic', 'evening', 'glam'], difficulty: 'advanced', baseColors: ['black', 'deep purple', 'gold'] },
  'glitter': { tags: ['glam', 'party', 'sparkle'], difficulty: 'intermediate', baseColors: ['silver', 'gold', 'glitter'] },
  'vintage': { tags: ['vintage', 'classic', 'retro'], difficulty: 'intermediate', baseColors: ['red', 'cream', 'black'] },
  'editorial': { tags: ['editorial', 'fashion', 'artistic'], difficulty: 'advanced', baseColors: ['white', 'black', 'neon'] },
  'spring': { tags: ['spring', 'fresh', 'pastel'], difficulty: 'beginner', baseColors: ['peach', 'coral', 'mint'] },
  'summer': { tags: ['summer', 'bronze', 'warm'], difficulty: 'beginner', baseColors: ['bronze', 'coral', 'gold'] },
  'fall': { tags: ['fall', 'warm', 'earthy'], difficulty: 'intermediate', baseColors: ['burgundy', 'copper', 'olive'] },
  'winter': { tags: ['winter', 'cool', 'icy'], difficulty: 'intermediate', baseColors: ['silver', 'icy blue', 'plum'] },
  'bridal': { tags: ['bridal', 'elegant', 'timeless'], difficulty: 'intermediate', baseColors: ['champagne', 'rose gold', 'ivory'] },
  'neon': { tags: ['neon', 'bold', 'creative'], difficulty: 'advanced', baseColors: ['neon pink', 'electric blue', 'lime'] },
  'mermaid': { tags: ['mermaid', 'shimmer', 'iridescent'], difficulty: 'advanced', baseColors: ['teal', 'purple', 'iridescent'] },
  'goth': { tags: ['goth', 'dark', 'mysterious'], difficulty: 'intermediate', baseColors: ['black', 'deep red', 'purple'] },
  'golden': { tags: ['golden', 'luxury', 'glam'], difficulty: 'intermediate', baseColors: ['gold', 'bronze', 'champagne'] },
  'copper': { tags: ['copper', 'warm', 'metallic'], difficulty: 'intermediate', baseColors: ['copper', 'bronze', 'peach'] },
  'berry': { tags: ['berry', 'rich', 'autumn'], difficulty: 'intermediate', baseColors: ['berry', 'plum', 'wine'] },
  'coral': { tags: ['coral', 'fresh', 'spring'], difficulty: 'beginner', baseColors: ['coral', 'peach', 'orange'] },
  'peach': { tags: ['peach', 'warm', 'natural'], difficulty: 'beginner', baseColors: ['peach', 'apricot', 'coral'] },
  'mauve': { tags: ['mauve', 'sophisticated', 'muted'], difficulty: 'intermediate', baseColors: ['mauve', 'dusty rose', 'taupe'] },
  'rose': { tags: ['rose', 'romantic', 'soft'], difficulty: 'beginner', baseColors: ['rose', 'pink', 'gold'] },
  'champagne': { tags: ['champagne', 'elegant', 'neutral'], difficulty: 'intermediate', baseColors: ['champagne', 'gold', 'beige'] },
  'burgundy': { tags: ['burgundy', 'deep', 'rich'], difficulty: 'intermediate', baseColors: ['burgundy', 'wine', 'oxblood'] },
};

const TOOLS_DATABASE = [
  'foundation brush', 'beauty sponge', 'concealer brush', 'powder brush', 'blush brush',
  'contour brush', 'highlighter brush', 'eyeshadow brushes', 'blending brush', 'crease brush',
  'packing brush', 'eyeliner brush', 'angled brush', 'fan brush', 'lip brush', 'spoolie',
  'eyelash curler', 'tweezers', 'brow pencil', 'fingertips', 'damp beauty sponge',
  'clean blending brush', 'small eyeshadow brush', 'flat packing brush', 'cut crease brush',
  'precision brushes', 'fluffy eyeshadow brush', 'dense buffing brush'
];

const PRODUCTS_DATABASE = [
  'primer', 'foundation', 'concealer', 'setting powder', 'blush', 'bronzer', 'highlighter',
  'contour palette', 'eyeshadow primer', 'eyeshadow palette', 'eyeliner', 'mascara',
  'false lashes', 'lash glue', 'brow pencil', 'brow gel', 'lip liner', 'lipstick',
  'lip gloss', 'setting spray', 'BB cream', 'tinted moisturizer', 'cream blush',
  'cream contour', 'liquid highlighter', 'eyeshadow', 'kohl', 'brow pomade',
  'lip tint', 'color corrector', 'essence', 'serum', 'moisturizer', 'SPF',
  'oil cleanser', 'water-based cleanser', 'hydrating toner', 'hyaluronic acid'
];

function analyzeDescription(description: string): { keywords: string[]; sentiment: string; complexity: number } {
  const lowerDesc = description.toLowerCase();
  const foundKeywords: string[] = [];
  
  Object.keys(STYLE_KEYWORDS).forEach(keyword => {
    if (lowerDesc.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });
  
  // Determine complexity based on description length and keywords
  const complexity = Math.min(
    3,
    Math.ceil(foundKeywords.length / 2) + (description.length > 100 ? 1 : 0)
  );
  
  // Determine sentiment/intent
  let sentiment = 'natural';
  if (lowerDesc.includes('dramatic') || lowerDesc.includes('bold') || lowerDesc.includes('glam')) {
    sentiment = 'glamorous';
  } else if (lowerDesc.includes('natural') || lowerDesc.includes('soft') || lowerDesc.includes('minimal')) {
    sentiment = 'natural';
  } else if (lowerDesc.includes('creative') || lowerDesc.includes('artistic') || lowerDesc.includes('editorial')) {
    sentiment = 'creative';
  }
  
  return { keywords: foundKeywords, sentiment, complexity };
}

function generateSteps(keywords: string[], difficulty: 'beginner' | 'intermediate' | 'advanced'): MakeupStep[] {
  const baseSteps: MakeupStep[] = [
    {
      id: 'custom-1',
      order: 1,
      title: 'Prep Your Canvas',
      description: 'Start with clean, hydrated skin',
      instruction: 'Cleanse your face and apply moisturizer. Wait 2 minutes for it to absorb before starting makeup.',
      duration: 180,
      targetAreas: ['whole_face'],
      tools: ['hands'],
      products: ['moisturizer', 'primer'],
      tips: ['Primer helps makeup last longer and look smoother']
    },
    {
      id: 'custom-2',
      order: 2,
      title: 'Even Out Skin Tone',
      description: 'Create a flawless base',
      instruction: 'Apply foundation or BB cream with a damp sponge, blending from center of face outward.',
      duration: 180,
      targetAreas: ['whole_face'],
      tools: ['damp beauty sponge'],
      products: ['foundation', 'BB cream'],
      tips: ['Build coverage gradually for natural finish']
    },
    {
      id: 'custom-3',
      order: 3,
      title: 'Brighten and Correct',
      description: 'Conceal imperfections',
      instruction: 'Apply concealer under eyes, around nose, and on any blemishes. Blend with sponge or brush.',
      duration: 120,
      targetAreas: ['under_eyes', 'nose_bridge'],
      tools: ['concealer brush', 'beauty sponge'],
      products: ['concealer'],
      tips: ['Use a shade lighter than foundation for brightening effect']
    }
  ];
  
  // Add eye steps based on difficulty
  const eyeSteps: MakeupStep[] = [];
  
  if (keywords.some(k => ['smokey', 'dramatic', 'bold', 'glam'].includes(k))) {
    eyeSteps.push({
      id: 'custom-eye-1',
      order: 4,
      title: 'Prime the Eyes',
      description: 'Prepare for intense shadow',
      instruction: 'Apply eyeshadow primer all over lid from lash line to brow bone.',
      duration: 60,
      targetAreas: ['eyelids'],
      tools: ['fingertip'],
      products: ['eyeshadow primer'],
      tips: ['Primer prevents creasing and makes colors pop']
    });
    eyeSteps.push({
      id: 'custom-eye-2',
      order: 5,
      title: 'Build the Eye Look',
      description: keywords.some(k => ['smokey', 'dramatic']) ? 'Create depth and drama' : 'Add color and dimension',
      instruction: difficulty === 'advanced' 
        ? 'Apply transition shade in crease, pack color on lid, blend dark shade in outer V, and highlight inner corner.'
        : 'Apply base shadow on lid, blend darker shade in crease, and add shimmer to center.',
      duration: difficulty === 'advanced' ? 300 : 180,
      targetAreas: ['eyelids', 'eyelid_crease'],
      tools: ['eyeshadow brushes', 'blending brush'],
      products: ['eyeshadow palette'],
      tips: ['Blend until no harsh lines remain', 'Build color gradually']
    });
  } else {
    eyeSteps.push({
      id: 'custom-eye-2',
      order: 4,
      title: 'Soft Eye Definition',
      description: 'Enhance eyes naturally',
      instruction: 'Apply a single neutral shadow all over lid and blend into crease. Add subtle liner if desired.',
      duration: 120,
      targetAreas: ['eyelids'],
      tools: ['eyeshadow brush'],
      products: ['neutral eyeshadow', 'eyeliner'],
      tips: ['Keep it simple for everyday wear']
    });
  }
  
  // Add liner and lashes step
  eyeSteps.push({
    id: 'custom-eye-3',
    order: eyeSteps.length + 4,
    title: 'Define and Enhance',
    description: 'Add definition',
    instruction: keywords.some(k => ['dramatic', 'bold', 'glam'].includes(k))
      ? 'Apply winged liner and add false lashes for drama.'
      : 'Line upper lash line subtly and curl lashes. Apply mascara.',
    duration: 180,
    targetAreas: ['eyelids'],
    tools: ['eyeliner', 'eyelash curler', 'mascara wand'],
    products: ['eyeliner', 'mascara', ...(keywords.some(k => ['dramatic', 'bold'].includes(k)) ? ['false lashes'] : [])],
    tips: keywords.some(k => ['dramatic', 'bold'].includes(k)) 
      ? ['False lashes transform the entire look'] 
      : ['Wiggle mascara wand for volume']
  });
  
  // Add face steps
  const faceSteps: MakeupStep[] = [
    {
      id: 'custom-face-1',
      order: eyeSteps.length + 5,
      title: 'Add Dimension',
      description: 'Sculpt the face',
      instruction: difficulty === 'beginner'
        ? 'Apply bronzer to areas where sun naturally hits - forehead, cheeks, and nose.'
        : 'Contour under cheekbones, along jawline, and sides of nose. Blend thoroughly.',
      duration: 120,
      targetAreas: ['cheekbones', 'jawline', 'forehead'],
      tools: ['contour brush'],
      products: [difficulty === 'beginner' ? 'bronzer' : 'contour palette'],
      tips: ['Blend until no harsh lines', 'Less is more - build gradually']
    },
    {
      id: 'custom-face-2',
      order: eyeSteps.length + 6,
      title: 'Rosy Glow',
      description: 'Add healthy flush',
      instruction: 'Smile and apply blush to apples of cheeks, blending upward toward temples.',
      duration: 60,
      targetAreas: ['cheeks'],
      tools: ['blush brush'],
      products: ['blush'],
      tips: ['Choose a shade that matches your natural flush']
    },
    {
      id: 'custom-face-3',
      order: eyeSteps.length + 7,
      title: 'Radiant Highlight',
      description: 'Add glow',
      instruction: 'Apply highlighter to high points of face - cheekbones, nose bridge, cupid\'s bow, and inner eye corners.',
      duration: 90,
      targetAreas: ['cheekbones', 'nose_bridge', 'philtrum'],
      tools: ['highlighter brush'],
      products: ['highlighter'],
      tips: ['Build gradually for natural glow', 'Cream highlighter for dewy finish']
    }
  ];
  
  // Add brow step
  const browStep: MakeupStep = {
    id: 'custom-brow',
    order: eyeSteps.length + 8,
    title: 'Frame the Face',
    description: 'Define brows',
    instruction: 'Fill in sparse areas of brows with feathery strokes and set with gel.',
    duration: 90,
    targetAreas: ['eyebrows'],
    tools: ['brow pencil', 'spoolie'],
    products: ['brow pencil', 'brow gel'],
    tips: ['Follow your natural brow shape', 'Brush hairs upward for fluffy look']
  };
  
  // Add lip step
  const lipStep: MakeupStep = {
    id: 'custom-lip',
    order: eyeSteps.length + 9,
    title: 'Perfect Pout',
    description: 'Complete the look',
    instruction: keywords.some(k => ['bold', 'dramatic'].includes(k))
      ? 'Line lips and fill with bold lipstick. Blot and apply second layer for longevity.'
      : 'Apply lip tint or lipstick, blot, and add gloss for dimension.',
    duration: 90,
    targetAreas: ['lips', 'lip_line'],
    tools: ['lip brush'],
    products: ['lip liner', 'lipstick', 'lip gloss'],
    tips: keywords.some(k => ['bold', 'dramatic'].includes(k))
      ? ['Use concealer to clean up edges']
      : ['Choose a shade that complements your eye look']
  };
  
  // Add finishing step
  const finishStep: MakeupStep = {
    id: 'custom-finish',
    order: eyeSteps.length + 10,
    title: 'Set and Finish',
    description: 'Make it last',
    instruction: 'Set makeup with setting powder where needed and mist with setting spray.',
    duration: 60,
    targetAreas: ['whole_face'],
    tools: ['powder brush', 'setting spray bottle'],
    products: ['setting powder', 'setting spray'],
    tips: ['Hold spray 8-10 inches from face', 'Close eyes while spraying']
  };
  
  return [...baseSteps, ...eyeSteps, ...faceSteps, browStep, lipStep, finishStep];
}

// Groq API implementation
async function generateWithGroq(description: string): Promise<MakeupStyle> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a professional makeup artist AI. Generate a makeup tutorial based on the user's description. Respond with a JSON object containing: styleName, description, difficulty (beginner/intermediate/advanced), estimatedDuration, colorPalette (primary, secondary, accent hex codes), steps (array with title, description, instruction, duration in seconds, targetAreas, tools, products, tips), and generalTips (array of strings).`
        },
        {
          role: 'user',
          content: description
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }
  
  const data = await response.json();
  const analysis = JSON.parse(data.choices[0].message.content) as AIMakeupAnalysis;
  
  return {
    id: `custom-${Date.now()}`,
    name: analysis.styleName,
    description: analysis.description,
    difficulty: analysis.difficulty,
    duration: analysis.estimatedDuration,
    tags: ['custom', 'ai-generated'],
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop',
    accentColor: analysis.colorPalette.primary,
    steps: analysis.steps.map((step, index) => ({
      ...step,
      id: `custom-step-${index}`,
      order: index + 1
    }))
  };
}

// OpenRouter API implementation (fallback)
async function generateWithOpenRouter(description: string): Promise<MakeupStyle> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://makeup-mastery-fjf344mer-scars-projects-703c493a.vercel.app',
      'X-Title': 'Makeup Mastery AI'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-70b-instruct:free',
      messages: [
        {
          role: 'system',
          content: `You are a professional makeup artist AI. Generate a makeup tutorial based on the user's description. Respond with a JSON object containing: styleName, description, difficulty (beginner/intermediate/advanced), estimatedDuration, colorPalette (primary, secondary, accent hex codes), steps (array with title, description, instruction, duration in seconds, targetAreas, tools, products, tips), and generalTips (array of strings).`
        },
        {
          role: 'user',
          content: description
        }
      ],
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }
  
  const data = await response.json();
  const analysis = JSON.parse(data.choices[0].message.content) as AIMakeupAnalysis;
  
  return {
    id: `custom-${Date.now()}`,
    name: analysis.styleName,
    description: analysis.description,
    difficulty: analysis.difficulty,
    duration: analysis.estimatedDuration,
    tags: ['custom', 'ai-generated', 'openrouter'],
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop',
    accentColor: analysis.colorPalette.primary,
    steps: analysis.steps.map((step, index) => ({
      ...step,
      id: `custom-step-${index}`,
      order: index + 1
    }))
  };
}

// Local AI logic (final fallback)
function generateLocalMakeupStyle(description: string): MakeupStyle {
  const { keywords, complexity } = analyzeDescription(description);
  
  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  if (complexity >= 3) difficulty = 'advanced';
  else if (complexity === 2) difficulty = 'intermediate';
  
  // Collect all relevant tags and colors
  const allTags = new Set<string>(['custom', 'ai-generated']);
  const allColors: string[] = [];
  
  keywords.forEach(keyword => {
    const style = STYLE_KEYWORDS[keyword];
    if (style) {
      style.tags.forEach(tag => allTags.add(tag));
      allColors.push(...style.baseColors);
    }
  });
  
  // Generate style name
  const mainKeywords = keywords.slice(0, 2).map(k => k.charAt(0).toUpperCase() + k.slice(1));
  const styleName = mainKeywords.length > 0 
    ? `${mainKeywords.join(' ')} Look`
    : 'Custom Beauty Look';
  
  // Generate description
  const generatedDescription = `A ${difficulty}-level makeup look featuring ${keywords.slice(0, 3).join(', ')} tones. Perfect for ${allTags.has('evening') ? 'special occasions' : 'everyday wear'} with a focus on ${keywords[0] || 'natural'} beauty.`;
  
  // Select accent color
  const accentColor = allColors[0] ? 
    allColors[0].replace('pink', '#fda4af')
      .replace('rose', '#fb7185')
      .replace('gold', '#facc15')
      .replace('champagne', '#f3e5ab')
      .replace('burgundy', '#800020')
      .replace('peach', '#ffdab9')
      .replace('coral', '#ff7f50')
      .replace('mauve', '#e0b0ff')
      .replace('nude', '#d4a5a5')
      .replace('black', '#1a1a1a')
      .replace('grey', '#808080')
      .replace('silver', '#c0c0c0')
    : '#fda4af';
  
  const steps = generateSteps(keywords, difficulty);
  
  // Calculate estimated duration
  const totalMinutes = Math.ceil(steps.reduce((acc, step) => acc + step.duration, 0) / 60);
  
  return {
    id: `custom-${Date.now()}`,
    name: styleName,
    description: generatedDescription,
    difficulty,
    duration: `${totalMinutes} min`,
    tags: Array.from(allTags),
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop',
    accentColor,
    steps
  };
}

// Main function with secure API route
export async function generateCustomMakeupStyle(prompt: string): Promise<MakeupStyle | null> {
  try {
    // Use secure API route
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: prompt }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.result;

    // Convert API response to MakeupStyle format
    return {
      id: `custom-${Date.now()}`,
      name: result.name || prompt.charAt(0).toUpperCase() + prompt.slice(1),
      description: result.description || `A ${result.difficulty}-level makeup look`,
      difficulty: result.difficulty || 'beginner',
      duration: `${result.duration || 20} min`,
      tags: result.tags || [prompt.toLowerCase()],
      imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop',
      accentColor: result.baseColors?.[0] || 'pink',
      steps: generateSteps(result.tags || [], result.difficulty || 'beginner')
    };
  } catch (error) {
    console.warn('API failed, using local AI fallback:', error);
    // Final fallback to local logic
    return generateLocalMakeupStyle(prompt);
  }
}

export async function generateCoachingTip(
  step: MakeupStep,
  userProgress: number,
  context?: string
): Promise<string> {
  if (GROQ_API_KEY) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly, encouraging makeup coach. Give brief, helpful, warm advice like "Okay love, now gently blend that shadow in small circular motions... perfect!". Keep responses under 2 sentences. Be encouraging and warm.'
            },
            {
              role: 'user',
              content: `Step: ${step.title}. Description: ${step.description}. Context: ${context || 'User is working on this step'}. Progress: ${userProgress}%`
            }
          ],
          temperature: 0.8,
          max_tokens: 100
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (error) {
      console.warn('Groq API failed for coaching tip:', error);
    }
  }
  
  // Fallback coaching tips
  const encouragingPhrases = [
    "You're doing beautifully!",
    "That looks lovely!",
    "Perfect, just like that!",
    "You're getting the hang of this!",
    "Wonderful work!",
    "Gorgeous!",
    "So pretty!",
    "Excellent!"
  ];
  
  const tips = step.tips.length > 0 
    ? step.tips[Math.floor(Math.random() * step.tips.length)]
    : 'Take your time and enjoy the process!';
  
  const phrase = encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];
  
  return `${phrase} ${tips}`;
}

export function getCoachingFeedback(
  step: MakeupStep,
  detectedLandmarks?: any
): { type: 'success' | 'warning' | 'tip'; message: string } {
  // This will be expanded in Phase 4 with actual landmark analysis
  return {
    type: 'tip',
    message: step.tips[0] || 'Remember to blend well and take your time!'
  };
}
