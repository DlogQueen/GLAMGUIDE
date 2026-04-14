'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, Camera, Award, Heart, MessageCircle, 
  Share2, Trash2, Edit2, Lock, Globe, Eye, Sparkles,
  Flame, Clock, Target, TrendingUp, Palette, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileService } from '@/services/profileService';
import { UserProfile, PortfolioLook, Comment, Achievement } from '@/types/profile';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [editing, setEditing] = useState(false);
  const [selectedLook, setSelectedLook] = useState<PortfolioLook | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const data = await ProfileService.getFullProfile(user.id);
    setProfile(data);
    setLoading(false);
  };

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
      <div className="min-h-screen dark-purple flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-fuchsia-400" />
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen dark-purple flex items-center justify-center text-white">
        <Card className="p-8 bg-white/5 border-white/10 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-fuchsia-400" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-white/60">Please sign in to view your profile</p>
        </Card>
      </div>
    );
  }

  const { personalInfo, stats, achievements, portfolio, settings } = profile;

  return (
    <div className="min-h-screen dark-purple text-white pb-20">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-fuchsia-900 via-purple-900 to-pink-900">
        {profile.coverPhoto ? (
          <img 
            src={profile.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-30" />
        )}
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {profile.headerStyle === 'quote' && profile.headerContent?.quote && (
            <p className="text-xl sm:text-2xl font-serif italic text-white/80 text-center px-4">
              "{profile.headerContent.quote}"
            </p>
          )}
          {profile.headerStyle === 'achievement' && profile.headerContent?.achievement && (
            <div className="text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-lg text-white/80">{profile.headerContent.achievement}</p>
            </div>
          )}
        </div>
        
        {/* Edit Cover Button */}
        <button className="absolute top-4 right-4 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="relative px-4 -mt-16 sm:-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-purple-900 shadow-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600">
                {profile.avatar.url ? (
                  <img 
                    src={profile.avatar.url} 
                    alt={personalInfo.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full p-6 text-white/60" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-fuchsia-500 rounded-full hover:bg-fuchsia-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {personalInfo.displayName}
                </h1>
                {personalInfo.verified && (
                  <span className="text-blue-400">✓</span>
                )}
              </div>
              <p className="text-white/60">@{personalInfo.username}</p>
              <p className="text-white/80 mt-2 max-w-md">{personalInfo.bio}</p>
              
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-white/60">
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {personalInfo.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(personalInfo.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditing(true)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center sm:justify-start gap-8 mt-6 py-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalLooksCreated}</p>
              <p className="text-sm text-white/60">Looks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.tutorialsCompleted}</p>
              <p className="text-sm text-white/60">Tutorials</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.followers}</p>
              <p className="text-sm text-white/60">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.following}</p>
              <p className="text-sm text-white/60">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-fuchsia-400">{stats.currentStreak}</p>
              <p className="text-sm text-white/60">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-fuchsia-500">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-fuchsia-500">
              Skills
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-fuchsia-500">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-fuchsia-500">
              Suggestions
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
                    <TrendingUp className="w-5 h-5 text-fuchsia-400" />
                    Overall Skill
                  </h3>
                  <span className="text-3xl font-bold text-fuchsia-400">
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
                  <Target className="w-5 h-5 text-yellow-400" />
                  Focus Areas
                </h3>
                <div className="space-y-2">
                  {stats.improvementAreas.map((area) => (
                    <div 
                      key={area}
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 rounded-lg"
                    >
                      <span className="capitalize text-yellow-400">{area}</span>
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
                      ? "bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30"
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
                  <Sparkles className="w-5 h-5 text-fuchsia-400" />
                  Recommended Tutorials
                </h3>
                <div className="space-y-2">
                  {profile.suggestions.tutorials.map((tutorial, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 text-sm">
                        {i + 1}
                      </span>
                      <p className="flex-1">{tutorial}</p>
                      <Button size="sm" className="bg-fuchsia-500 hover:bg-fuchsia-600">
                        Start
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Product Suggestions */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-400" />
                  Products for You
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.suggestions.products.map((product, i) => (
                    <div 
                      key={i}
                      className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20"
                    >
                      <p className="text-sm">{product}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Technique Suggestions */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Try These Techniques
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.suggestions.techniques.map((technique, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-full text-sm border border-cyan-500/20"
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
                          className="px-3 py-1 bg-fuchsia-500/10 text-fuchsia-400 rounded-full text-sm border border-fuchsia-500/20"
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
                      className="bg-fuchsia-500 hover:bg-fuchsia-600"
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
