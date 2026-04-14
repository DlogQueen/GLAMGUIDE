// 🚀 VIRAL GROWTH SYSTEM - Referrals, Rewards & Premium Trials

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Share2, Users, Sparkles, Crown, Clock, 
  CheckCircle2, Copy, Send, MessageCircle, Mail,
  Instagram, Twitter, Facebook, Link2, Trophy,
  Star, Zap, Heart, ChevronRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ReferralStats {
  referralCode: string;
  totalInvites: number;
  successfulReferrals: number;
  pendingReferrals: number;
  rewardsEarned: string[];
  nextReward: {
    name: string;
    required: number;
    current: number;
  };
  premiumTrial: {
    active: boolean;
    daysLeft: number;
    totalDays: number;
  };
}

const REWARD_TIERS = [
  { count: 1, reward: '1 Week Premium Free', icon: '🎁', color: '#22c55e' },
  { count: 3, reward: '1 Month Premium Free', icon: '👑', color: '#a855f7' },
  { count: 5, reward: '3 Months Premium + Exclusive Badge', icon: '🏆', color: '#f59e0b' },
  { count: 10, reward: 'Lifetime Premium + Verified Influencer Status', icon: '💎', color: '#ec4899' }
];

const SHARE_OPTIONS = [
  { 
    name: 'Copy Link', 
    icon: Link2, 
    color: '#64748b',
    action: 'copy'
  },
  { 
    name: 'WhatsApp', 
    icon: MessageCircle, 
    color: '#22c55e',
    url: (code: string) => `https://wa.me/?text=${encodeURIComponent(`Join me on Glam Guide AI! Use my code ${code} for 2 weeks free premium: https://glamguide.ai/ref/${code}`)}`
  },
  { 
    name: 'Instagram DM', 
    icon: Instagram, 
    color: '#ec4899',
    url: (code: string) => `https://instagram.com/direct/new/` // Opens IG
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    color: '#3b82f6',
    url: (code: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Learning makeup with AI! 🎨✨ Join Glam Guide AI and get 2 weeks FREE premium with my code: ${code} https://glamguide.ai/ref/${code}`)}`
  },
  { 
    name: 'Email', 
    icon: Mail, 
    color: '#f59e0b',
    url: (code: string) => `mailto:?subject=${encodeURIComponent('Try Glam Guide AI - 2 Weeks Free!')}&body=${encodeURIComponent(`Hey! I've been using this amazing AI makeup tutor called Glam Guide AI. It's like having a professional makeup artist in your pocket!\n\nUse my referral code ${code} to get 2 WEEKS of premium features FREE.\n\nCheck it out: https://glamguide.ai/ref/${code}`)}`
  }
];

// Premium Trial Banner Component
export function PremiumTrialBanner() {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base">
              🎉 Welcome! You have 14 days of FREE Premium!
            </p>
            <p className="text-xs text-white/80 hidden sm:block">
              All premium features unlocked. No credit card required.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Explore Premium
          </Button>
          <button 
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Referral Card Component
export function ReferralCard() {
  const [stats, setStats] = useState<ReferralStats>({
    referralCode: 'GLAM' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    totalInvites: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    rewardsEarned: [],
    nextReward: { name: '1 Week Premium', required: 1, current: 0 },
    premiumTrial: { active: true, daysLeft: 14, totalDays: 14 }
  });
  
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(`https://glamguide.ai/ref/${stats.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (option: typeof SHARE_OPTIONS[0]) => {
    if (option.action === 'copy') {
      copyCode();
    } else if (option.url) {
      window.open(option.url(stats.referralCode), '_blank');
    }
  };

  const progressToNext = (stats.successfulReferrals / stats.nextReward.required) * 100;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 border-fuchsia-500/30">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-fuchsia-500 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Invite Friends, Get Premium FREE!</h3>
        </div>
        <p className="text-white/70 text-sm">
          Share your unique code and unlock premium rewards. Everyone gets 2 weeks free on signup!
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Referral Code Display */}
        <div className="bg-black/30 rounded-xl p-4">
          <p className="text-xs text-white/60 mb-2 uppercase tracking-wider">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-2xl font-mono font-bold text-fuchsia-400 tracking-wider">
              {stats.referralCode}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-white/50 mt-2">
            Share this code with friends. When they sign up, you both get rewards!
          </p>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {SHARE_OPTIONS.map((option) => (
            <button
              key={option.name}
              onClick={() => handleShare(option)}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <option.icon 
                className="w-6 h-6 transition-colors" 
                style={{ color: option.color }}
              />
              <span className="text-xs text-white/60 group-hover:text-white">
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Progress to Next Reward */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Progress to Next Reward</span>
            <span className="text-sm text-fuchsia-400">
              {stats.successfulReferrals} / {stats.nextReward.required} friends
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-white/60 mt-2">
            🎁 Next reward: {stats.nextReward.name}
          </p>
        </div>

        {/* Reward Tiers */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-white mb-3">Reward Tiers</p>
          {REWARD_TIERS.map((tier, index) => {
            const isUnlocked = stats.successfulReferrals >= tier.count;
            const isNext = !isUnlocked && tier.count > stats.successfulReferrals && 
                          (index === 0 || stats.successfulReferrals >= REWARD_TIERS[index - 1].count);
            
            return (
              <motion.div
                key={tier.count}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all",
                  isUnlocked ? "bg-green-500/20 border border-green-500/30" : 
                  isNext ? "bg-fuchsia-500/10 border border-fuchsia-500/30" : 
                  "bg-white/5 border border-white/10 opacity-50"
                )}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${tier.color}20` }}
                >
                  {isUnlocked ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : tier.icon}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    isUnlocked ? "text-green-400" : "text-white"
                  )}>
                    {tier.reward}
                  </p>
                  <p className="text-xs text-white/50">
                    {tier.count} friend{tier.count > 1 ? 's' : ''}
                  </p>
                </div>
                {isUnlocked && (
                  <span className="text-xs text-green-400 font-medium">Claimed!</span>
                )}
                {isNext && (
                  <span className="text-xs text-fuchsia-400 font-medium">Next!</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.totalInvites}</p>
            <p className="text-xs text-white/60">Invites Sent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-fuchsia-400">{stats.successfulReferrals}</p>
            <p className="text-xs text-white/60">Friends Joined</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{stats.pendingReferrals}</p>
            <p className="text-xs text-white/60">Pending</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Gamification Widget - Shows in corner
export function EngagementWidget() {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1a0a2e] border border-fuchsia-500/30 rounded-2xl p-4 w-72 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Your Progress
              </h4>
              <button 
                onClick={() => setExpanded(false)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-sm text-white/70">Premium Trial</span>
                <span className="text-sm font-medium text-fuchsia-400">12 days left</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-sm text-white/70">Friends Invited</span>
                <span className="text-sm font-medium text-green-400">0</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-sm text-white/70">Daily Streak</span>
                <span className="text-sm font-medium text-orange-400">🔥 0 days</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <Button 
                size="sm" 
                className="w-full bg-fuchsia-500 hover:bg-fuchsia-600"
                onClick={() => {}}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Invite Friends
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Users className="w-4 h-4 mr-2" />
                View Rewards
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => setExpanded(true)}
            className="w-14 h-14 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <Trophy className="w-6 h-6 text-white" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
              3
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Share Celebration Modal
export function ShareCelebration({ 
  isOpen, 
  onClose, 
  friendName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  friendName: string;
}) {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-gradient-to-br from-fuchsia-900 to-purple-900 rounded-3xl p-8 max-w-md w-full text-center border border-fuchsia-500/30"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          {friendName} Joined!
        </h2>
        
        <p className="text-white/70 mb-6">
          You both got <span className="text-fuchsia-400 font-semibold">+1 week Premium FREE!</span>
        </p>
        
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <p className="text-sm text-white/60 mb-2">Your Progress</p>
          <div className="flex items-center gap-2">
            <Progress value={33} className="flex-1" />
            <span className="text-sm font-medium text-white">1/3</span>
          </div>
          <p className="text-xs text-white/50 mt-2">
            Invite 2 more friends for 1 MONTH free!
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-600"
            onClick={onClose}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Invite More
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            onClick={onClose}
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ReferralCard;
