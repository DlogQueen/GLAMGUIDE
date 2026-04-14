// 🎮 GAMIFICATION SYSTEM - Engagement Hooks & Viral Mechanics

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Target, Zap, Heart, Star, Trophy, Crown,
  Gift, Share2, Users, Sparkles, CheckCircle2,
  Lock, Unlock, ChevronRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Onboarding Quest System
export const ONBOARDING_QUESTS = [
  {
    id: 'first_look',
    title: 'Create Your First Look',
    description: 'Upload a before/after photo to start your portfolio',
    reward: '50 XP + Starter Badge',
    xp: 50,
    icon: '📸',
    action: '/camera'
  },
  {
    id: 'complete_tutorial',
    title: 'Complete a Tutorial',
    description: 'Finish any makeup tutorial with AI guidance',
    reward: '100 XP + "Learner" Badge',
    xp: 100,
    icon: '📚',
    action: '/tutorial?style=korean-glass-skin'
  },
  {
    id: 'try_ar',
    title: 'Try AR Makeup',
    description: 'Use the virtual try-on feature',
    reward: '75 XP + "Explorer" Badge',
    xp: 75,
    icon: '✨',
    action: '/ar-try-on'
  },
  {
    id: 'invite_friend',
    title: 'Share with a Friend',
    description: 'Invite someone and get 1 week free premium',
    reward: '200 XP + 1 Week Premium',
    xp: 200,
    icon: '🎁',
    action: '/refer'
  },
  {
    id: 'daily_practice',
    title: '3-Day Streak',
    description: 'Practice makeup for 3 days in a row',
    reward: '150 XP + Streak Badge',
    xp: 150,
    icon: '🔥',
    action: '/tutorials'
  }
];

// Daily Check-in System
export function DailyCheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(3); // Mock data
  
  const handleCheckIn = () => {
    setCheckedIn(true);
    setShowCelebration(true);
    setStreak(s => s + 1);
  };
  
  return (
    <>
      <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-orange-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Daily Check-in</h4>
              <p className="text-xs text-white/60">
                {streak} day streak! Keep it going!
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleCheckIn}
            disabled={checkedIn}
            className={checkedIn ? 
              "bg-green-500 text-white cursor-default" : 
              "bg-orange-500 hover:bg-orange-600"
            }
          >
            {checkedIn ? (
              <><CheckCircle2 className="w-4 h-4 mr-1" /> Done!</>
            ) : (
              "Check In"
            )}
          </Button>
        </div>
        
        {/* Streak Days */}
        <div className="flex gap-1 mt-3">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div 
              key={day}
              className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                day <= streak 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white/10 text-white/30'
              }`}
            >
              {day <= streak ? <Flame className="w-3 h-3" /> : day}
            </div>
          ))}
        </div>
        
        <p className="text-xs text-orange-300 mt-2 text-center">
          Day 7 Reward: Exclusive "Week Warrior" Badge + 500 XP
        </p>
      </Card>
      
      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl p-8 text-center max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🔥
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {streak} Day Streak!
              </h2>
              <p className="text-white/80 mb-4">
                +50 XP earned! You're on fire!
              </p>
              <div className="bg-white/20 rounded-xl p-3 mb-4">
                <p className="text-sm text-white">
                  Keep practicing to unlock the "Week Warrior" badge!
                </p>
              </div>
              <Button 
                className="w-full bg-white text-orange-600 hover:bg-white/90"
                onClick={() => setShowCelebration(false)}
              >
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// XP Level System
export function XPProgressBar({ xp = 350, level = 3 }: { xp?: number; level?: number }) {
  const xpForNextLevel = level * 200;
  const progress = (xp / xpForNextLevel) * 100;
  
  return (
    <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border-purple-500/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center font-bold text-white">
            {level}
          </div>
          <div>
            <p className="font-semibold text-white">Level {level}</p>
            <p className="text-xs text-white/60">{xp} / {xpForNextLevel} XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-fuchsia-400">
            {xpForNextLevel - xp} XP to Level {level + 1}
          </p>
        </div>
      </div>
      
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex gap-2 mt-3">
        <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">
          🏆 12 Badges
        </span>
        <span className="px-2 py-1 bg-fuchsia-500/20 rounded text-xs text-fuchsia-300">
          ⭐ 3 Achievements
        </span>
      </div>
    </Card>
  );
}

// Quest System for Onboarding
export function QuestSystem() {
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [currentQuest, setCurrentQuest] = useState(0);
  
  const handleComplete = (questId: string) => {
    setCompletedQuests([...completedQuests, questId]);
    setCurrentQuest(currentQuest + 1);
  };
  
  const progress = (completedQuests.length / ONBOARDING_QUESTS.length) * 100;
  
  return (
    <Card className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Complete 3 Tasks, Get Premium!</h3>
          <p className="text-sm text-white/60">
            Finish these quests to unlock your first reward
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-400">
            {completedQuests.length}/{ONBOARDING_QUESTS.length}
          </p>
          <p className="text-xs text-white/60">Completed</p>
        </div>
      </div>
      
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="space-y-3">
        {ONBOARDING_QUESTS.map((quest, index) => {
          const isCompleted = completedQuests.includes(quest.id);
          const isNext = index === currentQuest && !isCompleted;
          const isLocked = index > currentQuest;
          
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all
                ${isCompleted ? 'bg-green-500/20 border border-green-500/30' : ''}
                ${isNext ? 'bg-cyan-500/20 border border-cyan-500/30' : ''}
                ${isLocked ? 'bg-white/5 opacity-50' : 'bg-white/5'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-lg
                ${isCompleted ? 'bg-green-500' : isNext ? 'bg-cyan-500' : 'bg-white/10'}
              `}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : quest.icon}
              </div>
              
              <div className="flex-1">
                <p className={`font-medium ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                  {quest.title}
                </p>
                <p className="text-xs text-white/50">{quest.description}</p>
                <p className="text-xs text-cyan-400 mt-1">{quest.reward}</p>
              </div>
              
              {!isCompleted && !isLocked && (
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                  Start
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
              
              {isLocked && <Lock className="w-4 h-4 text-white/30" />}
            </motion.div>
          );
        })}
      </div>
      
      {completedQuests.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30"
        >
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-yellow-400" />
            <div className="flex-1">
              <p className="font-semibold text-white">Reward Unlocked!</p>
              <p className="text-sm text-white/70">
                You've earned 2 Weeks Premium FREE!
              </p>
            </div>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Claim
            </Button>
          </div>
        </motion.div>
      )}
    </Card>
  );
}

// Social Proof Notifications
export function SocialProofToast() {
  const [notification, setNotification] = useState<{
    name: string;
    action: string;
    location: string;
    time: string;
  } | null>(null);
  
  const notifications = [
    { name: 'Sarah from NYC', action: 'just tried the Korean Glass Skin tutorial', location: 'New York', time: '2 min ago' },
    { name: 'Jessica from LA', action: 'shared her Smokey Eye look', location: 'Los Angeles', time: '5 min ago' },
    { name: 'Emma from London', action: 'completed her first AR try-on', location: 'London', time: '8 min ago' },
    { name: 'Maria from Miami', action: 'earned the "Week Warrior" badge', location: 'Miami', time: '12 min ago' },
    { name: 'Alex from Chicago', action: 'invited 3 friends and got 1 month free', location: 'Chicago', time: '15 min ago' }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      const random = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(random);
      
      setTimeout(() => setNotification(null), 5000);
    }, 15000); // Show every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed bottom-20 right-4 z-40 max-w-sm"
        >
          <Card className="p-4 bg-[#1a0a2e]/95 border-fuchsia-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-semibold">{notification.name}</span> {notification.action}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  {notification.location} • {notification.time}
                </p>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// FOMO Urgency Component
export function FOMOBanner() {
  const [timeLeft, setTimeLeft] = useState(172800); // 48 hours in seconds
  const [spotsLeft, setSpotsLeft] = useState(47);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => t > 0 ? t - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  
  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white p-3"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          <span className="font-bold">Flash Offer:</span>
        </div>
        <p className="text-sm sm:text-base">
          Get <span className="font-bold">3 MONTHS FREE</span> premium when you invite 5 friends!
        </p>
        <div className="flex items-center gap-3 bg-white/20 rounded-lg px-3 py-1">
          <span className="text-xs font-medium">Ends in:</span>
          <span className="font-mono font-bold">
            {hours}h {minutes}m
          </span>
        </div>
        <div className="text-xs bg-white/20 rounded-full px-3 py-1">
          {spotsLeft} spots left
        </div>
      </div>
    </motion.div>
  );
}

// Gamification Widget Container
export function GamificationHub() {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <XPProgressBar xp={350} level={3} />
      <DailyCheckIn />
      <QuestSystem />
    </div>
  );
}

export default GamificationHub;
