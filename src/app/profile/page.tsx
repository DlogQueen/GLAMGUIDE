'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, Camera, Award, Heart, MessageCircle, 
  Share2, Trash2, Edit2, Lock, Globe, Eye, Sparkles,
  Flame, Clock, Target, TrendingUp, Palette, Crown,
  LayoutGrid, Bookmark, Trophy, Users, Play, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileService } from '@/services/profileService';
import { UserProfile, PortfolioLook, Comment, Achievement } from '@/types/profile';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/makeup/AuthModal';
import Link from 'next/link';
import { BottomNav } from '@/components/nav/BottomNav';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    instagram: '',
    tiktok: '',
    youtube: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedLook, setSelectedLook] = useState<PortfolioLook | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);
  
  // Color themes matching the PNG design
  const themes = [
    { name: 'Viola', gradient: 'from-purple-900 via-violet-800 to-indigo-900', accent: 'purple' },
    { name: 'Strawberry Pink', gradient: 'from-pink-900 via-rose-800 to-fuchsia-900', accent: 'pink' },
    { name: 'LA Sunset', gradient: 'from-orange-900 via-amber-800 to-rose-900', accent: 'orange' },
    { name: 'Hot Pink', gradient: 'from-fuchsia-900 via-pink-800 to-rose-900', accent: 'fuchsia' }
  ];

  const loadProfile = async () => {
    if (!user) return;
    const existing = await ProfileService.getFullProfile(user.id);
    if (existing) {
      setProfile(existing);
      setLoading(false);
      return;
    }

    // If the profile tables are deployed, create on first login.
    const created = await ProfileService.createProfile(user.id, user.email || `user_${user.id}@beta.local`);
    setProfile(created);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDeleteLook = async (lookId: string) => {
    if (!user || !confirm('Delete this look?')) return;
    
    const success = await ProfileService.deleteLook(lookId, user.id);
    if (success) {
      setProfile(prev => prev ? {
        ...prev,
        portfolio: prev.portfolio.filter(l => l.id !== lookId)
      } : null);
    }
  };

  const openEditModal = () => {
    if (!profile) return;
    setEditFormData({
      displayName: profile.personalInfo.displayName || '',
      username: profile.personalInfo.username || '',
      bio: profile.personalInfo.bio || '',
      location: profile.personalInfo.location || '',
      website: profile.personalInfo.website || '',
      instagram: profile.personalInfo.instagram || '',
      tiktok: profile.personalInfo.tiktok || '',
      youtube: profile.personalInfo.youtube || ''
    });
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    
    const success = await ProfileService.updatePersonalInfo(user.id, {
      displayName: editFormData.displayName,
      username: editFormData.username,
      bio: editFormData.bio,
      location: editFormData.location,
      website: editFormData.website,
      instagram: editFormData.instagram,
      tiktok: editFormData.tiktok,
      youtube: editFormData.youtube
    });
    
    if (success) {
      await loadProfile();
      setEditing(false);
    } else {
      alert('Failed to save profile. Please try again.');
    }
    setIsSaving(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditFormData({
      displayName: '',
      username: '',
      bio: '',
      location: '',
      website: '',
      instagram: '',
      tiktok: '',
      youtube: ''
    });
  };

  const handleAddComment = async (lookId: string) => {
    if (!user || !newComment.trim()) return;
    
    const comment = await ProfileService.addComment(
      lookId, 
      user.id, 
      profile?.personalInfo.displayName || 'Anonymous',
      newComment,
      profile?.avatar.url
    );
    
    if (comment) {
      setProfile(prev => prev ? {
        ...prev,
        portfolio: prev.portfolio.map(l => 
          l.id === lookId 
            ? { ...l, comments: [...l.comments, comment] }
            : l
        )
      } : null);
      setNewComment('');
    }
  };

  const handleDeleteComment = async (lookId: string, commentId: string) => {
    if (!user) return;
    
    const success = await ProfileService.deleteComment(commentId, user.id);
    if (success) {
      setProfile(prev => prev ? {
        ...prev,
        portfolio: prev.portfolio.map(l => 
          l.id === lookId 
            ? { ...l, comments: l.comments.filter(c => c.id !== commentId) }
            : l
        )
      } : null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-pink-400" />
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white">
        <Card className="p-8 bg-white/5 border-white/10 text-center max-w-md">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-pink-400" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-white/60 mb-6">Please sign in to view your profile</p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 hover:shadow-lg hover:shadow-pink-500/30 text-white"
          >
            Sign In
          </Button>
        </Card>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} redirectTo="/profile" />
      </div>
    );
  }

  const { personalInfo, stats, achievements, portfolio, settings } = profile;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden selection:bg-pink-500/30">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <img 
                src="/images/logo.png" 
                alt="Glam Guide AI" 
                className="h-10 w-auto hover:scale-105 transition-transform"
              />
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      {/* Cover Photo with Color Themes */}
      <div className="relative h-64 sm:h-80">
        {/* Background gradient based on selected theme */}
        <div className={`absolute inset-0 bg-gradient-to-br ${themes[selectedTheme].gradient}`} />
        
        {/* Photos overlaying background (matching PNG design) */}
        <div className="absolute inset-0 overflow-hidden">
          {portfolio.slice(0, 4).map((look, i) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="absolute rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
              style={{
                width: '140px',
                height: '140px',
                top: `${20 + (i % 2) * 20}%`,
                left: `${10 + Math.floor(i / 2) * 45}%`
              }}
            >
              <img 
                src={look.afterPhoto} 
                alt={look.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
        
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        
        {/* Theme selector dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {themes.map((theme, i) => (
            <button
              key={i}
              onClick={() => setSelectedTheme(i)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedTheme === i 
                  ? 'scale-125 border-white shadow-lg shadow-white/20' 
                  : 'border-white/30 opacity-60 hover:opacity-100'
              } ${theme.accent === 'purple' ? 'bg-purple-500' : 
                theme.accent === 'pink' ? 'bg-pink-500' : 
                theme.accent === 'orange' ? 'bg-orange-500' : 'bg-fuchsia-500'}`}
              title={theme.name}
            />
          ))}
        </div>
        
        {/* Edit Cover Button */}
        <button className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/10 z-10">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Instagram-Style Profile Header */}
      <div className="relative px-4 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            {/* Circular Avatar - Left Side */}
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-500 p-1 bg-gradient-to-br from-pink-500 via-purple-500 to-fuchsia-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0f]">
                    {profile.avatar.url ? (
                      <img 
                        src={profile.avatar.url} 
                        alt={personalInfo.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                        <User className="w-16 h-16 text-white/60" />
                      </div>
                    )}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-br from-pink-500 to-fuchsia-500 rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all border-2 border-[#0a0a0f]">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Info - Right Side */}
            <div className="flex-1 text-center sm:text-left">
              {/* Username & Actions Row */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {personalInfo.username}
                </h1>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={openEditModal}
                    className="border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm font-semibold"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats Row - Instagram Style */}
              <div className="flex justify-center sm:justify-start gap-6 sm:gap-8 mb-4">
                <div className="text-center">
                  <span className="font-bold text-lg">{stats.totalLooksCreated}</span>
                  <p className="text-sm text-white/60">looks</p>
                </div>
                <div className="text-center">
                  <span className="font-bold text-lg">{stats.followers}</span>
                  <p className="text-sm text-white/60">followers</p>
                </div>
                <div className="text-center">
                  <span className="font-bold text-lg">{stats.following}</span>
                  <p className="text-sm text-white/60">following</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-1">
                <p className="font-semibold">{personalInfo.displayName}</p>
                <p className="text-white/80 whitespace-pre-wrap">{personalInfo.bio}</p>
                {personalInfo.location && (
                  <p className="text-sm text-white/50 flex items-center justify-center sm:justify-start gap-1">
                    <Globe className="w-3 h-3" />
                    {personalInfo.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Story Highlights - MySpace/Instagram Style */}
          <div className="flex gap-4 mt-8 overflow-x-auto pb-2">
            {[
              { name: "Signature Styles", icon: Sparkles },
              { name: "My Go-To Palette", icon: Palette },
              { name: "Beauty Profile", icon: User },
              { name: "Tutorials", icon: Play },
              { name: "Achievements", icon: Award },
            ].map((highlight, i) => (
              <button
                key={i}
                className="flex flex-col items-center gap-1 min-w-[70px]"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center hover:border-pink-500/50 transition-colors">
                  <highlight.icon className="w-6 h-6 text-pink-400" />
                </div>
                <span className="text-xs text-white/60 truncate max-w-[70px]">{highlight.name}</span>
              </button>
            ))}
            <button className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center hover:border-pink-500/50 transition-colors">
                <span className="text-2xl text-white/40">+</span>
              </div>
              <span className="text-xs text-white/60">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Instagram Style Grid */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex justify-center gap-8 bg-transparent border-t border-white/10 rounded-none h-12">
            <TabsTrigger 
              value="portfolio" 
              className="flex items-center gap-2 data-[state=active]:border-t-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent rounded-none px-4 text-white/60 hover:text-white transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium uppercase tracking-wider">Looks</span>
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="flex items-center gap-2 data-[state=active]:border-t-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent rounded-none px-4 text-white/60 hover:text-white transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium uppercase tracking-wider">Saved</span>
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex items-center gap-2 data-[state=active]:border-t-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent rounded-none px-4 text-white/60 hover:text-white transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium uppercase tracking-wider">Achievements</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tagged" 
              className="flex items-center gap-2 data-[state=active]:border-t-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-400 data-[state=active]:bg-transparent rounded-none px-4 text-white/60 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium uppercase tracking-wider">Tagged</span>
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {portfolio.map((look) => (
                <motion.div
                  key={look.id}
                  layoutId={look.id}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedLook(look)}
                >
                  <img 
                    src={look.afterPhoto} 
                    alt={look.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-medium text-sm">{look.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {look.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {look.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLook(look.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {look.featured && (
                    <div className="absolute top-2 left-2 p-1.5 bg-yellow-500 rounded-full">
                      <Crown className="w-4 h-4 text-black" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {portfolio.length === 0 && (
              <div className="text-center py-12 text-white/40">
                <Camera className="w-12 h-12 mx-auto mb-4" />
                <p>No looks yet. Create your first look!</p>
              </div>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Overall Skill */}
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                    Overall Skill
                  </h3>
                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {stats.skills.overall}%
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.skills.overall}%` }}
                  />
                </div>
              </Card>

              {/* Improvement Areas */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-rose-400" />
                  Focus Areas
                </h3>
                <div className="space-y-2">
                  {stats.improvementAreas.map((area) => (
                    <div 
                      key={area}
                      className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 rounded-lg border border-rose-500/20"
                    >
                      <span className="capitalize text-rose-400">{area}</span>
                      <span className="text-white/40 text-sm">
                        {stats.skills[area as keyof typeof stats.skills]}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Individual Skills */}
              {Object.entries(stats.skills)
                .filter(([key]) => key !== 'overall')
                .map(([skill, value]) => (
                  <Card key={skill} className="p-4 bg-white/5 border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize text-sm">{skill}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "p-4 rounded-xl text-center transition-all",
                    achievement.unlockedAt 
                      ? "bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-fuchsia-500/20 border border-pink-500/30"
                      : "bg-white/5 border border-white/10 opacity-50"
                  )}
                >
                  <div 
                    className="text-4xl mb-2"
                    style={{ color: achievement.color }}
                  >
                    {achievement.icon}
                  </div>
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-white/40 mt-1 capitalize">
                    {achievement.tier}
                  </p>
                  {!achievement.unlockedAt && (
                    <div className="mt-2">
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white/30 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="mt-6">
            <div className="space-y-6">
              {/* Tutorial Suggestions */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  Recommended Tutorials
                </h3>
                <div className="space-y-2">
                  {profile.suggestions.tutorials.map((tutorial, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
                    >
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
                        {i + 1}
                      </span>
                      <p className="flex-1">{tutorial}</p>
                      <Button size="sm" className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg hover:shadow-pink-500/30">
                        Start
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Product Suggestions */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-rose-400" />
                  Products for You
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.suggestions.products.map((product, i) => (
                    <div 
                      key={i}
                      className="p-3 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-lg border border-rose-500/20"
                    >
                      <p className="text-sm">{product}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Technique Suggestions */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-fuchsia-400" />
                  Try These Techniques
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.suggestions.techniques.map((technique, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-full text-sm border border-fuchsia-500/20"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Look Detail Modal */}
      <AnimatePresence>
        {selectedLook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLook(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a0a2e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Look Image */}
              <div className="relative aspect-video">
                <img 
                  src={selectedLook.afterPhoto} 
                  alt={selectedLook.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedLook(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              {/* Look Details */}
              <div className="p-6">
                <h2 className="text-2xl font-bold">{selectedLook.title}</h2>
                <p className="text-white/60 mt-1">{selectedLook.description}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" /> {selectedLook.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" /> {selectedLook.comments.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {selectedLook.timeSpent} min
                  </span>
                  <span className="capitalize">{selectedLook.difficulty}</span>
                </div>

                {/* Products */}
                {selectedLook.productsUsed.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-white/80 mb-2">Products Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLook.productsUsed.map((product, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-white/10 rounded-full text-sm"
                        >
                          {product.name} {product.shade && `(${product.shade})`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Techniques */}
                {selectedLook.techniques.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-white/80 mb-2">Techniques</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLook.techniques.map((technique, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 text-fuchsia-400 rounded-full text-sm border border-fuchsia-500/20"
                        >
                          {technique}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div className="mt-6 border-t border-white/10 pt-6">
                  <h4 className="font-medium mb-4">Comments</h4>
                  
                  {/* Add Comment */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40"
                    />
                    <Button 
                      onClick={() => handleAddComment(selectedLook.id)}
                      className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg hover:shadow-pink-500/30"
                    >
                      Post
                    </Button>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-3">
                    {selectedLook.comments
                      .filter(c => !c.isDeleted)
                      .map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center text-sm font-medium">
                            {comment.username[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.username}</span>
                              <span className="text-xs text-white/40">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-white/80 mt-1">{comment.text}</p>
                            
                            {/* Delete Button (if owner) */}
                            {comment.userId === user?.id && (
                              <button
                                onClick={() => handleDeleteComment(selectedLook.id, comment.id)}
                                className="text-xs text-red-400 hover:text-red-300 mt-1"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      {editing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleCancelEdit}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-sm text-white/60 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editFormData.displayName}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50"
                  placeholder="Your name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm text-white/60 mb-1">Username</label>
                <input
                  type="text"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50"
                  placeholder="@username"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm text-white/60 mb-1">Bio</label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 min-h-[100px] resize-none"
                  placeholder="Tell us about yourself..."
                  maxLength={150}
                />
                <p className="text-xs text-white/40 mt-1">{editFormData.bio.length}/150</p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-white/60 mb-1">Location</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50"
                  placeholder="City, Country"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm text-white/60 mb-1">Website</label>
                <input
                  type="text"
                  value={editFormData.website}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={editFormData.instagram}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 text-sm"
                    placeholder="@handle"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">TikTok</label>
                  <input
                    type="text"
                    value={editFormData.tiktok}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, tiktok: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 text-sm"
                    placeholder="@handle"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">YouTube</label>
                  <input
                    type="text"
                    value={editFormData.youtube}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, youtube: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 text-sm"
                    placeholder="@channel"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg hover:shadow-pink-500/30"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}

// Add missing Calendar icon component
function Calendar({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
