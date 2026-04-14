// 🤖 INCLUSIVE MAKEUP AI SERVICE
// Specialized AI for ALL gender expressions and needs
// NOT segregated by identity - just tools for whatever you need

import { supabase } from '@/lib/supabase';

// ============================================
// BEARD SHADOW DETECTION & CORRECTION
// ============================================

export interface BeardAnalysisResult {
  detected: boolean;
  coverage: number; // 0-100
  shadowColor: 'blue-gray' | 'gray' | 'blue' | 'brown' | 'none';
  areas: {
    upperLip: boolean;
    chin: boolean;
    jawline: boolean;
    cheeks: boolean;
  };
  recommendations: {
    correctorColor: string;
    correctorHex: string;
    foundationType: string;
    technique: string;
  };
}

export class BeardCoverageAI {
  
  // Analyze face for beard shadow
  static async analyzeBeardShadow(imageData: ImageData): Promise<BeardAnalysisResult> {
    // In real implementation, this uses TensorFlow.js or API
    // For now, simulated based on image analysis
    
    const mockAnalysis: BeardAnalysisResult = {
      detected: true,
      coverage: 65,
      shadowColor: 'blue-gray',
      areas: {
        upperLip: true,
        chin: true,
        jawline: true,
        cheeks: false
      },
      recommendations: {
        correctorColor: 'peach-orange',
        correctorHex: '#FF8C42',
        foundationType: 'full-coverage-matte',
        technique: 'color-correct-then-conceal'
      }
    };
    
    return mockAnalysis;
  }
  
  // Get step-by-step beard coverage tutorial
  static getBeardCoverageTutorial(analysis: BeardAnalysisResult): {
    steps: string[];
    products: string[];
    tips: string[];
  } {
    const correctorMap: Record<string, { color: string; hex: string }> = {
      'blue-gray': { color: 'Peach-Orange', hex: '#FF8C42' },
      'gray': { color: 'Salmon-Pink', hex: '#FF9999' },
      'blue': { color: 'Orange', hex: '#FF6600' },
      'brown': { color: 'Peach', hex: '#FFCC99' }
    };
    
    const corrector = correctorMap[analysis.shadowColor] || correctorMap['blue-gray'];
    
    return {
      steps: [
        `1. Apply ${corrector.color} color corrector (${corrector.hex}) to beard shadow areas`,
        '2. Pat gently with finger or sponge - do NOT rub',
        '3. Wait 30 seconds for corrector to set',
        '4. Apply full-coverage foundation OVER the corrector',
        '5. Use stippling motion, not swiping',
        '6. Set with translucent powder using pressing motion',
        '7. (Optional) Light mist of setting spray'
      ],
      products: [
        `${corrector.color} Color Corrector (try: LA Girl, NYX, or Charlotte Tilbury)`,
        'Full Coverage Foundation (Estée Lauder Double Wear, Fenty Pro Filt\'r)',
        'Beauty Blender or dense foundation brush',
        'Translucent Setting Powder (RCMA No-Color, Laura Mercier)',
        'Setting Spray (Urban Decay All Nighter)'
      ],
      tips: [
        'Color correctors neutralize - peach/orange cancels blue/gray',
        'Less is more - start with thin layer',
        'Blend down onto neck for seamless transition',
        'If shadow shows through, add another thin layer',
        'Practice color theory: Blue ←→ Orange, Gray ←→ Peach'
      ]
    };
  }
}

// ============================================
// FACIAL FEMINIZATION CONTOURING AI
// ============================================

export interface FacialFeminizationAnalysis {
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'long';
  features: {
    jawlineProminence: number; // 0-100
    foreheadWidth: number;
    cheekboneHeight: number;
    chinPoint: 'rounded' | 'square' | 'pointed';
  };
  recommendations: {
    contourAreas: string[];
    highlightAreas: string[];
    browRecommendation: string;
    lipTechnique: string;
  };
}

export class FacialFeminizationAI {
  
  static async analyzeFaceShape(imageData: ImageData): Promise<FacialFeminizationAnalysis> {
    // Real implementation uses face landmarks
    const mockAnalysis: FacialFeminizationAnalysis = {
      faceShape: 'square',
      features: {
        jawlineProminence: 75,
        foreheadWidth: 60,
        cheekboneHeight: 45,
        chinPoint: 'square'
      },
      recommendations: {
        contourAreas: ['jawline', 'forehead-sides', 'chin'],
        highlightAreas: ['center-forehead', 'under-eyes', 'chin-center'],
        browRecommendation: 'arched-high',
        lipTechnique: 'overline-center'
      }
    };
    
    return mockAnalysis;
  }
  
  static getFeminizationGuide(analysis: FacialFeminizationAnalysis): {
    contourGuide: string[];
    highlightGuide: string[];
    overallTips: string[];
  } {
    const guides: Record<string, { contour: string[]; highlight: string[]; tips: string[] }> = {
      'square': {
        contour: [
          'Contour JAWLINE: Apply along the jaw from ear to chin, BLEND DOWNWARD',
          'Contour FOREHEAD SIDES: Apply at temples, blend toward hairline',
          'Contour CHIN: Apply at bottom corners of chin, blend toward center',
          'Keep contour SOFT - no harsh lines for feminization'
        ],
        highlight: [
          'Highlight CENTER FOREHEAD: Draws attention up, softens width',
          'Highlight UNDER EYES: Brightens and lifts eye area',
          'Highlight CHIN CENTER: Creates pointed appearance',
          'Highlight CHEEKBONES: Apply at TOP of cheekbone, not apple'
        ],
        tips: [
          'Soften all edges - feminine makeup is about gradients, not harsh lines',
          'Brow arch should peak above outer edge of iris',
          'Highlight brings forward, contour pushes back - use strategically',
          'Practice in good lighting from multiple angles',
          'Take progress photos to see improvement over time'
        ]
      },
      'round': {
        contour: [
          'Contour SIDES OF FACE: From temples to jaw, slimming overall width',
          'Contour UNDER CHEEKBONES: Creates shadow, defines bone structure',
          'Contour DOUBLE CHIN AREA: Under jawline, blend down to neck'
        ],
        highlight: [
          'Highlight CENTER OF FACE: Nose bridge, center forehead, chin',
          'Highlight TOP OF CHEEKBONES: Not the apples!',
          'Highlight BROW BONE: Lifts and opens eyes'
        ],
        tips: [
          'Round faces benefit from VERTICAL highlighting',
          'Keep contour below the cheekbone to avoid muddy look',
          'Blend contour INTO hairline and down neck',
          'Matte contour, shimmer highlight for contrast'
        ]
      }
    };
    
    const guide = guides[analysis.faceShape] || guides['square'];
    
    return {
      contourGuide: guide.contour,
      highlightGuide: guide.highlight,
      overallTips: guide.tips
    };
  }
}

// ============================================
// BROW TRANSFORMATION AI
// ============================================

export interface BrowAnalysis {
  currentShape: 'thick-flat' | 'sparse' | 'arched' | 'rounded' | 'uneven';
  desiredShape: 'arched-high' | 'soft-arched' | 'straight' | 'rounded';
  thickness: 'thick' | 'medium' | 'thin';
  recommendations: {
    removalMethod: 'pluck' | 'wax' | 'thread' | 'shave' | 'none';
    fillTechnique: string;
    products: string[];
    growthTips?: string[];
  };
}

export class BrowTransformationAI {
  
  static async analyzeBrows(imageData: ImageData): Promise<BrowAnalysis> {
    const mockAnalysis: BrowAnalysis = {
      currentShape: 'thick-flat',
      desiredShape: 'arched-high',
      thickness: 'thick',
      recommendations: {
        removalMethod: 'pluck',
        fillTechnique: 'feather-stroke',
        products: [
          'Brow pencil (2 shades lighter than hair for MTF transition)',
          'Concealer for sharp edges',
          'Brow gel to set',
          'Spoolie brush'
        ],
        growthTips: [
          'Castor oil nightly for sparse areas',
          'Biotin supplements',
          'Avoid over-plucking during transition'
        ]
      }
    };
    
    return mockAnalysis;
  }
  
  static getBrowTutorial(analysis: BrowAnalysis): {
    mappingSteps: string[];
    fillingSteps: string[];
    shapingSteps: string[];
  } {
    return {
      mappingSteps: [
        'STEP 1: Find BROW START - Hold pencil vertically at edge of nose',
        'STEP 2: Find ARCH - Pencil from nose through center of pupil',
        'STEP 3: Find TAIL - Pencil from nose to outer corner of eye',
        'STEP 4: Mark these three points with small dots'
      ],
      fillingSteps: [
        'Use feathery strokes in direction of hair growth',
        'Fill from bottom line UPWARD for natural look',
        'Use lighter shade at inner brow, darker at tail',
        'Conceal outside your mapped lines for sharp edges',
        'Blend with spoolie - brush UP then lay flat'
      ],
      shapingSteps: [
        'Only remove hairs OUTSIDE your mapped points',
        'For thick to thin: Remove from BOTTOM of brow, not top',
        'For flat to arched: Remove hairs under the arch point',
        'Tweeze after shower when pores are open',
        'Ice after to reduce redness'
      ]
    };
  }
}

// ============================================
// INCLUSIVE TUTORIAL RECOMMENDATIONS
// ============================================

export class InclusiveTutorialAI {
  
  // Get tutorials based on NEEDS, not identity
  static async getPersonalizedTutorials(userNeeds: {
    beardCoverage?: boolean;
    facialFeminization?: boolean;
    hoodedEyes?: boolean;
    beginner?: boolean;
    desiredVibe?: string;
  }): Promise<Array<{
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: string;
    forNeeds: string[];
    thumbnail: string;
  }>> {
    
    const tutorials = [
      {
        id: 'beard-coverage-101',
        title: 'Beard Shadow? No Problem',
        description: 'Complete guide to color correcting and covering facial hair shadow',
        duration: 15,
        difficulty: 'beginner',
        forNeeds: ['beardCoverage'],
        thumbnail: '/tutorials/beard-coverage.jpg'
      },
      {
        id: 'feminization-contour',
        title: 'Softening Angles with Contour',
        description: 'Facial contouring techniques for a softer, lifted appearance',
        duration: 20,
        difficulty: 'intermediate',
        forNeeds: ['facialFeminization'],
        thumbnail: '/tutorials/feminization.jpg'
      },
      {
        id: 'brow-transformation',
        title: 'Brow Transformation Masterclass',
        description: 'From thick and flat to arched and feminine (works both ways!)',
        duration: 12,
        difficulty: 'beginner',
        forNeeds: ['facialFeminization', 'beginner'],
        thumbnail: '/tutorials/brows.jpg'
      },
      {
        id: 'hooded-eyes-glam',
        title: 'Hooded Eye Makeup That WORKS',
        description: 'Techniques specifically for hooded or deep-set eyes',
        duration: 18,
        difficulty: 'intermediate',
        forNeeds: ['hoodedEyes'],
        thumbnail: '/tutorials/hooded-eyes.jpg'
      },
      {
        id: 'everyday-natural',
        title: 'Natural Everyday Look',
        description: 'Subtle enhancement for any gender expression',
        duration: 10,
        difficulty: 'beginner',
        forNeeds: ['beginner'],
        thumbnail: '/tutorials/natural.jpg'
      },
      {
        id: 'full-glam-transformation',
        title: 'Full Glam Transformation',
        description: 'Dramatic evening look - go BIG or go home',
        duration: 45,
        difficulty: 'advanced',
        forNeeds: ['facialFeminization', 'beardCoverage'],
        thumbnail: '/tutorials/full-glam.jpg'
      }
    ];
    
    // Filter based on user needs
    return tutorials.filter(tutorial => {
      return tutorial.forNeeds.some(need => 
        userNeeds[need as keyof typeof userNeeds]
      ) || tutorial.forNeeds.includes('beginner');
    });
  }
}

// ============================================
// SAFE SPACE & COMMUNITY FEATURES
// ============================================

export interface SafeSpaceConfig {
  privacyLevel: 'public' | 'friends' | 'private';
  showInDiscovery: boolean;
  allowComments: boolean;
  allowSharing: boolean;
  anonymousMode: boolean;
  blurFaceInPublic: boolean;
}

export class SafeSpaceManager {
  
  static async saveSafeSpaceSettings(
    userId: string, 
    config: SafeSpaceConfig
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: userId,
          ...config,
          updated_at: new Date().toISOString()
        });
      
      return !error;
    } catch {
      return false;
    }
  }
  
  // Get default inclusive settings
  static getDefaultSafeSpaceConfig(): SafeSpaceConfig {
    return {
      privacyLevel: 'friends', // Default to friends only for safety
      showInDiscovery: false,
      allowComments: true,
      allowSharing: false,
      anonymousMode: false,
      blurFaceInPublic: true // Auto-blur face in public feed
    };
  }
  
  // Content warnings and filters
  static getContentFilters(): {
    id: string;
    label: string;
    description: string;
  }[] {
    return [
      {
        id: 'beard-coverage',
        label: 'Beard Coverage Content',
        description: 'Show tutorials about covering facial hair'
      },
      {
        id: 'facial-feminization',
        label: 'Facial Contouring',
        description: 'Show feminization/masculinization techniques'
      },
      {
        id: 'brow-transformation',
        label: 'Brow Reshaping',
        description: 'Show brow transformation tutorials'
      },
      {
        id: 'full-glam',
        label: 'Full Glam/Dramatic',
        description: 'Show dramatic transformation content'
      }
    ];
  }
}

// ============================================
// EXPORT ALL
// ============================================

export const InclusiveMakeupAI = {
  BeardCoverageAI,
  FacialFeminizationAI,
  BrowTransformationAI,
  InclusiveTutorialAI,
  SafeSpaceManager
};

export default InclusiveMakeupAI;
