// 🌟 EARLY ADOPTER / FOUNDING MEMBER PROGRAM
// Special verification for users who join in the first month
// + Secret gift system for top referrers

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Star, Sparkles, Gift, Lock, Gem, Heart,
  Zap, Trophy, Users, Clock, CheckCircle2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 🎀 USER'S SPECIAL BADGE - [FILL IN YOUR CUTE NAME]
const SPECIAL_BADGE_NAME = 'YOUR_CUTE_NAME_HERE'; // 🎀 FILL THIS IN!

interface FoundingMember {
  userId: string;
  username: string;
  joinedAt: string;
  badge: 'founding-member' | 'special-tier-1' | 'special-tier-2' | 'special-tier-3';
  referralsCount: number;
  secretGiftUnlocked: boolean;
  secretGiftClaimed: boolean;
  exclusiveFeatures: string[];
}

// Early Adopter Tiers (1-5 referrals in first month)
const EARLY_ADOPTER_TIERS = [
  {
    id: 'special-tier-1',
    name: '🌸 Blossom Member', // Placeholder - user will rename
    referralsRequired: 1,
    color: '#f472b6',
    icon: '🌸',
    benefits: [
      'Exclusive "Blossom" badge on profile',
      'Early access to new features',
      'Priority customer support',
      'Secret gift unlocked (claim at 5 referrals)'
    ]
  },
  {
    id: 'special-tier-2',
    name: '✨ Sparkle Member', // Placeholder
    referralsRequired: 3,
    color: '#a855f7',
    icon: '✨',
    benefits: [
      'Everything from Blossom tier',
      'Exclusive AR filters (founding member only)',
      'Monthly surprise product recommendations',
      'VIP Discord channel access',
      'Secret gift unlocked (claim at 5 referrals)'
    ]
  },
  {
    id: 'special-tier-3',
    name: '💎 [YOUR_CUTE_NAME_HERE]', // 🎀 USER FILLS THIS IN!
    referralsRequired: 5,
    color: '#ec4899',
    icon: '💎',
    benefits: [
      'Everything from Sparkle tier',
      'PERMANENT "[YOUR_NAME]" badge',
      'Lifetime premium features',
      'Direct line to founders',
      '🎁 SECRET MYSTERY GIFT (physical or digital)',
      'Name in app credits as "Founding Creator"',
      'Exclusive merchandise early access'
    ]
  }
];

// Founding Member Banner
export function FoundingMemberBanner({ 
  daysLeft = 30,
  userTier = null 
}: { 
  daysLeft?: number;
  userTier?: typeof EARLY_ADOPTER_TIERS[0] | null;
}) {
  const [expanded, setExpanded] = useState(true);
  
  if (!expanded) return (
    <button 
      onClick={() => setExpanded(true)}
      className="fixed top-20 right-4 z-40 p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transition-all"
    >
      <Crown className="w-5 h-5 text-white" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full text-xs flex items-center justify-center text-black font-bold">
        {daysLeft}
      </span>
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-600 text-white p-4 overflow-hidden"
    >
      {/* Sparkle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            animate={{
              y: [-20, 100],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: -20
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Crown className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg">
              🌟 Founding Member Program 🌟
            </h3>
            <p className="text-sm text-white/90">
              {daysLeft} days left to become an exclusive founding member!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userTier ? (
            <div 
              className="px-4 py-2 rounded-full text-sm font-bold"
              style={{ backgroundColor: `${userTier.color}40`, border: `2px solid ${userTier.color}` }}
            >
              {userTier.icon} {userTier.name}
            </div>
          ) : (
            <Button 
              className="bg-white text-purple-600 hover:bg-white/90 font-bold"
              onClick={() => {}}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Join Program
            </Button>
          )}
          <button 
            onClick={() => setExpanded(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tiers Preview */}
      <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-white/20">
        <div className="flex flex-wrap gap-4 text-xs text-white/80">
          <span className="flex items-center gap-1">
            <span className="text-lg">🌸</span> 1 friend = Blossom
          </span>
          <span className="flex items-center gap-1">
            <span className="text-lg">✨</span> 3 friends = Sparkle
          </span>
          <span className="flex items-center gap-1">
            <span className="text-lg">💎</span> 5 friends = {SPECIAL_BADGE_NAME}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Early Adopter Tiers Card
export function EarlyAdopterTiers({ 
  currentReferrals = 0,
  isFirstMonth = true 
}: { 
  currentReferrals?: number;
  isFirstMonth?: boolean;
}) {
  const [selectedTier, setSelectedTier] = useState<typeof EARLY_ADOPTER_TIERS[0] | null>(null);

  if (!isFirstMonth) {
    return (
      <Card className="p-6 bg-white/5 border-white/10 text-center">
        <Lock className="w-12 h-12 mx-auto mb-3 text-white/30" />
        <h3 className="text-lg font-medium text-white/60">
          Founding Member program has ended
        </h3>
        <p className="text-sm text-white/40 mt-1">
          But you can still earn rewards through our regular referral program!
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-fuchsia-500/10 border-pink-500/30">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Gem className="w-6 h-6 text-pink-400" />
                Founding Member Tiers
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Limited time! Refer friends in your first month to unlock exclusive status
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Your Progress</p>
              <p className="text-2xl font-bold text-pink-400">
                {currentReferrals} <span className="text-sm text-white/40">/ 5</span>
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (currentReferrals / 5) * 100)}%` }}
            />
          </div>
        </div>

        {/* Tiers */}
        <div className="p-6 space-y-4">
          {EARLY_ADOPTER_TIERS.map((tier, index) => {
            const isUnlocked = currentReferrals >= tier.referralsRequired;
            const isNext = !isUnlocked && 
                          (index === 0 || currentReferrals >= EARLY_ADOPTER_TIERS[index - 1].referralsRequired);

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedTier(tier)}
                className={`
                  relative p-4 rounded-xl cursor-pointer transition-all
                  ${isUnlocked 
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/50' 
                    : isNext 
                      ? 'bg-white/5 border border-white/20 hover:border-pink-500/50' 
                      : 'bg-white/5 opacity-50'
                  }
                `}
              >
                {isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <div className="p-1 bg-green-500 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${tier.color}30` }}
                  >
                    {tier.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-white" style={{ color: isUnlocked ? tier.color : undefined }}>
                      {tier.name}
                    </h4>
                    <p className="text-sm text-white/60">
                      Refer {tier.referralsRequired} friend{tier.referralsRequired > 1 ? 's' : ''}
                    </p>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tier.benefits.slice(0, 2).map((benefit, i) => (
                        <span 
                          key={i}
                          className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70"
                        >
                          {benefit}
                        </span>
                      ))}
                      {tier.benefits.length > 2 && (
                        <span className="text-xs px-2 py-1 text-white/50">
                          +{tier.benefits.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secret Gift Teaser for Tier 3 */}
                {tier.id === 'special-tier-3' && isUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30"
                  >
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">
                        🎁 SECRET GIFT UNLOCKED!
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      Shh... it's a surprise! Claim your mystery gift now.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Tier Detail Modal */}
      <AnimatePresence>
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTier(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a0a2e] rounded-2xl max-w-md w-full p-6 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div 
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-3"
                  style={{ backgroundColor: `${selectedTier.color}30` }}
                >
                  {selectedTier.icon}
                </div>
                <h3 className="text-2xl font-bold" style={{ color: selectedTier.color }}>
                  {selectedTier.name}
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  Refer {selectedTier.referralsRequired} friend{selectedTier.referralsRequired > 1 ? 's' : ''} to unlock
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-white/80 mb-2">Exclusive Benefits:</p>
                {selectedTier.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Secret Gift Special Note */}
              {selectedTier.id === 'special-tier-3' && (
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-pink-400" />
                    <span className="font-bold text-pink-400">About the Secret Gift...</span>
                  </div>
                  <p className="text-sm text-white/70">
                    We can't tell you what it is yet (that would ruin the surprise!), but we promise 
                    it's something special that only our {SPECIAL_BADGE_NAME} members will ever receive. 
                    Think limited edition, exclusive, and absolutely fabulous! 💝
                  </p>
                </div>
              )}

              <Button 
                className="w-full mt-6"
                style={{ 
                  backgroundColor: selectedTier.color,
                  color: 'white'
                }}
                onClick={() => setSelectedTier(null)}
              >
                <Zap className="w-4 h-4 mr-2" />
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Secret Gift Claim Component
export function SecretGiftClaim({ isUnlocked = false }: { isUnlocked?: boolean }) {
  const [claimed, setClaimed] = useState(false);
  const [revealing, setRevealing] = useState(false);

  if (!isUnlocked) return null;
  if (claimed) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-3"
          >
            🎉
          </motion.div>
          <h3 className="text-xl font-bold text-green-400">Gift Claimed!</h3>
          <p className="text-white/70 mt-2">
            Your secret gift is on its way! Check your email for details.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-fuchsia-500/20 border-pink-500/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            animate={{
              y: [0, -100],
              rotate: [0, 360],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4,
              delay: i * 0.4,
              repeat: Infinity
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -50
            }}
          >
            {['✨', '🎁', '💎', '💖', '🌟'][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🎁
        </motion.div>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          🎀 MYSTERY GIFT UNLOCKED! 🎀
        </h3>
        
        <p className="text-white/80 mb-4">
          Congratulations {SPECIAL_BADGE_NAME}! You've earned something very special...
        </p>

        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-pink-400 font-medium">Top Secret</span>
            <Lock className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-xs text-white/50">
            Only 5 people know what's inside. Will you be the next?
          </p>
        </div>

        <Button 
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8"
          onClick={() => setRevealing(true)}
        >
          <Gift className="w-5 h-5 mr-2" />
          Claim My Secret Gift
        </Button>

        <p className="text-xs text-white/40 mt-3">
          Limited time offer for founding members only
        </p>
      </div>

      {/* Reveal Animation */}
      <AnimatePresence>
        {revealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1a0a2e] z-20 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360, 720],
                  scale: [1, 1.5, 1]
                }}
                transition={{ duration: 2 }}
                className="text-8xl mb-4"
              >
                🎁
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xl font-bold text-pink-400"
              >
                Unboxing your surprise...
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="mt-8"
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold"
                  onClick={() => setClaimed(true)}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Reveal My Gift!
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default {
  FoundingMemberBanner,
  EarlyAdopterTiers,
  SecretGiftClaim,
  SPECIAL_BADGE_NAME
};
