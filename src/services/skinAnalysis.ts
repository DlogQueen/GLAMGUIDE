"use client";

export interface SkinAnalysis {
  tone: 'fair' | 'light' | 'medium' | 'tan' | 'deep' | 'dark';
  undertone: 'warm' | 'cool' | 'neutral';
  type: 'dry' | 'oily' | 'combination' | 'normal';
  concerns: string[];
  foundationMatch: string;
  recommendedColors: string[];
}

export async function analyzeSkinFromImage(imageData: string): Promise<SkinAnalysis> {
  // Mock AI skin analysis - in production, this would use ML model
  // Analyzing pixel data for skin tone detection
  
  const skinTones: SkinAnalysis['tone'][] = ['fair', 'light', 'medium', 'tan', 'deep', 'dark'];
  const undertones: SkinAnalysis['undertone'][] = ['warm', 'cool', 'neutral'];
  const skinTypes: SkinAnalysis['type'][] = ['dry', 'oily', 'combination', 'normal'];
  
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Random but consistent analysis based on image hash
  const imageHash = imageData.length % 6;
  const tone = skinTones[imageHash] || 'medium';
  const undertone = undertones[imageHash % 3] || 'neutral';
  
  return {
    tone,
    undertone,
    type: skinTypes[Math.floor(Math.random() * 4)],
    concerns: ['fine lines', 'uneven texture'], // Would be detected by AI
    foundationMatch: getFoundationMatch(tone, undertone),
    recommendedColors: getRecommendedColors(undertone),
  };
}

function getFoundationMatch(tone: string, undertone: string): string {
  const matches: Record<string, string> = {
    'fair-warm': 'NC15-NC20 (MAC) / 1N-2N (Fenty)',
    'fair-cool': 'NW10-NW15 (MAC) / 100-110 (Fenty)',
    'light-warm': 'NC20-NC25 (MAC) / 2N-3N (Fenty)',
    'light-cool': 'NW15-NW20 (MAC) / 120-130 (Fenty)',
    'medium-warm': 'NC30-NC40 (MAC) / 4N-6N (Fenty)',
    'medium-cool': 'NW25-NW35 (MAC) / 200-230 (Fenty)',
    'tan-warm': 'NC42-NC44 (MAC) / 7N-8N (Fenty)',
    'tan-cool': 'NW40-NW43 (MAC) / 300-330 (Fenty)',
    'deep-warm': 'NC45-NC50 (MAC) / 9N-10N (Fenty)',
    'deep-cool': 'NW45-NW48 (MAC) / 370-390 (Fenty)',
    'dark-warm': 'NC55+ (MAC) / 11N+ (Fenty)',
    'dark-cool': 'NW50+ (MAC) / 490+ (Fenty)',
  };
  return matches[`${tone}-${undertone}`] || 'Consult beauty advisor';
}

function getRecommendedColors(undertone: string): string[] {
  const colors: Record<string, string[]> = {
    warm: ['Coral', 'Peach', 'Gold', 'Bronze', 'Warm Brown', 'Orange-Red'],
    cool: ['Berry', 'Plum', 'Silver', 'Rose Gold', 'Cool Brown', 'Blue-Red'],
    neutral: ['Rose', 'Mauve', 'Champagne', 'Taupe', 'Soft Pink', 'True Red'],
  };
  return colors[undertone] || colors.neutral;
}

export function getSkinCareRecommendations(skinType: string): string[] {
  const recommendations: Record<string, string[]> = {
    dry: ['Hydrating serum', 'Rich moisturizer', 'Gentle cleanser', 'Facial oil'],
    oily: ['Salicylic acid', 'Oil-free moisturizer', 'Clay mask', 'Mattifying primer'],
    combination: ['Balancing toner', 'Lightweight moisturizer', 'Spot treatment', 'Gentle exfoliant'],
    normal: ['Antioxidant serum', 'Daily SPF', 'Gentle cleanser', 'Night cream'],
  };
  return recommendations[skinType] || recommendations.normal;
}

export function getMakeupRecommendations(tone: string, undertone: string) {
  const base = {
    foundation: getFoundationMatch(tone, undertone),
    concealer: `${undertone === 'warm' ? 'Peach' : undertone === 'cool' ? 'Pink' : 'Neutral'} undertone`,
    blush: undertone === 'warm' ? 'Coral/Peach' : undertone === 'cool' ? 'Berry/Pink' : 'Rose/Mauve',
    lipstick: undertone === 'warm' ? 'Orange-red, Coral' : undertone === 'cool' ? 'Blue-red, Berry' : 'True red, Rose',
    eyeshadow: undertone === 'warm' ? 'Gold, Bronze, Copper' : undertone === 'cool' ? 'Silver, Purple, Blue' : 'Champagne, Taupe, Rose',
  };
  return base;
}
