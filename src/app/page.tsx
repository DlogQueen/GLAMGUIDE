"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  MessageCircle, 
  Camera, 
  Globe, 
  Zap,
  Heart,
  Star,
  ArrowRight,
  Play,
  Users,
  User,
  CheckCircle2,
  Smartphone,
  Crown,
  Flame,
  Quote,
  Palette,
  Eye,
  Wand2,
  X,
  Mail,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthModal } from "@/components/makeup/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { isAuthenticated, signIn, signUp } = useAuth();

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <MainApp />;
  }

  // Otherwise show landing page
  const openSignUp = () => {
    setAuthMode("signup");
    setAuthError("");
    setShowAuthModal(true);
  };

  const openSignIn = () => {
    setAuthMode("login");
    setAuthError("");
    setShowAuthModal(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || '';
      const password = (form.elements.namedItem('password') as HTMLInputElement)?.value || '';
      const nameEl = form.elements.namedItem('name') as HTMLInputElement | null;
      const name = nameEl?.value || '';

      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");
      if (authMode === "signup" && !name) throw new Error("Name is required");

      if (authMode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
      }
      
      // Auth successful - modal will auto-close via auth state change
      setShowAuthModal(false);
      form.reset();
    } catch (err: any) {
      const message = err?.message || "Authentication failed";
      console.error("Auth error:", message);
      setAuthError(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden selection:bg-pink-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        {/* Deep dark navy/black base */}
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        {/* Subtle AR face grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        {/* Hot pink glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[150px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[200px]" />
        {/* Glowing sparks */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-pink-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-ping delay-300" />
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-rose-400 rounded-full animate-ping delay-700" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-300 rounded-full animate-ping delay-500" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <img 
                src="/images/logo.png" 
                alt="Glam Guide AI" 
                className="h-20 w-auto hover:scale-105 transition-transform"
                fetchPriority="high"
                loading="eager"
                onError={(e) => {
                  // Fallback if logo doesn't load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('logo-fallback');
                }}
              />
              {/* Fallback text logo */}
              <div className="hidden logo-fallback:flex flex-col items-center">
                <span className="text-3xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">GLAM GUIDE</span>
                </span>
                <span className="text-xs font-bold tracking-[0.3em] text-pink-500/80 -mt-1">AI</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Button 
                variant="ghost" 
                onClick={openSignIn}
                className="text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium"
              >
                Sign In
              </Button>
              <Button 
                onClick={openSignUp}
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 border-0"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-pink-500/20 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-sm text-pink-200 font-medium">The World&apos;s First AI Beauty Assistant</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.95]">
                <span className="block text-white">Meet Tessi —</span>
                <span className="block bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                  Your ARI
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-pink-200/80 font-light max-w-3xl mx-auto leading-relaxed">
                Augmented Reality Intelligence that teaches you flawless makeup, live on your face.
              </p>
            </div>

            {/* Subheadline */}
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              The world&apos;s first AI beauty assistant that doesn&apos;t just show you looks — it guides you step-by-step with real-time AR overlays, personalized tutorials, and zero gatekeeping.
            </p>

            {/* Inclusive Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-white/40">For everyone. No exceptions.</span>
              {["All ages", "All skin tones", "All face shapes", "All genders", "All skill levels"].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/tutorial">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] text-white text-lg px-10 py-7 rounded-full font-bold transition-all duration-300 border-0"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Free Tutorial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/tutorial">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-pink-500/30 text-white hover:bg-pink-500/10 hover:border-pink-500/50 text-lg px-10 py-7 rounded-full backdrop-blur-sm transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Try Live Demo
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Trust Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-white/40"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-pink-400" />
                <span>10,000+ glow-ups completed</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>4.9/5 from real users</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>iOS & Android</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-pink-400 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Meet Tessi Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Your Personal AR Beauty Coach
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
                Tessi isn&apos;t some basic
                <span className="block bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                  AI chatbot
                </span>
              </h2>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                She&apos;s your Augmented Reality Intelligence who sees your face and talks you through every brush stroke like a patient bestie who actually knows what she&apos;s doing.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: MessageCircle,
                    title: "Real-Time Chat",
                    desc: "Ask anything (\"How do I do a smoky eye on hooded lids?\") and get instant, custom advice."
                  },
                  {
                    icon: Eye,
                    title: "AR Try-On + Guidance",
                    desc: "See the look on your face in real time, then get live overlays showing exactly where to blend, line, and highlight."
                  },
                  {
                    icon: Palette,
                    title: "Adaptive Step-by-Step",
                    desc: "Beginner? She slows it down. Advanced? She gives pro tips. Always tailored to your skill level."
                  }
                ].map((feature, i) => (
                  <motion.div 
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative mx-auto w-72 h-[580px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-pink-500/20 border border-white/10">
                {/* Phone screen */}
                <div className="w-full h-full bg-[#0a0a0f] rounded-[2.5rem] overflow-hidden relative">
                  {/* AR Face Demo */}
                  <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 to-purple-900/20" />
                  
                  {/* Face outline with AR guides */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-64 border-2 border-pink-500/40 rounded-full relative">
                      {/* AR overlay lines */}
                      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
                      <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
                      
                      {/* Glowing points */}
                      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-rose-400 rounded-full animate-pulse delay-300" />
                    </div>
                  </div>

                  {/* Chat bubble */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-sm">Tessi</span>
                      </div>
                      <p className="text-xs text-white/70">
                        &ldquo;Perfect! Now blend the eyeshadow along the crease line I&apos;m highlighting...&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Top status */}
                  <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white/60">LIVE AR</span>
                    </div>
                    <Zap className="w-4 h-4 text-pink-400" />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl overflow-hidden shadow-xl rotate-12"
              >
                <img 
                  src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop&auto=format" 
                  alt="Look" 
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                  loading="eager"
                />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl overflow-hidden shadow-xl -rotate-12"
              >
                <img 
                  src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=200&h=200&fit=crop&auto=format" 
                  alt="Look" 
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                  loading="eager"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Beauty Is For Everyone Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[150px]" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
            >
              Beauty Is For
              <span className="block bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
                Everyone
              </span>
            </motion.h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              No more &ldquo;one size fits all&rdquo; thinking. Glam Guide AI was built for real faces:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Palette, title: "Every skin tone & undertone" },
              { icon: User, title: "Every face shape & feature" },
              { icon: Heart, title: "Every gender expression" },
              { icon: Crown, title: "Ages 13 to 100+" }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-pink-400" />
                </div>
                <p className="font-medium text-sm">{item.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-fuchsia-500/10 border border-pink-500/20">
              <Quote className="absolute top-4 left-4 w-8 h-8 text-pink-400/30" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-light italic text-white/90 mb-6">
                  &ldquo;Finally, a makeup app that actually gets me.&rdquo;
                </p>
                <p className="text-sm text-pink-400/70">
                  — Real user who&apos;s tired of basic filters
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-br from-pink-600/20 via-rose-600/20 to-fuchsia-600/20 border border-pink-500/30 backdrop-blur-sm relative overflow-hidden">
            {/* Background sparkles */}
            <div className="absolute inset-0 overflow-hidden">
              <Sparkles className="absolute top-8 left-8 w-6 h-6 text-pink-400/30" />
              <Sparkles className="absolute bottom-8 right-8 w-8 h-8 text-fuchsia-400/30" />
              <Sparkles className="absolute top-1/2 right-12 w-4 h-4 text-rose-400/30" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 relative">
              Ready to Level Up
              <span className="block bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
                Your Face?
              </span>
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Stop guessing. Start glowing.
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg"
                onClick={openSignUp}
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] text-white text-xl px-12 py-8 rounded-full font-bold transition-all duration-300 border-0"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Get Started Free — No Card Needed
              </Button>
            </motion.div>
            
            <p className="text-sm text-white/40 mt-6">
              First tutorial takes 60 seconds. Your glow-up starts now.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black">
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">GLAM GUIDE</span>
                <span className="text-xs font-bold tracking-[0.2em] text-pink-500/80 ml-1">AI</span>
              </div>
            </div>
            
            <p className="text-white/40 text-sm text-center">
              Beauty for everyone. Powered by real AI + AR magic.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Smartphone className="w-4 h-4" />
              <span>iOS & Android coming soon</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white/60 transition-colors">About</Link>
              <Link href="#" className="hover:text-white/60 transition-colors">Features</Link>
              <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white/60 transition-colors">Contact</Link>
            </div>
            <p>© 2026 Glam Guide AI • Made for bad bitches who want to learn</p>
          </div>
        </div>
      </footer>

      {/* Landing Page Conversion Auth - Full Screen Experience */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f]/95 backdrop-blur-xl"
          >
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[200px] animate-pulse delay-500" />
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg mx-4"
            >
              {/* Close button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute -top-12 right-0 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl">
                {/* Header */}
                <div className="relative p-8 pb-6 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-fuchsia-600/20" />
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <Sparkles className="w-10 h-10 mx-auto text-pink-400 mb-3" />
                    </motion.div>
                    <h2 className="text-2xl font-black">
                      {authMode === "login" ? "Welcome Back" : "Start Your Glow-Up"}
                    </h2>
                    <p className="text-white/50 text-sm mt-2">
                      {authMode === "login" 
                          ? "Sign in to pick up where you left off" 
                          : "Join 10,000+ who are already leveling up their face"}
                    </p>
                  </div>
                </div>

                {/* Social proof bar */}
                {authMode === "signup" && (
                  <div className="px-8 py-3 bg-gradient-to-r from-pink-500/10 via-fuchsia-500/10 to-purple-500/10 border-y border-white/5">
                    <div className="flex items-center justify-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-pink-400" /> 4.9/5 rating
                      </span>
                      <span>•</span>
                      <span>Free to start</span>
                      <span>•</span>
                      <span>No card needed</span>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form 
                  onSubmit={handleAuthSubmit}
                  className="p-8 space-y-4"
                >
                  {authMode === "signup" && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-white/70">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          name="name"
                          type="text"
                          className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:opacity-50"
                          placeholder="What should we call you?"
                          required
                          disabled={isAuthLoading}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/70">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        name="email"
                        type="email"
                        className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:opacity-50"
                        placeholder="you@example.com"
                        required
                        disabled={isAuthLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/70">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        name="password"
                        type="password"
                        className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:opacity-50"
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                        disabled={isAuthLoading}
                      />
                    </div>
                  </div>

                  {/* Error Display */}
                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400"
                    >
                      {authError}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] text-white font-bold py-6 text-base border-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isAuthLoading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        {authMode === "login" ? "Sign In" : "Get Started Free"}
                      </>
                    )}
                  </Button>

                  {/* Toggle */}
                  <div className="text-center text-sm text-white/40">
                    {authMode === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <button 
                          type="button" 
                          onClick={() => {
                            setAuthMode("signup");
                            setAuthError("");
                          }} 
                          className="text-pink-400 hover:text-pink-300 font-medium disabled:opacity-50"
                          disabled={isAuthLoading}
                        >
                          Create one
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button 
                          type="button" 
                          onClick={() => {
                            setAuthMode("login");
                            setAuthError("");
                          }} 
                          className="text-pink-400 hover:text-pink-300 font-medium disabled:opacity-50"
                          disabled={isAuthLoading}
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Main App Component (shown when authenticated)
function MainApp() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard immediately when authenticated
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
      <div className="text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-pink-400 animate-pulse" />
        <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-white/60">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

