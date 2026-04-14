// 🚀 COMING SOON - Feature Preview & Unlock System

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Users, Globe, Trophy, Video, Sparkles,
  MapPin, Zap, TrendingUp, MessageCircle, Award,
  ChevronRight, Clock, Target
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ComingSoonFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  
  // Unlock requirements
  unlockType: 'users' | 'looks' | 'engagement' | 'time' | 'manual';
  unlockValue: number;
  currentValue: number;
  
  // Status
  status: 'locked' | 'unlocked' | 'beta' | 'coming_soon';
  eta?: string;
  
  // Teaser
  teaserImage?: string;
  previewVideo?: string;
}

const comingSoonFeatures: ComingSoonFeature[] = [
  {
    id: 'local-trends',
    title: 'Local Trends',
    description: 'See what\'s trending in your city. Find local makeup artists and beauty events near you.',
    icon: <MapPin className="w-6 h-6" />,
    color: '#22c55e',
    unlockType: 'users',
    unlockValue: 1000,
    currentValue: 0, // Will be dynamic
    status: 'locked',
    eta: 'Q2 2025'
  },
  {
    id: 'regional-challenges',
    title: 'Regional Challenges',
    description: 'Compete in state-wide makeup challenges. Win prizes and get featured on regional leaderboards.',
    icon: <Trophy className="w-6 h-6" />,
    color: '#f59e0b',
    unlockType: 'users',
    unlockValue: 5000,
    currentValue: 0,
    status: 'locked',
    eta: 'Q2 2025'
  },
  {
    id: 'squad-finder',
    title: 'Find Your Makeup Squad',
    description: 'Connect with makeup twins in your area. Same skin type, similar goals, local meetups.',
    icon: <Users className="w-6 h-6" />,
    color: '#8b5cf6',
    unlockType: 'users',
    unlockValue: 2500,
    currentValue: 0,
    status: 'locked',
    eta: 'Q3 2025'
  },
  {
    id: 'live-events',
    title: 'Live Makeup Events',
    description: 'Join live tutorial sessions with top artists. Real-time AR try-along and Q&A.',
    icon: <Video className="w-6 h-6" />,
    color: '#ef4444',
    unlockType: 'engagement',
    unlockValue: 10000, // Total likes across platform
    currentValue: 0,
    status: 'locked',
    eta: 'Q3 2025'
  },
  {
    id: 'global-trends',
    title: 'Global Trend Explorer',
    description: 'Discover makeup trends from Seoul to Paris. K-beauty, Bollywood glam, European elegance.',
    icon: <Globe className="w-6 h-6" />,
    color: '#3b82f6',
    unlockType: 'users',
    unlockValue: 10000,
    currentValue: 0,
    status: 'locked',
    eta: 'Q4 2025'
  },
  {
    id: 'collaboration-tools',
    title: 'Collaborate & Create',
    description: 'Duet with other creators, stitch looks together, create response videos. Social makeup creation.',
    icon: <MessageCircle className="w-6 h-6" />,
    color: '#ec4899',
    unlockType: 'looks',
    unlockValue: 50000, // Total looks created platform-wide
    currentValue: 0,
    status: 'locked',
    eta: 'Q4 2025'
  },
  {
    id: 'ai-trend-prediction',
    title: 'AI Trend Predictor',
    description: 'See what will trend next week before it happens. Stay ahead of the curve.',
    icon: <Zap className="w-6 h-6" />,
    color: '#fbbf24',
    unlockType: 'time',
    unlockValue: 90, // Days since launch
    currentValue: 0,
    status: 'locked',
    eta: 'Q1 2026'
  },
  {
    id: 'verified-mua-program',
    title: 'Verified MUA Program',
    description: 'Get verified as a professional makeup artist. Badge, features, and client discovery.',
    icon: <Award className="w-6 h-6" />,
    color: '#14b8a6',
    unlockType: 'manual',
    unlockValue: 0,
    currentValue: 0,
    status: 'coming_soon',
    eta: 'Q2 2025'
  }
];

interface MilestoneGoal {
  metric: string;
  target: number;
  current: number;
  label: string;
}

export function ComingSoon() {
  const [selectedFeature, setSelectedFeature] = useState<ComingSoonFeature | null>(null);
  
  // These would be fetched from backend in real implementation
  const platformStats = {
    totalUsers: 0,
    totalLooks: 0,
    totalEngagement: 0,
    daysSinceLaunch: 0
  };

  const getProgress = (feature: ComingSoonFeature): number => {
    let current = 0;
    
    switch (feature.unlockType) {
      case 'users':
        current = platformStats.totalUsers;
        break;
      case 'looks':
        current = platformStats.totalLooks;
        break;
      case 'engagement':
        current = platformStats.totalEngagement;
        break;
      case 'time':
        current = platformStats.daysSinceLaunch;
        break;
      default:
        current = 0;
    }
    
    return Math.min(100, (current / feature.unlockValue) * 100);
  };

  const getUnlockLabel = (feature: ComingSoonFeature): string => {
    switch (feature.unlockType) {
      case 'users':
        return `${platformStats.totalUsers.toLocaleString()} / ${feature.unlockValue.toLocaleString()} users`;
      case 'looks':
        return `${platformStats.totalLooks.toLocaleString()} / ${feature.unlockValue.toLocaleString()} looks`;
      case 'engagement':
        return `${platformStats.totalEngagement.toLocaleString()} / ${feature.unlockValue.toLocaleString()} interactions`;
      case 'time':
        return `${platformStats.daysSinceLaunch} / ${feature.unlockValue} days`;
      default:
        return 'Coming soon';
    }
  };

  return (
    <div className="min-h-screen dark-purple text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 mb-4"
          >
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
            <span className="text-fuchsia-300 font-medium">Roadmap 2025-2026</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Exciting features are on the way! Help us unlock them by growing our community. 
            The more users join, the faster we release new features.
          </p>
        </div>

        {/* Platform Milestones */}
        <Card className="mb-8 p-6 bg-white/5 border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-fuchsia-400" />
            Platform Milestones
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-fuchsia-400">
                {platformStats.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-white/60">Active Users</p>
              <p className="text-xs text-white/40 mt-1">Goal: 1,000</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-purple-400">
                {platformStats.totalLooks.toLocaleString()}
              </p>
              <p className="text-sm text-white/60">Looks Created</p>
              <p className="text-xs text-white/40 mt-1">Goal: 5,000</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-pink-400">
                {platformStats.totalEngagement.toLocaleString()}
              </p>
              <p className="text-sm text-white/60">Total Likes</p>
              <p className="text-xs text-white/40 mt-1">Goal: 10,000</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-cyan-400">
                {platformStats.daysSinceLaunch}
              </p>
              <p className="text-sm text-white/60">Days Active</p>
              <p className="text-xs text-white/40 mt-1">Goal: 90 days</p>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comingSoonFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedFeature(feature)}
              className="group cursor-pointer"
            >
              <Card className={cn(
                "relative overflow-hidden p-6 transition-all duration-300",
                "bg-white/5 border-white/10 hover:border-white/20",
                feature.status === 'unlocked' && "border-green-500/50 bg-green-500/5"
              )}>
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {feature.status === 'locked' && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-xs">
                      <Lock className="w-3 h-3" />
                      Locked
                    </div>
                  )}
                  {feature.status === 'beta' && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                      <Zap className="w-3 h-3" />
                      Beta
                    </div>
                  )}
                  {feature.status === 'coming_soon' && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">
                      <Clock className="w-3 h-3" />
                      Coming {feature.eta}
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-fuchsia-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {feature.description}
                </p>

                {/* Progress */}
                {feature.status === 'locked' && feature.unlockType !== 'manual' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Unlock Progress</span>
                      <span className="text-white/60">{getUnlockLabel(feature)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${getProgress(feature)}%`,
                          backgroundColor: feature.color
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgress(feature)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-4 flex items-center gap-2 text-sm text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Invite CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-cyan-500/10 border-white/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              Help Us Grow! 🚀
            </h2>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">
              Invite friends to join Glam Guide AI. Every new user brings us closer 
              to unlocking amazing features for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-xl font-semibold transition-colors">
                Invite Friends
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors">
                Share on Social
              </button>
            </div>
          </div>
        </Card>

        {/* Feature Detail Modal */}
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1a0a2e] rounded-2xl max-w-lg w-full p-6 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: `${selectedFeature.color}20`, 
                    color: selectedFeature.color 
                  }}
                >
                  {selectedFeature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedFeature.title}</h3>
                  <p className="text-sm text-white/60">{selectedFeature.eta}</p>
                </div>
              </div>
              
              <p className="text-white/80 mb-6">
                {selectedFeature.description}
              </p>

              {selectedFeature.status === 'locked' && selectedFeature.unlockType !== 'manual' && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-white/60 mb-2">Unlock Requirements</h4>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <span className="capitalize">{selectedFeature.unlockType}</span>
                      <span>{getUnlockLabel(selectedFeature)}</span>
                    </div>
                    <Progress value={getProgress(selectedFeature)} className="h-2" />
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedFeature(null)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ComingSoon;
