"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Wand2, 
  Clock, 
  Star, 
  Camera, 
  ChevronRight, 
  Loader2,
  Heart,
  Sparkle,
  Palette,
  CheckCircle2
} from "lucide-react";
import { 
  GlamBrushIcon, 
  LipstickIcon, 
  CrownIcon, 
  MagicWandIcon,
  GlamHeartIcon,
  SparkleIcon,
  PaletteIcon
} from "@/components/icons/GlamIcons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { presetMakeupStyles } from "@/data/makeupStyles";
import { generateCustomMakeupStyle } from "@/services/aiService";
import { MakeupStyle } from "@/types";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileCard } from "@/components/makeup/UserProfileCard";
import { SocialShare } from "@/components/makeup/SocialShare";
import { AuthModal } from "@/components/makeup/AuthModal";

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState<MakeupStyle | null>(null);
  const [customDescription, setCustomDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStyle, setGeneratedStyle] = useState<MakeupStyle | null>(null);
  const [activeTab, setActiveTab] = useState<"presets" | "custom" | "profile">("presets");
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Phase 5: Cloud Auth
  const { isAuthenticated, profile, unlockedAchievements, nextAchievements, createLook, toggleFavorite, isFavorite, signOut } = useAuth();

  const handleGenerateCustomStyle = async () => {
    if (!customDescription.trim()) return;
    
    setIsGenerating(true);
    try {
      const style = await generateCustomMakeupStyle(customDescription);
      setGeneratedStyle(style);
      setSelectedStyle(style);
      
      // Phase 4: Track achievement
      createLook();
    } catch (error) {
      console.error("Failed to generate style:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700 border-green-200";
      case "intermediate": return "bg-amber-100 text-amber-700 border-amber-200";
      case "advanced": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen dark-purple bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900 via-[#1a0a2e] to-black text-white overflow-hidden">
      {/* Animated Stars Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-fuchsia-300 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-white rounded-full animate-pulse delay-1000" />
        {/* Nebula Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px]" />
      </div>
      
      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Floating Logo with Glow */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse" />
                <img 
                  src="/images/Logo.png" 
                  alt="Glam Guide AI" 
                  className="relative h-28 sm:h-36 w-auto drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                />
              </div>
            </div>
            
            {/* Main Title with Gradient */}
            <motion.h1 
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-amber-200 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                Glam Guide AI
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="mt-2 text-xl sm:text-2xl text-fuchsia-200/80 font-light italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              ((AI-Powered AR Makeup Tutorial))
            </motion.p>
            
            {/* Tagline */}
            <motion.p 
              className="mt-4 text-lg sm:text-xl text-white/60 font-serif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Your Personal Glam Guide
            </motion.p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="gap-2 text-lg shadow-lg shadow-glam-500/30 bg-gradient-to-r from-glam-500 via-fuchsia-500 to-royal-500 hover:from-glam-600 hover:via-fuchsia-600 hover:to-royal-600 text-white border-0"
                onClick={() => document.getElementById('styles-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <GlamBrushIcon className="h-5 w-5" />
                Start Your Tutorial
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 text-lg border-2 border-glam-300 hover:border-glam-500 hover:bg-glam-50 text-glam-700"
                onClick={() => setActiveTab("custom")}
              >
                <MagicWandIcon className="h-5 w-5" />
                Create Custom Look
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Style Selection Section */}
      <section id="styles-section" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Tab Navigation */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-full bg-white p-1 shadow-md border border-glam-200">
              <button
                onClick={() => setActiveTab("presets")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "presets"
                    ? "bg-gradient-to-r from-glam-500 via-fuchsia-500 to-royal-500 text-white shadow-md"
                    : "text-gray-600 hover:text-glam-600 hover:bg-glam-50"
                }`}
              >
                <PaletteIcon className="h-4 w-4" />
                Preset Looks
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "custom"
                    ? "bg-gradient-to-r from-glam-500 via-fuchsia-500 to-royal-500 text-white shadow-md"
                    : "text-gray-600 hover:text-glam-600 hover:bg-glam-50"
                }`}
              >
                <MagicWandIcon className="h-4 w-4" />
                AI Custom Look
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-glam-500 via-fuchsia-500 to-royal-500 text-white shadow-md"
                    : "text-gray-600 hover:text-glam-600 hover:bg-glam-50"
                }`}
              >
                <CrownIcon className="h-4 w-4" />
                Profile
              </button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === "profile" ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center">
                  <h2 className="font-serif text-3xl font-bold text-gray-900">
                    Your Beauty Journey
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Track your progress and achievements
                  </p>
                </div>
                <div className="mx-auto max-w-2xl">
                  <UserProfileCard
                    profile={profile}
                    unlockedAchievements={unlockedAchievements}
                    nextAchievements={nextAchievements}
                    onSignIn={() => setShowAuthModal(true)}
                  />
                </div>
              </motion.div>
            ) : activeTab === "presets" ? (
              <motion.div
                key="presets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center">
                  <h2 className="font-serif text-3xl font-bold text-gray-900">
                    Choose Your Style
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Select from our curated collection of makeup looks
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {presetMakeupStyles.map((style, index) => (
                    <motion.div
                      key={style.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div
                        className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-fuchsia-400/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] ${
                          selectedStyle?.id === style.id
                            ? "border-fuchsia-400 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                            : ""
                        }`}
                        onClick={() => setSelectedStyle(style)}
                        onMouseEnter={() => setHoveredStyle(style.id)}
                        onMouseLeave={() => setHoveredStyle(null)}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${style.imageUrl})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          
                          {/* Difficulty Badge */}
                          <div className="absolute left-3 top-3">
                            <Badge className={`${getDifficultyColor(style.difficulty)} border`}>
                              {style.difficulty}
                            </Badge>
                          </div>
                          
                          {/* Duration */}
                          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
                            <Clock className="h-3 w-3" />
                            {style.duration}
                          </div>
                          
                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-serif text-xl font-semibold text-white">
                              {style.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-white/80">
                              {style.description}
                            </p>
                            
                            {/* Tags & Favorite */}
                            <div className="mt-3 flex flex-wrap items-center gap-1">
                              {style.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(style.id);
                                }}
                                className="ml-auto rounded-full p-1.5 transition-colors hover:bg-white/20"
                              >
                                <Heart 
                                  className={`h-4 w-4 ${isFavorite(style.id) ? 'fill-rose-500 text-rose-500' : 'text-white'}`} 
                                />
                              </button>
                            </div>
                          </div>
                          
                          {/* Hover Overlay */}
                          <AnimatePresence>
                            {hoveredStyle === style.id && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-rose-500/20 backdrop-blur-sm"
                              >
                                <Button variant="secondary" size="lg" className="gap-2">
                                  <Sparkle className="h-4 w-4" />
                                  Select Look
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mx-auto max-w-2xl">
                  <div className="mb-8 text-center">
                    <h2 className="font-serif text-3xl font-bold text-gray-900">
                      Describe Your Dream Look
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Tell our AI what you want, and we will create a custom tutorial just for you
                    </p>
                  </div>

                  <Card className="border-2 border-rose-100 shadow-xl shadow-rose-500/5">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            What look do you want to create?
                          </label>
                          <Textarea
                            placeholder="Describe your dream makeup look... (e.g., 'soft romantic pink spring look with dewy skin and shimmery eyes')"
                            value={customDescription}
                            onChange={(e) => setCustomDescription(e.target.value)}
                            className="min-h-[120px] resize-none"
                          />
                        </div>

                        {/* Quick Tags */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Or try these ideas:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Golden goddess glow",
                              "Cherry cola lips",
                              "Latte makeup",
                              "Pink Barbie fantasy",
                              "Vampy dark romance",
                              "Clean girl aesthetic",
                              "Bridal soft glam",
                              "Festival glitter",
                            ].map((idea) => (
                              <button
                                key={idea}
                                onClick={() => setCustomDescription(idea)}
                                className="rounded-full bg-rose-50 px-3 py-1 text-sm text-rose-700 transition-colors hover:bg-rose-100"
                              >
                                {idea}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={handleGenerateCustomStyle}
                          disabled={!customDescription.trim() || isGenerating}
                          className="w-full gap-2"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Creating Your Look...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-5 w-5" />
                              Generate Custom Tutorial
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Generated Style Preview */}
                  <AnimatePresence>
                    {generatedStyle && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8"
                      >
                        <div className="mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium text-green-700">
                            AI Generated Your Custom Look!
                          </span>
                        </div>
                        
                        <Card className="overflow-hidden border-2 border-rose-500 shadow-lg shadow-rose-500/20">
                          <div className="flex flex-col md:flex-row">
                            <div className="bg-gradient-to-br from-rose-400 to-amber-400 p-6 md:w-1/3">
                              <div className="flex h-full flex-col justify-center text-white">
                                <Sparkles className="mb-2 h-8 w-8" />
                                <h3 className="font-serif text-xl font-bold">
                                  {generatedStyle.name}
                                </h3>
                                <p className="mt-1 text-sm text-white/90">
                                  {generatedStyle.description}
                                </p>
                              </div>
                            </div>
                            <div className="p-6 md:w-2/3">
                              <div className="mb-4 flex items-center gap-4">
                                <Badge className={getDifficultyColor(generatedStyle.difficulty)}>
                                  {generatedStyle.difficulty}
                                </Badge>
                                <span className="flex items-center gap-1 text-sm text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  {generatedStyle.duration}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-600">
                                  <Star className="h-4 w-4" />
                                  {generatedStyle.steps.length} steps
                                </span>
                              </div>
                              
                              <p className="text-gray-600">
                                Based on: <span className="italic">&ldquo;{customDescription}&rdquo;</span>
                              </p>
                              
                              <div className="mt-4 flex gap-2">
                                <Link href={`/tutorial?style=${generatedStyle.id}`} className="flex-1">
                                  <Button className="w-full gap-2">
                                    Start Tutorial
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  variant="outline" 
                                  className="gap-2"
                                  onClick={() => setGeneratedStyle(null)}
                                >
                                  <Heart className="h-4 w-4" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selected Style Action Bar */}
          <AnimatePresence>
            {selectedStyle && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-lg"
              >
                <Card className="border-2 border-rose-500 shadow-2xl shadow-rose-500/30">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Selected Look</p>
                      <p className="font-medium text-gray-900">{selectedStyle.name}</p>
                    </div>
                    <Link href={`/tutorial?style=${selectedStyle.id}`}>
                      <Button className="gap-2">
                        <Camera className="h-4 w-4" />
                        Start AR Tutorial
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-rose-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-rose-500" />
            <span className="font-serif text-xl font-bold text-gray-900">
              Makeup Mastery AI
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Your personal AI makeup artist. Learn, practice, and perfect your look.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-rose-500" />
            <span>using Next.js, MediaPipe & Groq AI</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </main>
  );
}

