"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  User, 
  Camera, 
  MessageCircle, 
  Award,
  Heart,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  Flame,
  Clock,
  Palette,
  Wand2,
  Crown,
  Star,
  Zap,
  Quote,
  Eye,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileCard } from "@/components/makeup/UserProfileCard";
import { BottomNav } from "@/components/nav/BottomNav";

const QUICK_ACTIONS = [
  {
    title: "Start Tutorial",
    description: "Begin a new makeup lesson",
    icon: <Camera className="w-6 h-6" />,
    href: "/tutorial",
    color: "from-pink-500 via-rose-500 to-fuchsia-500",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-400"
  },
  {
    title: "AI Custom Look",
    description: "Create with Tessi",
    icon: <Wand2 className="w-6 h-6" />,
    href: "/",
    color: "from-fuchsia-500 via-purple-500 to-violet-500",
    bgColor: "bg-fuchsia-500/10",
    textColor: "text-fuchsia-400"
  },
  {
    title: "Chat with Tessi",
    description: "Get real-time advice",
    icon: <MessageCircle className="w-6 h-6" />,
    href: "/chat",
    color: "from-rose-500 via-pink-500 to-orange-500",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-400"
  },
  {
    title: "AR Try-On",
    description: "Virtual makeup preview",
    icon: <Eye className="w-6 h-6" />,
    href: "/ar",
    color: "from-orange-500 via-amber-500 to-yellow-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-400"
  }
];

const NAVIGATION_ITEMS = [
  {
    title: "My Profile",
    description: "View and edit your profile",
    icon: <User className="w-5 h-5" />,
    href: "/profile",
    color: "from-pink-500 via-rose-500 to-fuchsia-500"
  },
  {
    title: "Achievements",
    description: "Track your progress",
    icon: <Award className="w-5 h-5" />,
    href: "/profile?tab=achievements",
    color: "from-fuchsia-500 via-purple-500 to-violet-500"
  },
  {
    title: "Saved Looks",
    description: "Your favorite styles",
    icon: <Heart className="w-5 h-5" />,
    href: "/saved",
    color: "from-rose-500 via-pink-500 to-fuchsia-500"
  },
  {
    title: "Tutorial History",
    description: "Completed lessons",
    icon: <Clock className="w-5 h-5" />,
    href: "/history",
    color: "from-orange-500 via-pink-500 to-rose-500"
  },
  {
    title: "Browse Styles",
    description: "Explore makeup looks",
    icon: <Palette className="w-5 h-5" />,
    href: "/explore",
    color: "from-violet-500 via-fuchsia-500 to-pink-500"
  },
  {
    title: "Settings",
    description: "App preferences",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
    color: "from-slate-500 via-gray-500 to-zinc-500"
  }
];

export default function DashboardPage() {
  const { 
    profile, 
    isAuthenticated, 
    unlockedAchievements, 
    nextAchievements,
    signOut 
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <Card className="p-8 bg-white/5 border-white/10 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-pink-400" />
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-white/60 mb-4">Access your dashboard</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]">
              Go to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden selection:bg-pink-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        {/* AR face grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        {/* Hot pink glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[150px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[200px]" />
        {/* Glowing sparks */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-pink-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-ping delay-300" />
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-rose-400 rounded-full animate-ping delay-700" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/images/logo.png" 
                alt="Glam Guide AI" 
                className="h-10 w-auto hover:scale-105 transition-transform"
              />
            </Link>
            
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/5">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-white/50 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-fuchsia-500/10 border border-pink-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {profile?.personalInfo?.displayName?.split(" ")?.[0] || "Beauty"}
                </span>
              </h1>
              <p className="text-white/50 mt-1">Ready to glow up today?</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfileCard 
              profile={profile}
              unlockedAchievements={unlockedAchievements}
              nextAchievements={nextAchievements}
            />

            {/* Streak Card - Hot Pink Style */}
            <Card className="p-6 bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-fuchsia-500/20 border-pink-500/30 relative overflow-hidden">
              {/* Animated spark */}
              <div className="absolute top-2 right-2">
                <Flame className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-300 mb-1">Current Streak</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {profile?.stats?.currentStreak || 0} Days
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Flame className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-xs text-pink-300/70 mt-3">
                Keep it up! You&apos;re on fire! 🔥
              </p>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-white/5 border-white/10 text-center hover:bg-white/10 transition-all group">
                <Star className="w-5 h-5 mx-auto mb-2 text-pink-400 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-bold text-white">{unlockedAchievements.length}</p>
                <p className="text-xs text-white/50">Achievements</p>
              </Card>
              <Card className="p-4 bg-white/5 border-white/10 text-center hover:bg-white/10 transition-all group">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-bold text-white">{profile?.stats?.tutorialsCompleted || 0}</p>
                <p className="text-xs text-white/50">Tutorials</p>
              </Card>
            </div>

            {/* Quote Card */}
            <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 border-pink-500/20">
              <Quote className="w-6 h-6 text-pink-400/50 mb-2" />
              <p className="text-sm italic text-white/70">
                &ldquo;Beauty is not in the face; beauty is a light in the heart.&rdquo;
              </p>
              <p className="text-xs text-pink-400/60 mt-2">— Kahlil Gibran</p>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Navigation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions Grid */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {QUICK_ACTIONS.map((action, i) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={action.href}>
                      <Card className={`p-5 bg-white/5 border-white/10 hover:bg-white/10 transition-all group cursor-pointer`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center ${action.textColor} group-hover:scale-110 transition-transform`}>
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white group-hover:text-white transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-white/50 mt-1">{action.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Navigation Menu */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-fuchsia-400" />
                Navigation
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {NAVIGATION_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={item.href}>
                      <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{item.title}</h3>
                            <p className="text-xs text-white/50">{item.description}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-400" />
                Recent Activity
              </h2>
              <Card className="p-6 bg-white/5 border-white/10">
                {profile?.total_tutorials_completed ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Completed Tutorial</p>
                        <p className="text-xs text-white/50">Natural Everyday Look</p>
                      </div>
                      <span className="text-xs text-pink-400/60">2h ago</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-rose-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Saved a Look</p>
                        <p className="text-xs text-white/50">Soft Glam Evening</p>
                      </div>
                      <span className="text-xs text-pink-400/60">5h ago</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/40">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                    <p className="text-sm">No recent activity</p>
                    <p className="text-xs mt-1">Start your first tutorial!</p>
                  </div>
                )}
              </Card>
            </section>

            {/* Upgrade Banner */}
            <Card className="p-6 bg-gradient-to-r from-pink-500/20 via-fuchsia-500/20 to-rose-500/20 border-pink-500/30 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Crown className="w-5 h-5 text-pink-400" />
                    Upgrade to Premium
                  </h3>
                  <p className="text-sm text-white/60 mt-1">
                    Unlock unlimited AI looks and advanced AR features
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-pink-500/30">
                  Upgrade
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
