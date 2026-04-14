// 🧪 BETA TESTER PROGRAM - Early Access & Feedback Rewards

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, Bug, MessageSquare, Zap, Star, Gift,
  CheckCircle2, Clock, Lock, Unlock, Send, Crown,
  Smartphone, Globe, Sparkles, ChevronRight, X, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BetaTester {
  userId: string;
  username: string;
  joinedAt: string;
  status: 'pending' | 'active' | 'vip' | 'graduated';
  feedbackSubmitted: number;
  bugsReported: number;
  featuresTested: string[];
  rewardsEarned: string[];
  badges: string[];
  earlyAccessFeatures: string[];
}

// Beta Tester Tiers
const BETA_TIERS = [
  {
    id: 'beta-newbie',
    name: '🧪 Lab Assistant',
    icon: '🧪',
    color: '#22c55e',
    requirements: 'Join beta program',
    benefits: [
      'Access to beta features 2 weeks early',
      'Beta tester badge on profile',
      'Exclusive beta Discord channel',
      'Monthly "Behind the Scenes" updates'
    ],
    rewards: ['Beta Badge', 'Early Access']
  },
  {
    id: 'beta-tester',
    name: '🔬 Lab Researcher', 
    icon: '🔬',
    color: '#3b82f6',
    requirements: 'Submit 3 feedback reports',
    benefits: [
      'Everything from Lab Assistant',
      '1 month Premium FREE',
      'Name in app credits (Beta Team)',
      'Priority bug fix requests',
      'Beta feature voting rights'
    ],
    rewards: ['1 Month Premium', 'Credits Mention']
  },
  {
    id: 'beta-pro',
    name: '🥼 Lab Scientist',
    icon: '🥼',
    color: '#a855f7',
    requirements: 'Submit 10 feedback + 2 bug reports',
    benefits: [
      'Everything from Researcher',
      '3 months Premium FREE',
      'Direct line to product team',
      'Exclusive beta tester merchandise',
      'Feature naming rights (suggest names)',
      'Early access to ALL new features'
    ],
    rewards: ['3 Months Premium', 'Merch', 'Feature Input']
  },
  {
    id: 'beta-vip',
    name: '👑 Chief Scientist',
    icon: '👑',
    color: '#f59e0b',
    requirements: 'Submit 25+ feedback + 5 bugs + refer 3 beta testers',
    benefits: [
      'Everything from Scientist',
      'Lifetime Premium FREE',
      'Annual mystery gift box',
      'VIP beta tester status (permanent)',
      'Input on product roadmap',
      'Exclusive Chief Scientist merchandise',
      'First access to partnership features',
      'Invitation to beta tester events'
    ],
    rewards: ['Lifetime Premium', 'Annual Gifts', 'VIP Status', 'Merch']
  }
];

// Active Beta Features (changes over time)
const CURRENT_BETA_FEATURES = [
  {
    id: 'ar-v2',
    name: 'AR Try-On 2.0',
    description: 'New improved AR with better face tracking and lighting',
    status: 'testing',
    testersNeeded: 50,
    currentTesters: 23,
    reward: '50 XP + "AR Pioneer" badge'
  },
  {
    id: 'ai-coach-v2',
    name: 'AI Voice Coach 2.0',
    description: 'Smarter AI with personalized learning paths',
    status: 'testing',
    testersNeeded: 100,
    currentTesters: 67,
    reward: '75 XP + "AI Whisperer" badge'
  },
  {
    id: 'social-feed',
    name: 'Social Feed (Coming Soon)',
    description: 'Share looks and follow other makeup enthusiasts',
    status: 'closed_beta',
    testersNeeded: 200,
    currentTesters: 0,
    reward: '100 XP + "Social Butterfly" badge'
  },
  {
    id: 'challenge-system',
    name: 'Makeup Challenges',
    description: 'Weekly challenges with leaderboards',
    status: 'coming_soon',
    testersNeeded: 150,
    currentTesters: 0,
    reward: '100 XP + "Challenger" badge'
  }
];

// Beta Tester Application/Banner
export function BetaTesterBanner({ 
  userStatus = null,
  onApply 
}: { 
  userStatus?: BetaTester | null;
  onApply?: () => void;
}) {
  const [showApply, setShowApply] = useState(false);

  // If already a beta tester, show status
  if (userStatus) {
    const tier = BETA_TIERS.find(t => t.id === userStatus.status) || BETA_TIERS[0];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-full"
              style={{ backgroundColor: `${tier.color}40` }}
            >
              <span className="text-2xl">{tier.icon}</span>
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                Beta Tester: {tier.name}
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {userStatus.status === 'vip' ? 'VIP' : 'Active'}
                </span>
              </h3>
              <p className="text-sm text-white/80">
                {userStatus.feedbackSubmitted} feedback • {userStatus.bugsReported} bugs • Testing {userStatus.featuresTested.length} features
              </p>
            </div>
          </div>
          
          <Button 
            className="bg-white text-purple-600 hover:bg-white/90"
            onClick={() => {}}
          >
            <FlaskConical className="w-4 h-4 mr-2" />
            Test New Features
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white p-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                🧪 Become a Beta Tester!
              </h3>
              <p className="text-sm text-white/90">
                Test new features early • Earn rewards • Shape the future of Glam Guide AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/70">Only</p>
              <p className="font-bold text-yellow-300">27 spots left!</p>
            </div>
            <Button 
              className="bg-white text-blue-600 hover:bg-white/90 font-bold"
              onClick={() => setShowApply(true)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApply && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApply(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a0a2e] rounded-2xl max-w-lg w-full p-6 border border-white/10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center text-3xl mb-3">
                  🧪
                </div>
                <h2 className="text-2xl font-bold text-white">Join the Beta Team!</h2>
                <p className="text-white/60 mt-1">
                  Help us build the future of AI makeup coaching
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-medium text-white/80">What you get:</h3>
                {BETA_TIERS[0].benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Application Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Why do you want to be a beta tester?</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm h-24 resize-none"
                    placeholder="I love makeup and tech..."
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-1 block">What device do you use?</label>
                  <div className="flex gap-2">
                    <button className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10">
                      <Smartphone className="w-5 h-5 mx-auto mb-1" />
                      iPhone
                    </button>
                    <button className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10">
                      <Smartphone className="w-5 h-5 mx-auto mb-1" />
                      Android
                    </button>
                    <button className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10">
                      <Globe className="w-5 h-5 mx-auto mb-1" />
                      Desktop
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-1 block">What features interest you most?</label>
                  <div className="flex flex-wrap gap-2">
                    {['AR Try-On', 'AI Coach', 'Social', 'Challenges'].map((feature) => (
                      <button 
                        key={feature}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 hover:bg-white/10"
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowApply(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => {
                    onApply?.();
                    setShowApply(false);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </Button>
              </div>

              <p className="text-xs text-white/40 text-center mt-4">
                You'll hear back within 24-48 hours. Limited spots available!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Beta Tester Dashboard
export function BetaTesterDashboard({ tester }: { tester: BetaTester }) {
  const [activeTab, setActiveTab] = useState('features');
  const currentTier = BETA_TIERS.find(t => t.id === tester.status) || BETA_TIERS[0];
  const nextTier = BETA_TIERS[BETA_TIERS.findIndex(t => t.id === tester.status) + 1];

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${currentTier.color}30` }}
            >
              {currentTier.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{currentTier.name}</h3>
              <p className="text-sm text-white/60">Beta Tester Status</p>
              <div className="flex gap-2 mt-1">
                {tester.badges.map((badge) => (
                  <span 
                    key={badge}
                    className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/70"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: currentTier.color }}>
              {tester.feedbackSubmitted}
            </p>
            <p className="text-xs text-white/60">Feedback Given</p>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/60">Progress to {nextTier.name}</span>
              <span className="text-white/80">{tester.feedbackSubmitted} / 10 feedback</span>
            </div>
            <Progress 
              value={(tester.feedbackSubmitted / 10) * 100} 
              className="h-2"
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'features', label: 'Test Features', icon: FlaskConical },
          { id: 'feedback', label: 'My Feedback', icon: MessageSquare },
          { id: 'rewards', label: 'Rewards', icon: Gift }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'features' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white/80 mb-3">Available for Testing</h4>
            {CURRENT_BETA_FEATURES.filter(f => f.status === 'testing').map((feature) => (
              <div 
                key={feature.id}
                className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-white">{feature.name}</h5>
                    <p className="text-sm text-white/60 mt-1">{feature.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {feature.currentTesters}/{feature.testersNeeded} testers
                      </span>
                      <span className="text-xs text-yellow-400">
                        Reward: {feature.reward}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Test Now
                  </Button>
                </div>
              </div>
            ))}

            {/* Coming Soon */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-white/60 mb-3">Coming to Beta Soon</h4>
              <div className="space-y-2">
                {CURRENT_BETA_FEATURES.filter(f => f.status !== 'testing').map((feature) => (
                  <div 
                    key={feature.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/60">{feature.name}</span>
                    </div>
                    <span className="text-xs text-white/40 capitalize">
                      {feature.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-white/20" />
            <p className="text-white/60">No feedback submitted yet</p>
            <p className="text-sm text-white/40 mt-1">
              Test a feature and share your thoughts!
            </p>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-3">
            {tester.rewardsEarned.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <p className="text-white/60">Start testing to earn rewards!</p>
              </div>
            ) : (
              tester.rewardsEarned.map((reward, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-white">{reward}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// Feedback Form
export function BetaFeedbackForm({ 
  featureId,
  onSubmit 
}: { 
  featureId: string;
  onSubmit?: (feedback: any) => void;
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [bugReport, setBugReport] = useState(false);

  const feature = CURRENT_BETA_FEATURES.find(f => f.id === featureId);

  if (!feature) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30">
      <h3 className="text-lg font-bold text-white mb-1">Test: {feature.name}</h3>
      <p className="text-sm text-white/60 mb-4">{feature.description}</p>

      {/* Rating */}
      <div className="mb-4">
        <label className="text-sm text-white/80 mb-2 block">How would you rate this feature?</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`p-2 rounded-lg transition-colors ${
                rating >= star 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-white/5 text-white/30'
              }`}
            >
              <Star className="w-6 h-6" fill={rating >= star ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Text */}
      <div className="mb-4">
        <label className="text-sm text-white/80 mb-2 block">Your feedback</label>
        <textarea 
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white h-32 resize-none"
          placeholder="What did you like? What could be better?"
        />
      </div>

      {/* Bug Report Toggle */}
      <div className="mb-4">
        <button 
          onClick={() => setBugReport(!bugReport)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            bugReport 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-white/5 text-white/60'
          }`}
        >
          <Bug className="w-4 h-4" />
          {bugReport ? 'Bug Report Mode' : 'Report a bug?'}
        </button>
      </div>

      {/* Bug Details (if enabled) */}
      {bugReport && (
        <div className="mb-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <label className="text-sm text-red-400 mb-2 block">Bug Description</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white h-24 resize-none"
            placeholder="Describe what went wrong..."
          />
          <div className="mt-2 text-xs text-white/40">
            🎁 Bug reports earn bonus XP + "Bug Hunter" badge!
          </div>
        </div>
      )}

      <Button 
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        onClick={() => onSubmit?.({ rating, feedback, bugReport })}
        disabled={rating === 0 || !feedback}
      >
        <Send className="w-4 h-4 mr-2" />
        Submit Feedback
      </Button>

      <p className="text-xs text-white/40 text-center mt-3">
        Thank you for helping us improve! You'll earn {feature.reward}
      </p>
    </Card>
  );
}

export default {
  BetaTesterBanner,
  BetaTesterDashboard,
  BetaFeedbackForm,
  BETA_TIERS,
  CURRENT_BETA_FEATURES
};
