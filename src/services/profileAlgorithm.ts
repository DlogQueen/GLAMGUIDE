// 🤖 PROFILE ALGORITHMS - Smart Suggestions & Habit Tracking

import { UserProfile, UserStats, PortfolioLook, Achievement, HabitTracking } from '@/types/profile';

// ============================================
// 1. HABIT TRACKING ALGORITHMS
// ============================================

export class HabitTracker {
  
  // Track daily practice and update streaks
  static recordPractice(profile: UserProfile, minutes: number): UserProfile {
    const today = new Date().toISOString().split('T')[0];
    const lastPractice = profile.stats.lastPracticeDate;
    
    let newStreak = profile.stats.currentStreak;
    
    // Check if this is consecutive day
    if (lastPractice) {
      const lastDate = new Date(lastPractice);
      const todayDate = new Date();
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1; // Continue streak
      } else if (diffDays > 1) {
        newStreak = 1; // Reset streak
      }
      // If same day, don't increment
    } else {
      newStreak = 1; // First practice
    }
    
    // Update practice heatmap
    const heatmap = profile.stats.practiceHeatmap || [];
    const todayEntry = heatmap.find(h => h.date === today);
    
    if (todayEntry) {
      todayEntry.minutes += minutes;
    } else {
      heatmap.push({ date: today, minutes });
    }
    
    // Keep only last 365 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 365);
    const filteredHeatmap = heatmap.filter(h => new Date(h.date) > cutoffDate);
    
    return {
      ...profile,
      stats: {
        ...profile.stats,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, profile.stats.longestStreak),
        lastPracticeDate: today,
        hoursPracticed: profile.stats.hoursPracticed + (minutes / 60),
        practiceHeatmap: filteredHeatmap
      }
    };
  }
  
  // Find optimal practice times based on user activity
  static analyzeOptimalTimes(heatmap: { date: string; minutes: number }[]): string[] {
    const hourCounts: { [hour: string]: number } = {};
    
    heatmap.forEach(entry => {
      const hour = entry.date.split('T')[1]?.split(':')[0] || '09';
      hourCounts[hour] = (hourCounts[hour] || 0) + entry.minutes;
    });
    
    // Sort by most productive hours
    return Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);
  }
  
  // Calculate weekly progress
  static getWeeklyProgress(profile: UserProfile): {
    goalDays: number;
    completedDays: number;
    percentage: number;
    isOnTrack: boolean;
  } {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyPractices = profile.stats.practiceHeatmap.filter(
      h => new Date(h.date) >= weekStart
    );
    
    const goalDays = profile.habitTracking.weeklyGoals.practiceDays;
    const completedDays = weeklyPractices.length;
    const percentage = Math.round((completedDays / goalDays) * 100);
    
    return {
      goalDays,
      completedDays,
      percentage,
      isOnTrack: percentage >= 70
    };
  }
  
  // Generate daily reminder message based on streak
  static getReminderMessage(streak: number, profile: UserProfile): string {
    const messages = {
      new: [
        "Start your makeup journey today! 💄",
        "5 minutes of practice can make a difference ✨",
        "Your glam journey begins now! 🌟"
      ],
      building: [
        `You're on a ${streak} day streak! Keep it up! 🔥`,
        "Consistency is key - you're doing great! 💪",
        "Your skills are growing every day! 📈"
      ],
      strong: [
        `Amazing ${streak} day streak! You're a makeup warrior! ⚔️`,
        "Unstoppable! Your dedication shows! 👑",
        "You're becoming a true artist! 🎨"
      ],
      master: [
        `LEGENDARY ${streak} day streak! You're incredible! 🏆`,
        "Master level dedication! Inspiring! ✨",
        "You're setting the standard! 👑"
      ]
    };
    
    let category: keyof typeof messages = 'new';
    if (streak >= 30) category = 'master';
    else if (streak >= 14) category = 'strong';
    else if (streak >= 3) category = 'building';
    
    const msgs = messages[category];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
}

// ============================================
// 2. SMART SUGGESTION ALGORITHMS
// ============================================

export class SuggestionEngine {
  
  // Generate personalized tutorial suggestions
  static generateTutorialSuggestions(profile: UserProfile): string[] {
    const suggestions: string[] = [];
    const { skills, improvementAreas, topTechniques } = profile.stats;
    const { learningGoals, skillLevel } = profile.preferences;
    
    // 1. Skill gap analysis - suggest tutorials for lowest skills
    const skillEntries = Object.entries(skills)
      .filter(([key]) => key !== 'overall')
      .sort((a, b) => a[1] - b[1]);
    
    const weakestSkills = skillEntries.slice(0, 3).map(([name]) => name);
    
    weakestSkills.forEach(skill => {
      suggestions.push(`Master ${skill}: ${this.getSkillTutorial(skill, skillLevel)}`);
    });
    
    // 2. Based on learning goals
    learningGoals.forEach(goal => {
      if (!topTechniques.includes(goal)) {
        suggestions.push(`Learn "${goal}" - Perfect for your goals!`);
      }
    });
    
    // 3. Next level progression
    if (skills.overall > 70 && skillLevel === 'intermediate') {
      suggestions.push("Ready for Advanced? Try: Complex Cut Creases");
    }
    
    // 4. Trending in user's style preference
    profile.preferences.favoriteStyles.forEach(style => {
      suggestions.push(`Trending in ${style}: New techniques to try`);
    });
    
    // 5. Seasonal suggestions
    const month = new Date().getMonth();
    if (month === 11 || month === 0) {
      suggestions.push("Holiday Glam: Festive makeup looks");
    } else if (month >= 5 && month <= 7) {
      suggestions.push("Summer Glow: Heat-proof makeup techniques");
    }
    
    return suggestions.slice(0, 5);
  }
  
  // Generate product recommendations
  static generateProductSuggestions(profile: UserProfile): string[] {
    const suggestions: string[] = [];
    const { skinProfile, preferences } = profile;
    
    // Based on skin type
    const skinTypeProducts: { [key: string]: string[] } = {
      'oily': ['Mattifying primer', 'Oil-free foundation', 'Setting powder'],
      'dry': ['Hydrating primer', 'Dewy foundation', 'Facial oil'],
      'combination': ['Balancing toner', 'Zone-specific primers', 'Lightweight moisturizer'],
      'sensitive': ['Gentle cleanser', 'Fragrance-free products', 'Calming serum']
    };
    
    const products = skinTypeProducts[skinProfile.skinType] || [];
    products.forEach(product => {
      suggestions.push(`${product} - Perfect for ${skinProfile.skinType} skin`);
    });
    
    // Based on concerns
    skinProfile.concerns.forEach(concern => {
      const solutions: { [key: string]: string } = {
        'acne': 'Non-comedogenic concealer',
        'dark circles': 'Color-correcting concealer',
        'aging': 'Anti-aging primer with peptides',
        'redness': 'Green color-correcting primer',
        'dullness': 'Illuminating primer or highlighter'
      };
      if (solutions[concern]) {
        suggestions.push(`${solutions[concern]} - For ${concern}`);
      }
    });
    
    // Based on preferred brands
    if (preferences.preferredBrands.length > 0) {
      const brand = preferences.preferredBrands[0];
      suggestions.push(`New from ${brand}: Check out their latest foundation range`);
    }
    
    return suggestions.slice(0, 4);
  }
  
  // Generate technique suggestions
  static generateTechniqueSuggestions(profile: UserProfile): string[] {
    const suggestions: string[] = [];
    const { stats, portfolio } = profile;
    
    // Analyze portfolio for missing techniques
    const usedTechniques = new Set<string>();
    portfolio.forEach(look => {
      look.techniques.forEach(t => usedTechniques.add(t));
    });
    
    const allTechniques = [
      'Baking', 'Strobing', 'Cut Crease', 'Smokey Eye', 'Winged Liner',
      'Contour & Highlight', 'Ombre Lips', 'Feathered Brows', 'Color Correcting',
      'Draping', 'Floating Liner', 'Negative Space'
    ];
    
    const missingTechniques = allTechniques.filter(t => !usedTechniques.has(t));
    
    // Suggest based on skill level
    const beginnerTechs = ['Baking', 'Color Correcting', 'Feathered Brows'];
    const intermediateTechs = ['Cut Crease', 'Smokey Eye', 'Contour & Highlight'];
    const advancedTechs = ['Draping', 'Floating Liner', 'Negative Space'];
    
    let techPool: string[] = [];
    if (stats.skills.overall < 40) techPool = beginnerTechs;
    else if (stats.skills.overall < 70) techPool = intermediateTechs;
    else techPool = advancedTechs;
    
    const availableTechs = techPool.filter(t => missingTechniques.includes(t));
    
    availableTechs.slice(0, 3).forEach(tech => {
      suggestions.push(`Try "${tech}" - Matches your skill level!`);
    });
    
    return suggestions;
  }
  
  // Generate style suggestions
  static generateStyleSuggestions(profile: UserProfile): string[] {
    const suggestions: string[] = [];
    const { favoriteStyles, avoidedColors } = profile.preferences;
    const { recommendedStyles } = profile.stats;
    
    // Complementary styles
    const styleComplements: { [key: string]: string[] } = {
      'korean-glass-skin': ['Gradient Lips', 'Puppy Eyes', 'Soft Blush'],
      'smokey-eye': ['Nude Lips', 'Contour', 'Defined Brows'],
      'natural': ['Glossy Lips', 'Light Highlight', 'Feathered Brows'],
      'glamorous': ['Glitter Cut Crease', 'Bold Lips', 'Lashes'],
      'bridal': ['Soft Glow', 'Waterproof', 'Long-lasting']
    };
    
    favoriteStyles.forEach(style => {
      const complements = styleComplements[style] || [];
      complements.forEach(comp => {
        if (!favoriteStyles.includes(comp.toLowerCase().replace(' ', '-'))) {
          suggestions.push(`${comp} - Perfect complement to ${style}`);
        }
      });
    });
    
    // Step out of comfort zone (avoided colors)
    if (avoidedColors.length > 0) {
      const color = avoidedColors[0];
      suggestions.push(`Challenge: Try a look with ${color} - You might love it!`);
    }
    
    // AI recommendations
    recommendedStyles.forEach(style => {
      if (!favoriteStyles.includes(style)) {
        suggestions.push(`Trending for you: ${style} - Based on your preferences`);
      }
    });
    
    return suggestions.slice(0, 4);
  }
  
  // Main suggestion generator
  static generateAllSuggestions(profile: UserProfile): UserProfile['suggestions'] {
    return {
      tutorials: this.generateTutorialSuggestions(profile),
      products: this.generateProductSuggestions(profile),
      techniques: this.generateTechniqueSuggestions(profile),
      styles: this.generateStyleSuggestions(profile),
      generatedAt: new Date().toISOString()
    };
  }
  
  // Helper: Get tutorial name based on skill
  private static getSkillTutorial(skill: string, level: string): string {
    const tutorials: { [key: string]: { [key: string]: string } } = {
      'eyeliner': {
        'beginner': 'Basic Winged Liner',
        'intermediate': 'Perfect Symmetrical Wings',
        'advanced': 'Graphic Floating Liner'
      },
      'eyeshadow': {
        'beginner': 'Simple One-Color Blend',
        'intermediate': 'Classic Smokey Eye',
        'advanced': 'Multi-Cut Crease Art'
      },
      'foundation': {
        'beginner': 'Finding Your Perfect Shade',
        'intermediate': 'Full Coverage Flawless Base',
        'advanced': 'Skin Texture Perfecting'
      }
      // Add more skills...
    };
    
    return tutorials[skill]?.[level] || `${skill} basics`;
  }
}

// ============================================
// 3. SKILL CALCULATION ALGORITHMS
// ============================================

export class SkillCalculator {
  
  // Calculate skill levels based on portfolio analysis
  static calculateSkills(portfolio: PortfolioLook[]): UserStats['skills'] {
    const skillScores: { [key: string]: number[] } = {
      foundation: [],
      concealer: [],
      powder: [],
      blush: [],
      bronzer: [],
      highlighter: [],
      eyeshadow: [],
      eyeliner: [],
      mascara: [],
      eyebrows: [],
      lips: [],
      contouring: []
    };
    
    // Analyze each look
    portfolio.forEach(look => {
      // Products used indicate skills
      look.productsUsed.forEach(product => {
        const category = product.category.toLowerCase();
        if (skillScores[category]) {
          // Base score for attempting
          skillScores[category].push(20);
        }
      });
      
      // Techniques indicate advanced skills
      look.techniques.forEach(tech => {
        const techSkillMap: { [key: string]: string[] } = {
          'eyeliner': ['Winged Liner', 'Graphic Liner', 'Tightlining'],
          'eyeshadow': ['Cut Crease', 'Smokey Eye', 'Halo Eye'],
          'contouring': ['Contour & Highlight', 'Nose Contour', 'Jawline'],
          'lips': ['Ombre Lips', 'Overlining', 'Lip Liner'],
          'eyebrows': ['Feathered Brows', 'Soap Brows', 'Microblading Effect']
        };
        
        Object.entries(techSkillMap).forEach(([skill, techniques]) => {
          if (techniques.includes(tech)) {
            skillScores[skill].push(40); // Higher score for techniques
          }
        });
      });
      
      // Difficulty bonus
      const difficultyBonus = {
        'beginner': 10,
        'intermediate': 25,
        'advanced': 50
      };
      
      look.productsUsed.forEach(product => {
        const category = product.category.toLowerCase();
        if (skillScores[category]) {
          skillScores[category].push(difficultyBonus[look.difficulty]);
        }
      });
    });
    
    // Calculate averages
    const skills: any = {};
    let totalScore = 0;
    let skillCount = 0;
    
    Object.entries(skillScores).forEach(([skill, scores]) => {
      if (scores.length > 0) {
        // Average with diminishing returns
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        // Apply curve: more looks = slower growth
        const curve = Math.min(1, Math.sqrt(scores.length) / 5);
        const finalScore = Math.min(100, avg * (0.7 + 0.3 * curve));
        
        skills[skill] = Math.round(finalScore);
        totalScore += skills[skill];
        skillCount++;
      } else {
        skills[skill] = 0;
      }
    });
    
    // Overall skill
    skills.overall = skillCount > 0 ? Math.round(totalScore / skillCount) : 0;
    
    return skills as UserStats['skills'];
  }
  
  // Identify improvement areas
  static identifyImprovementAreas(skills: UserStats['skills']): string[] {
    const skillEntries = Object.entries(skills)
      .filter(([key]) => key !== 'overall')
      .sort((a, b) => a[1] - b[1]);
    
    return skillEntries.slice(0, 3).map(([name]) => name);
  }
  
  // Identify top techniques
  static identifyTopTechniques(portfolio: PortfolioLook[]): string[] {
    const techniqueCounts: { [key: string]: number } = {};
    
    portfolio.forEach(look => {
      look.techniques.forEach(tech => {
        techniqueCounts[tech] = (techniqueCounts[tech] || 0) + 1;
      });
    });
    
    return Object.entries(techniqueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tech]) => tech);
  }
}

// ============================================
// 4. ACHIEVEMENT SYSTEM
// ============================================

export class AchievementManager {
  
  // Check and award achievements
  static checkAchievements(profile: UserProfile): Achievement[] {
    const newAchievements: Achievement[] = [];
    const stats = profile.stats;
    const portfolio = profile.portfolio;
    
    // Streak achievements
    const streakAchievements = [
      { days: 3, name: 'Getting Started', tier: 'bronze' as const },
      { days: 7, name: 'Week Warrior', tier: 'silver' as const },
      { days: 14, name: 'Two Week Wonder', tier: 'silver' as const },
      { days: 30, name: 'Monthly Master', tier: 'gold' as const },
      { days: 100, name: 'Century Club', tier: 'platinum' as const }
    ];
    
    streakAchievements.forEach(ach => {
      if (stats.currentStreak >= ach.days && 
          !profile.achievements.find(a => a.name === ach.name)) {
        newAchievements.push({
          id: `streak-${ach.days}`,
          name: ach.name,
          description: `Practiced makeup for ${ach.days} days in a row!`,
          icon: '🔥',
          color: '#f59e0b',
          tier: ach.tier,
          category: 'dedication',
          unlockedAt: new Date().toISOString(),
          progress: 100,
          maxProgress: 100
        });
      }
    });
    
    // Tutorial achievements
    const tutorialAchievements = [
      { count: 1, name: 'First Steps', tier: 'bronze' as const },
      { count: 5, name: 'Tutorial Taker', tier: 'bronze' as const },
      { count: 10, name: 'Dedicated Learner', tier: 'silver' as const },
      { count: 25, name: 'Knowledge Seeker', tier: 'gold' as const },
      { count: 50, name: 'Tutorial Master', tier: 'platinum' as const }
    ];
    
    tutorialAchievements.forEach(ach => {
      if (stats.tutorialsCompleted >= ach.count &&
          !profile.achievements.find(a => a.name === ach.name)) {
        newAchievements.push({
          id: `tutorial-${ach.count}`,
          name: ach.name,
          description: `Completed ${ach.count} tutorials!`,
          icon: '📚',
          color: '#3b82f6',
          tier: ach.tier,
          category: 'dedication',
          unlockedAt: new Date().toISOString(),
          progress: 100,
          maxProgress: 100
        });
      }
    });
    
    // Portfolio achievements
    const portfolioAchievements = [
      { count: 1, name: 'First Look', tier: 'bronze' as const },
      { count: 5, name: 'Portfolio Builder', tier: 'bronze' as const },
      { count: 10, name: 'Creative Collector', tier: 'silver' as const },
      { count: 25, name: 'Gallery Owner', tier: 'gold' as const },
      { count: 50, name: 'Portfolio Legend', tier: 'platinum' as const }
    ];
    
    portfolioAchievements.forEach(ach => {
      if (portfolio.length >= ach.count &&
          !profile.achievements.find(a => a.name === ach.name)) {
        newAchievements.push({
          id: `portfolio-${ach.count}`,
          name: ach.name,
          description: `Created ${ach.count} looks in your portfolio!`,
          icon: '📸',
          color: '#ec4899',
          tier: ach.tier,
          category: 'skill',
          unlockedAt: new Date().toISOString(),
          progress: 100,
          maxProgress: 100
        });
      }
    });
    
    // Social achievements
    if (stats.followers >= 10 && !profile.achievements.find(a => a.name === 'Rising Star')) {
      newAchievements.push({
        id: 'social-10',
        name: 'Rising Star',
        description: 'Reached 10 followers!',
        icon: '⭐',
        color: '#fbbf24',
        tier: 'bronze',
        category: 'social',
        unlockedAt: new Date().toISOString(),
        progress: 100,
        maxProgress: 100
      });
    }
    
    if (stats.totalLikes >= 50 && !profile.achievements.find(a => a.name === 'Liked & Loved')) {
      newAchievements.push({
        id: 'social-likes-50',
        name: 'Liked & Loved',
        description: 'Received 50 likes on your looks!',
        icon: '❤️',
        color: '#ef4444',
        tier: 'silver',
        category: 'social',
        unlockedAt: new Date().toISOString(),
        progress: 100,
        maxProgress: 100
      });
    }
    
    return newAchievements;
  }
  
  // Update achievement progress
  static updateAchievementProgress(
    achievements: Achievement[], 
    achievementId: string, 
    progress: number
  ): Achievement[] {
    return achievements.map(ach => {
      if (ach.id === achievementId) {
        return {
          ...ach,
          progress: Math.min(progress, ach.maxProgress),
          unlockedAt: progress >= ach.maxProgress && !ach.unlockedAt 
            ? new Date().toISOString() 
            : ach.unlockedAt
        };
      }
      return ach;
    });
  }
}

// ============================================
// 5. COMMENT MANAGEMENT
// ============================================

export class CommentManager {
  
  // Add comment to a look
  static addComment(
    look: PortfolioLook, 
    userId: string, 
    username: string, 
    text: string,
    userAvatar?: string
  ): PortfolioLook {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId,
      username,
      userAvatar,
      text,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    return {
      ...look,
      comments: [...look.comments, newComment]
    };
  }
  
  // Delete comment (soft delete - hides but preserves)
  static deleteComment(look: PortfolioLook, commentId: string, userId: string): PortfolioLook {
    // Check if user owns the comment or the look
    const canDelete = look.userId === userId || 
      look.comments.find(c => c.id === commentId)?.userId === userId;
    
    if (!canDelete) {
      throw new Error('Not authorized to delete this comment');
    }
    
    return {
      ...look,
      comments: look.comments.map(c => 
        c.id === commentId 
          ? { ...c, isDeleted: true, text: '[deleted]' }
          : c
      )
    };
  }
  
  // Hard delete comment (admin only)
  static hardDeleteComment(look: PortfolioLook, commentId: string): PortfolioLook {
    return {
      ...look,
      comments: look.comments.filter(c => c.id !== commentId)
    };
  }
  
  // Like comment
  static likeComment(look: PortfolioLook, commentId: string): PortfolioLook {
    return {
      ...look,
      comments: look.comments.map(c => 
        c.id === commentId 
          ? { ...c, likes: c.likes + 1 }
          : c
      )
    };
  }
  
  // Edit comment
  static editComment(
    look: PortfolioLook, 
    commentId: string, 
    userId: string, 
    newText: string
  ): PortfolioLook {
    const comment = look.comments.find(c => c.id === commentId);
    
    if (!comment || comment.userId !== userId) {
      throw new Error('Not authorized to edit this comment');
    }
    
    return {
      ...look,
      comments: look.comments.map(c => 
        c.id === commentId 
          ? { ...c, text: newText }
          : c
      )
    };
  }
  
  // Reply to comment
  static replyToComment(
    look: PortfolioLook,
    parentCommentId: string,
    userId: string,
    username: string,
    text: string,
    userAvatar?: string
  ): PortfolioLook {
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      userId,
      username,
      userAvatar,
      text,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    return {
      ...look,
      comments: look.comments.map(c => 
        c.id === parentCommentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      )
    };
  }
  
  // Get active comments (non-deleted)
  static getActiveComments(look: PortfolioLook): Comment[] {
    return look.comments.filter(c => !c.isDeleted);
  }
  
  // Get comment count
  static getCommentCount(look: PortfolioLook): number {
    return this.getActiveComments(look).length;
  }
}

// Export all managers
export const ProfileAlgorithms = {
  HabitTracker,
  SuggestionEngine,
  SkillCalculator,
  AchievementManager,
  CommentManager
};
