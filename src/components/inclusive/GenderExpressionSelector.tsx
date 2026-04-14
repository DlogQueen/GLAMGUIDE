// 🌈 INCLUSIVE GENDER EXPRESSION SYSTEM
// Color-based, non-segregated, welcoming to ALL
// MTF, FTM, Non-binary, Genderfluid, CD, Femboy, Cis - all welcome, no separation

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, Sparkles, Heart, User, ChevronRight,
  Check, Paintbrush, Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 🎨 COLOR-BASED GENDER EXPRESSION
// Not labels - just colors that represent your vibe
export interface GenderExpression {
  id: string;
  color: string;
  gradient: string;
  vibe: string;
  description: string;
  features: string[];
  icon: string;
}

export const EXPRESSION_OPTIONS: GenderExpression[] = [
  {
    id: 'blue-neutral',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    vibe: 'Dude / Neutral',
    description: 'Just here to learn, no specific vibe',
    features: ['Basic tutorials', 'Skincare focus', 'Natural looks'],
    icon: '👤'
  },
  {
    id: 'pink-femme',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-500',
    vibe: 'Chick / Femme',
    description: 'Feminine energy, all the glam',
    features: ['Full glam tutorials', 'Dramatic looks', 'Soft & pretty'],
    icon: '💄'
  },
  {
    id: 'purple-andro',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-fuchsia-500',
    vibe: 'Both / Androgynous',
    description: 'Mix of masc and femme energy',
    features: ['Versatile techniques', 'Play with both', 'Gender-neutral glam'],
    icon: '⚡'
  },
  {
    id: 'blue-pink-gradient',
    color: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    vibe: 'Fluid / Spectrum',
    description: 'Somewhere in between, or both, or changing',
    features: ['Adaptive tutorials', 'Mood-based looks', 'Full flexibility'],
    icon: '🌈'
  },
  {
    id: 'custom-color',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-500',
    vibe: 'Custom / Unique',
    description: 'Pick your own color, define your own vibe',
    features: ['Fully personalized', 'Your rules', 'Custom recommendations'],
    icon: '🎨'
  }
];

// Feature needs - NOT identity based, NEED based
export interface MakeupNeeds {
  beardCoverage: boolean;
  facialFeminization: boolean;
  facialMasculinization: boolean;
  hoodedEyes: boolean;
  deepSetEyes: boolean;
  monolids: boolean;
  prominentBrows: boolean;
  sparseBrows: boolean;
  texturedSkin: boolean;
  acneCoverage: boolean;
}

// Inclusive selector component
export function GenderExpressionSelector({ 
  onSelect,
  selectedId 
}: { 
  onSelect: (expression: GenderExpression, customColor?: string) => void;
  selectedId?: string;
}) {
  const [customColor, setCustomColor] = useState('#ff6b9d');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block p-4 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full mb-4"
        >
          <Palette className="w-8 h-8 text-fuchsia-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          What's Your Vibe?
        </h2>
        <p className="text-white/60 max-w-md mx-auto">
          Pick a color that feels like you. No labels, no boxes - just express yourself.
          <span className="block mt-2 text-sm text-fuchsia-400">
            (Trans women ARE women. Cis women ARE women. We're all just people doing makeup 💖)
          </span>
        </p>
      </div>

      {/* Color Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {EXPRESSION_OPTIONS.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (option.id === 'custom-color') {
                setShowCustomPicker(true);
              } else {
                onSelect(option);
              }
            }}
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
            className={`
              relative p-6 rounded-2xl transition-all duration-300
              ${selectedId === option.id 
                ? 'ring-4 ring-white/50 shadow-2xl' 
                : 'hover:shadow-xl'
              }
            `}
            style={{
              background: option.id === 'blue-pink-gradient' 
                ? 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)'
                : option.color
            }}
          >
            {/* Icon */}
            <div className="text-4xl mb-3">{option.icon}</div>
            
            {/* Label */}
            <p className="font-bold text-white text-sm mb-1">
              {option.vibe}
            </p>
            
            {/* Selected indicator */}
            {selectedId === option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full"
              >
                <Check className="w-4 h-4 text-black" />
              </motion.div>
            )}

            {/* Hover preview */}
            {hoveredOption === option.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full w-48 p-3 bg-black/90 rounded-xl text-xs text-white/80 z-10"
              >
                {option.description}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Custom Color Picker */}
      {showCustomPicker && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10"
        >
          <h3 className="text-lg font-medium text-white mb-4">Pick Your Custom Color</h3>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-20 h-20 rounded-xl cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-white/60 mb-3">Or enter hex code:</p>
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500"
              onClick={() => {
                onSelect(
                  EXPRESSION_OPTIONS.find(o => o.id === 'custom-color')!,
                  customColor
                );
                setShowCustomPicker(false);
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Use This Color
            </Button>
          </div>
        </motion.div>
      )}

      {/* Makeup Needs Section - NEEDS BASED, NOT IDENTITY BASED */}
      <Card className="p-6 bg-white/5 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-fuchsia-400" />
          What Do You Want Help With?
        </h3>
        <p className="text-white/60 text-sm mb-6">
          Select the techniques you're interested in. 
          <span className="text-fuchsia-400">
            {' '}These are available to EVERYONE - we're all just humans doing makeup!
          </span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'beard', label: 'Beard Shadow Coverage', icon: '🧔', desc: 'Color correcting 5 o\'clock shadow' },
            { id: 'soften', label: 'Soften Features', icon: '✨', desc: 'Contouring for softer angles' },
            { id: 'brows', label: 'Brow Transformation', icon: '✏️', desc: 'Thick to arched or vice versa' },
            { id: 'glam', label: 'Full Glam', icon: '💋', desc: 'Dramatic evening looks' },
            { id: 'natural', label: 'No-Makeup Makeup', icon: '🌸', desc: 'Subtle enhancement' },
            { id: 'eyes', label: 'Eye Techniques', icon: '👁️', desc: 'Hooded, monolid, deep-set' },
            { id: 'skin', label: 'Skin Texture', icon: '🧴', desc: 'Full coverage foundation' },
            { id: 'lips', label: 'Lip Techniques', icon: '💄', desc: 'Overlining, ombre, gloss' },
          ].map((need) => (
            <motion.button
              key={need.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-fuchsia-500/30 text-left transition-all"
            >
              <span className="text-2xl mb-2 block">{need.icon}</span>
              <p className="font-medium text-white text-sm">{need.label}</p>
              <p className="text-xs text-white/50 mt-1">{need.desc}</p>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Inclusive Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-white/40">
          💖 Whether you're trans, cis, non-binary, exploring, or just curious - 
          <span className="text-fuchsia-400"> you're welcome here.</span>
        </p>
      </div>
    </div>
  );
}

// Specialized Makeup Tools - Available to ANYONE who needs them
export function SpecializedMakeupTools() {
  const tools = [
    {
      id: 'beard-coverage',
      title: 'Beard Shadow Coverage',
      icon: '🧔',
      color: '#f59e0b',
      description: 'Color correct blue/gray tones with peach/orange concealer',
      steps: [
        'Apply orange/peach color corrector to beard area',
        'Pat, don\'t rub - let it sit 30 seconds',
        'Apply full coverage foundation over top',
        'Set with powder for all-day wear'
      ],
      products: ['Orange/Peach Color Corrector', 'Full Coverage Foundation', 'Setting Powder'],
      forWho: 'Anyone with facial hair shadow to cover'
    },
    {
      id: 'facial-feminization',
      title: 'Facial Feminization Contour',
      icon: '✨',
      color: '#ec4899',
      description: 'Soften jawline, lift cheeks, shorten forehead',
      steps: [
        'Contour jawline with soft line (blend down, not up)',
        'Highlight center of forehead to shorten appearance',
        'Contour sides of forehead, highlight center',
        'Lift cheekbones with highlighter at top of cheek'
      ],
      products: ['Cream Contour', 'Concealer (2 shades lighter)', 'Blending Sponge'],
      forWho: 'Anyone wanting softer, more lifted features'
    },
    {
      id: 'brow-transformation',
      title: 'Brow Transformation',
      icon: '✏️',
      color: '#8b5cf6',
      description: 'Go from thick/flat to arched, or vice versa',
      steps: [
        'Brush brows up with spoolie',
        'Fill in desired shape with pencil',
        'Conceal outside lines for sharp edges',
        'Set with brow gel'
      ],
      products: ['Brow Pencil', 'Concealer', 'Brow Gel', 'Spoolie'],
      forWho: 'Anyone reshaping their brows'
    },
    {
      id: 'hooded-eyes',
      title: 'Hooded Eye Techniques',
      icon: '👁️',
      color: '#3b82f6',
      description: 'Eyeliner and shadow that works with hooded lids',
      steps: [
        'Apply shadow with eyes OPEN (look straight ahead)',
        'Use matte colors, avoid shimmer on hood',
        'Tightline upper waterline for definition',
        'Wing should go UP at outer corner'
      ],
      products: ['Matte Eyeshadows', 'Gel Eyeliner', 'Crease Brush'],
      forWho: 'Anyone with hooded or deep-set eyes'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-fuchsia-400" />
        <h2 className="text-2xl font-bold text-white">Specialized Techniques</h2>
      </div>
      <p className="text-white/60 mb-6">
        Advanced techniques for specific needs. Available to everyone - 
        <span className="text-fuchsia-400">we don't gatekeep here!</span>
      </p>

      {tools.map((tool) => (
        <Card 
          key={tool.id}
          className="overflow-hidden bg-white/5 border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${tool.color}30` }}
              >
                {tool.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                <p className="text-sm text-white/60">{tool.description}</p>
                <p className="text-xs text-fuchsia-400 mt-1">{tool.forWho}</p>
              </div>
              <Button variant="outline" size="sm" className="border-white/20 text-white">
                Try It
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Quick Steps Preview */}
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
              {tool.steps.slice(0, 2).map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                  <span className="text-fuchsia-400 font-bold">{i + 1}.</span>
                  <span className="line-clamp-2">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Inclusive Community Guidelines
export function InclusiveCommunityCard() {
  return (
    <Card className="p-6 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-6 h-6 text-fuchsia-400" />
        <h3 className="text-xl font-bold text-white">Our Promise to You</h3>
      </div>

      <div className="space-y-3">
        {[
          { icon: '💖', text: 'Trans women are women. Period.' },
          { icon: '🏳️‍⚧️', text: 'Your identity is valid, whatever it is' },
          { icon: '🚫', text: 'No "trans tutorial" separation - we\'re all just doing makeup' },
          { icon: '🎨', text: 'Use whatever tools you need - no judgment' },
          { icon: '🤝', text: 'Respect everyone\'s journey and expression' },
          { icon: '🔒', text: 'Your privacy and safety come first' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xl">{item.icon}</span>
            <span className="text-white/80">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-sm text-white/60 text-center italic">
          "Makeup has no gender. It's just color on skin. 
          Everyone deserves to feel beautiful."
        </p>
      </div>
    </Card>
  );
}

export default {
  GenderExpressionSelector,
  SpecializedMakeupTools,
  InclusiveCommunityCard,
  EXPRESSION_OPTIONS
};
