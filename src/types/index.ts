export interface MakeupStyle {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  tags: string[];
  imageUrl: string;
  accentColor: string;
  steps: MakeupStep[];
  videoUrl?: string;
}

export interface ProductRecommendation {
  name: string;
  link: string;
  price: string;
  brand?: string;
}

export interface SkinToneVariations {
  fair?: string;
  light?: string;
  medium?: string;
  tan?: string;
  deep?: string;
  dark?: string;
  oily?: string;
  dry?: string;
}

export interface MakeupStep {
  id: string;
  order: number;
  title: string;
  description: string;
  instruction: string;
  duration: number; // in seconds
  targetAreas: readonly FacialArea[];
  tools: readonly string[];
  products: readonly string[] | readonly ProductRecommendation[];
  tips: readonly string[];
  visualOverlay?: VisualOverlay;
  proTip?: string;
  commonMistakes?: readonly string[];
  skinToneVariations?: SkinToneVariations;
  videoUrl?: string;
}

export interface VisualOverlay {
  type: 'highlight' | 'arrow' | 'zone' | 'text';
  position: { x: number; y: number };
  color: string;
  animation?: string;
  message?: string;
}

export type FacialArea = 
  | 'forehead'
  | 'eyebrows'
  | 'eyelids'
  | 'eyelid_crease'
  | 'under_eyes'
  | 'cheekbones'
  | 'cheeks'
  | 'nose_bridge'
  | 'nose_tip'
  | 'philtrum'
  | 'lips'
  | 'lip_line'
  | 'chin'
  | 'jawline'
  | 'temples'
  | 'whole_face';

export interface CoachingFeedback {
  type: 'success' | 'warning' | 'tip' | 'correction';
  message: string;
  area?: FacialArea;
  action?: string;
}

export interface AIMakeupAnalysis {
  styleName: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  steps: MakeupStep[];
  tips: string[];
}

export interface UserSession {
  id: string;
  style: MakeupStyle;
  currentStep: number;
  startTime: Date;
  progress: number;
  feedbackHistory: CoachingFeedback[];
}

export interface FacialLandmark {
  x: number;
  y: number;
  z: number;
  name?: string;
}

export interface FacialFeatures {
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong';
  eyeShape: 'almond' | 'round' | 'hooded' | 'monolid' | 'upturned' | 'downturned';
  eyeDistance: 'close' | 'average' | 'wide';
  eyebrowShape: 'arched' | 'straight' | 'rounded' | 'angular';
  noseWidth: 'narrow' | 'average' | 'wide';
  lipFullness: 'thin' | 'average' | 'full';
  cheekboneHeight: 'low' | 'medium' | 'high';
  skinTone: 'fair' | 'light' | 'medium' | 'tan' | 'deep';
}
