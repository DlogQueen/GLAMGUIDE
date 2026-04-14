// 👤 PROFILE SERVICE - Complete User Profile Management

import { supabase } from '@/lib/supabase';
import { 
  UserProfile, 
  PersonalInfo, 
  SkinProfile, 
  MakeupPreferences,
  PortfolioLook,
  Achievement,
  UserStats,
  Comment,
  HabitTracking
} from '@/types/profile';
import { ProfileAlgorithms } from './profileAlgorithm';

const { HabitTracker, SuggestionEngine, SkillCalculator, AchievementManager, CommentManager } = ProfileAlgorithms;

// ============================================
// PROFILE CRUD OPERATIONS
// ============================================

export class ProfileService {
  
  // Create new profile on signup
  static async createProfile(userId: string, email: string): Promise<UserProfile | null> {
    try {
      // Create main profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          user_id: userId,
          email,
          display_name: email.split('@')[0],
          username: `user_${userId.slice(0, 8)}`,
          profile_theme: 'glamorous',
          profile_layout: 'grid'
        }])
        .select()
        .single();
      
      if (profileError) throw profileError;
      
      // Create related records
      await Promise.all([
        supabase.from('skin_profiles').insert([{ user_id: userId }]),
        supabase.from('makeup_preferences').insert([{ user_id: userId }]),
        supabase.from('user_stats').insert([{ user_id: userId }]),
        supabase.from('habit_tracking').insert([{ user_id: userId }]),
        this.initializeAchievements(userId)
      ]);
      
      return this.getFullProfile(userId);
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  }
  
  // Get complete profile with all related data
  static async getFullProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Fetch all profile data in parallel
      const [
        { data: profile },
        { data: skinProfile },
        { data: preferences },
        { data: stats },
        { data: habitTracking },
        { data: achievements },
        { data: portfolio },
        { data: savedTutorials },
        { data: favoriteProducts }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.from('skin_profiles').select('*').eq('user_id', userId).single(),
        supabase.from('makeup_preferences').select('*').eq('user_id', userId).single(),
        supabase.from('user_stats').select('*').eq('user_id', userId).single(),
        supabase.from('habit_tracking').select('*').eq('user_id', userId).single(),
        supabase.from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', userId),
        supabase.from('portfolio_looks')
          .select('*, look_products(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase.from('saved_tutorials')
          .select('tutorial_id')
          .eq('user_id', userId),
        supabase.from('favorite_products')
          .select('*')
          .eq('user_id', userId)
      ]);
      
      if (!profile) return null;
      
      // Transform to UserProfile type
      return {
        id: profile.id,
        userId: profile.user_id,
        email: profile.email,
        
        avatar: {
          url: profile.avatar_url,
          type: profile.avatar_type,
          frame: profile.avatar_frame
        },
        
        coverPhoto: profile.cover_photo_url,
        headerStyle: profile.header_style,
        headerContent: profile.header_content,
        
        personalInfo: {
          displayName: profile.display_name,
          username: profile.username,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          instagram: profile.instagram,
          tiktok: profile.tiktok,
          youtube: profile.youtube,
          joinedDate: profile.created_at,
          lastActive: profile.last_active,
          accountType: profile.account_type,
          verified: profile.verified
        },
        
        skinProfile: {
          skinType: skinProfile?.skin_type,
          skinTone: skinProfile?.skin_tone,
          undertone: skinProfile?.undertone,
          concerns: skinProfile?.concerns || [],
          faceShape: skinProfile?.face_shape,
          eyeShape: skinProfile?.eye_shape,
          lipShape: skinProfile?.lip_shape,
          foundationShade: skinProfile?.foundation_shade,
          concealerShade: skinProfile?.concealer_shade,
          powderShade: skinProfile?.powder_shade,
          analysisConfidence: skinProfile?.analysis_confidence || {}
        },
        
        preferences: {
          favoriteStyles: preferences?.favorite_styles || [],
          preferredBrands: preferences?.preferred_brands || [],
          budgetRange: preferences?.budget_range,
          morningRoutine: preferences?.morning_routine,
          eveningRoutine: preferences?.evening_routine,
          weekendStyle: preferences?.weekend_style,
          preferredFinish: preferences?.preferred_finish,
          coverageLevel: preferences?.coverage_level,
          crueltyFree: preferences?.cruelty_free,
          vegan: preferences?.vegan,
          favoriteColors: preferences?.favorite_colors || [],
          avoidedColors: preferences?.avoided_colors || [],
          skillLevel: preferences?.skill_level,
          learningGoals: preferences?.learning_goals || [],
          preferredTutorialLength: preferences?.preferred_tutorial_length
        },
        
        settings: {
          theme: profile.profile_theme,
          layout: profile.profile_layout,
          accentColor: profile.accent_color,
          emailNotifications: profile.email_notifications,
          pushNotifications: profile.push_notifications,
          tutorialReminders: profile.tutorial_reminders,
          weeklyDigest: profile.weekly_digest,
          achievementNotifications: profile.achievement_notifications,
          profileVisibility: profile.profile_visibility,
          showEmail: profile.show_email,
          showLocation: profile.show_location,
          allowComments: profile.allow_comments,
          allowSharing: profile.allow_sharing,
          allowSuggestions: profile.allow_suggestions,
          autoSaveLooks: true,
          arMirrorMode: 'front',
          highQualityAR: true,
          dataSaver: false
        },
        
        stats: {
          totalLooksCreated: stats?.total_looks_created || 0,
          tutorialsCompleted: stats?.tutorials_completed || 0,
          tutorialsStarted: stats?.tutorials_started || 0,
          hoursPracticed: stats?.hours_practiced || 0,
          currentStreak: stats?.current_streak || 0,
          longestStreak: stats?.longest_streak || 0,
          lastPracticeDate: stats?.last_practice_date,
          skills: {
            foundation: stats?.skill_foundation || 0,
            concealer: stats?.skill_concealer || 0,
            powder: stats?.skill_powder || 0,
            blush: stats?.skill_blush || 0,
            bronzer: stats?.skill_bronzer || 0,
            highlighter: stats?.skill_highlighter || 0,
            eyeshadow: stats?.skill_eyeshadow || 0,
            eyeliner: stats?.skill_eyeliner || 0,
            mascara: stats?.skill_mascara || 0,
            eyebrows: stats?.skill_eyebrows || 0,
            lips: stats?.skill_lips || 0,
            contouring: stats?.skill_contouring || 0,
            overall: stats?.skill_overall || 0
          },
          followers: stats?.followers_count || 0,
          following: stats?.following_count || 0,
          totalLikes: stats?.total_likes_received || 0,
          totalComments: stats?.total_comments_received || 0,
          featuredLooks: stats?.featured_looks_count || 0,
          topTechniques: stats?.top_techniques || [],
          improvementAreas: stats?.improvement_areas || [],
          recommendedStyles: stats?.recommended_styles || [],
          practiceHeatmap: stats?.practice_heatmap || []
        },
        
        habitTracking: {
          dailyGoals: {
            practiceMinutes: habitTracking?.daily_practice_minutes || 15,
            tutorialsCompleted: habitTracking?.daily_tutorials_target || 1,
            looksCreated: habitTracking?.daily_looks_target || 0
          },
          weeklyGoals: {
            practiceDays: habitTracking?.weekly_practice_days || 3,
            newTechniques: habitTracking?.weekly_new_techniques || 1,
            productsTried: habitTracking?.weekly_products_tried || 2
          },
          monthlyGoals: {
            tutorialsCompleted: habitTracking?.monthly_tutorials_target || 5,
            looksCreated: habitTracking?.monthly_looks_target || 3,
            skillImprovement: habitTracking?.monthly_skill_improvement || 10
          },
          reminders: {
            enabled: habitTracking?.reminders_enabled || true,
            time: habitTracking?.reminder_time || '09:00',
            days: habitTracking?.reminder_days || [1, 2, 3, 4, 5],
            message: HabitTracker.getReminderMessage(stats?.current_streak || 0, {} as UserProfile)
          },
          optimalPracticeTimes: habitTracking?.optimal_practice_times || [],
          preferredTutorialTypes: habitTracking?.preferred_tutorial_types || [],
          productiveDays: habitTracking?.productive_days || []
        },
        
        achievements: achievements?.map((ua: any) => ({
          id: ua.achievement_id,
          name: ua.achievements.name,
          description: ua.achievements.description,
          icon: ua.achievements.icon,
          color: ua.achievements.color,
          tier: ua.achievements.tier,
          category: ua.achievements.category,
          unlockedAt: ua.unlocked_at,
          progress: ua.progress,
          maxProgress: ua.max_progress
        })) || [],
        
        portfolio: portfolio?.map((look: any) => ({
          id: look.id,
          userId: look.user_id,
          title: look.title,
          description: look.description,
          style: look.style,
          date: look.created_at,
          beforePhoto: look.before_photo_url,
          afterPhoto: look.after_photo_url,
          processPhotos: look.process_photos || [],
          arTryOnScreenshot: look.ar_tryon_screenshot_url,
          productsUsed: look.look_products?.map((p: any) => ({
            name: p.name,
            brand: p.brand,
            shade: p.shade,
            category: p.category
          })) || [],
          techniques: look.techniques || [],
          inspiration: look.inspiration,
          difficulty: look.difficulty,
          timeSpent: look.time_spent,
          skinCondition: look.skin_condition,
          likes: look.likes_count,
          comments: [], // Loaded separately
          shares: look.shares_count,
          isPublic: look.is_public,
          featured: look.featured,
          tags: look.tags || []
        })) || [],
        
        savedTutorials: savedTutorials?.map((st: any) => st.tutorial_id) || [],
        favoriteProducts: favoriteProducts || [],
        
        suggestions: SuggestionEngine.generateAllSuggestions({
          id: '',
          userId,
          email: profile.email,
          avatar: { url: profile.avatar_url, type: profile.avatar_type },
          personalInfo: { displayName: profile.display_name, username: profile.username, bio: profile.bio, location: profile.location, website: profile.website, instagram: profile.instagram, tiktok: profile.tiktok, youtube: profile.youtube, joinedDate: profile.created_at, lastActive: profile.last_active, accountType: profile.account_type, verified: profile.verified },
          skinProfile: { skinType: skinProfile?.skin_type, skinTone: skinProfile?.skin_tone, undertone: skinProfile?.undertone, concerns: skinProfile?.concerns || [], faceShape: skinProfile?.face_shape, eyeShape: skinProfile?.eye_shape, lipShape: skinProfile?.lip_shape, foundationShade: skinProfile?.foundation_shade, concealerShade: skinProfile?.concealer_shade, powderShade: skinProfile?.powder_shade, analysisConfidence: skinProfile?.analysis_confidence || {} },
          preferences: { favoriteStyles: preferences?.favorite_styles || [], preferredBrands: preferences?.preferred_brands || [], budgetRange: preferences?.budget_range, morningRoutine: preferences?.morning_routine, eveningRoutine: preferences?.evening_routine, weekendStyle: preferences?.weekend_style, preferredFinish: preferences?.preferred_finish, coverageLevel: preferences?.coverage_level, crueltyFree: preferences?.cruelty_free, vegan: preferences?.vegan, favoriteColors: preferences?.favorite_colors || [], avoidedColors: preferences?.avoided_colors || [], skillLevel: preferences?.skill_level, learningGoals: preferences?.learning_goals || [], preferredTutorialLength: preferences?.preferred_tutorial_length },
          settings: { theme: profile.profile_theme, layout: profile.profile_layout, accentColor: profile.accent_color, emailNotifications: profile.email_notifications, pushNotifications: profile.push_notifications, tutorialReminders: profile.tutorial_reminders, weeklyDigest: profile.weekly_digest, achievementNotifications: profile.achievement_notifications, profileVisibility: profile.profile_visibility, showEmail: profile.show_email, showLocation: profile.show_location, allowComments: profile.allow_comments, allowSharing: profile.allow_sharing, allowSuggestions: profile.allow_suggestions, autoSaveLooks: true, arMirrorMode: 'front', highQualityAR: true, dataSaver: false },
          stats: { totalLooksCreated: stats?.total_looks_created || 0, tutorialsCompleted: stats?.tutorials_completed || 0, tutorialsStarted: stats?.tutorials_started || 0, hoursPracticed: stats?.hours_practiced || 0, currentStreak: stats?.current_streak || 0, longestStreak: stats?.longest_streak || 0, lastPracticeDate: stats?.last_practice_date, skills: { foundation: stats?.skill_foundation || 0, concealer: stats?.skill_concealer || 0, powder: stats?.skill_powder || 0, blush: stats?.skill_blush || 0, bronzer: stats?.skill_bronzer || 0, highlighter: stats?.skill_highlighter || 0, eyeshadow: stats?.skill_eyeshadow || 0, eyeliner: stats?.skill_eyeliner || 0, mascara: stats?.skill_mascara || 0, eyebrows: stats?.skill_eyebrows || 0, lips: stats?.skill_lips || 0, contouring: stats?.skill_contouring || 0, overall: stats?.skill_overall || 0 }, followers: stats?.followers_count || 0, following: stats?.following_count || 0, totalLikes: stats?.total_likes_received || 0, totalComments: stats?.total_comments_received || 0, featuredLooks: stats?.featured_looks_count || 0, topTechniques: stats?.top_techniques || [], improvementAreas: stats?.improvement_areas || [], recommendedStyles: stats?.recommended_styles || [], practiceHeatmap: stats?.practice_heatmap || [] },
          habitTracking: { dailyGoals: { practiceMinutes: habitTracking?.daily_practice_minutes || 15, tutorialsCompleted: habitTracking?.daily_tutorials_target || 1, looksCreated: habitTracking?.daily_looks_target || 0 }, weeklyGoals: { practiceDays: habitTracking?.weekly_practice_days || 3, newTechniques: habitTracking?.weekly_new_techniques || 1, productsTried: habitTracking?.weekly_products_tried || 2 }, monthlyGoals: { tutorialsCompleted: habitTracking?.monthly_tutorials_target || 5, looksCreated: habitTracking?.monthly_looks_target || 3, skillImprovement: habitTracking?.monthly_skill_improvement || 10 }, reminders: { enabled: habitTracking?.reminders_enabled || true, time: habitTracking?.reminder_time || '09:00', days: habitTracking?.reminder_days || [1, 2, 3, 4, 5], message: '' }, optimalPracticeTimes: habitTracking?.optimal_practice_times || [], preferredTutorialTypes: habitTracking?.preferred_tutorial_types || [], productiveDays: habitTracking?.productive_days || [] },
          achievements: [],
          portfolio: portfolio?.map((look: any) => ({ id: look.id, userId: look.user_id, title: look.title, description: look.description, style: look.style, date: look.created_at, beforePhoto: look.before_photo_url, afterPhoto: look.after_photo_url, processPhotos: look.process_photos || [], arTryOnScreenshot: look.ar_tryon_screenshot_url, productsUsed: [], techniques: look.techniques || [], inspiration: look.inspiration, difficulty: look.difficulty, timeSpent: look.time_spent, skinCondition: look.skin_condition, likes: look.likes_count, comments: [], shares: look.shares_count, isPublic: look.is_public, featured: look.featured, tags: look.tags || [] })) || [],
          savedTutorials: [],
          favoriteProducts: [],
          suggestions: { tutorials: [], products: [], techniques: [], styles: [], generatedAt: '' },
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        } as UserProfile),
        
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }
  
  // Update profile sections
  static async updatePersonalInfo(userId: string, info: Partial<PersonalInfo>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: info.displayName,
          username: info.username,
          bio: info.bio,
          location: info.location,
          website: info.website,
          instagram: info.instagram,
          tiktok: info.tiktok,
          youtube: info.youtube
        })
        .eq('user_id', userId);
      
      return !error;
    } catch (error) {
      console.error('Error updating personal info:', error);
      return false;
    }
  }
  
  static async updateSkinProfile(userId: string, skinProfile: Partial<SkinProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('skin_profiles')
        .update({
          skin_type: skinProfile.skinType,
          skin_tone: skinProfile.skinTone,
          undertone: skinProfile.undertone,
          concerns: skinProfile.concerns,
          face_shape: skinProfile.faceShape,
          eye_shape: skinProfile.eyeShape,
          lip_shape: skinProfile.lipShape,
          foundation_shade: skinProfile.foundationShade,
          concealer_shade: skinProfile.concealerShade,
          powder_shade: skinProfile.powderShade,
          analysis_confidence: skinProfile.analysisConfidence
        })
        .eq('user_id', userId);
      
      return !error;
    } catch (error) {
      console.error('Error updating skin profile:', error);
      return false;
    }
  }
  
  static async updatePreferences(userId: string, preferences: Partial<MakeupPreferences>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('makeup_preferences')
        .update({
          favorite_styles: preferences.favoriteStyles,
          preferred_brands: preferences.preferredBrands,
          budget_range: preferences.budgetRange,
          morning_routine: preferences.morningRoutine,
          evening_routine: preferences.eveningRoutine,
          weekend_style: preferences.weekendStyle,
          preferred_finish: preferences.preferredFinish,
          coverage_level: preferences.coverageLevel,
          cruelty_free: preferences.crueltyFree,
          vegan: preferences.vegan,
          favorite_colors: preferences.favoriteColors,
          avoided_colors: preferences.avoidedColors,
          skill_level: preferences.skillLevel,
          learning_goals: preferences.learningGoals,
          preferred_tutorial_length: preferences.preferredTutorialLength
        })
        .eq('user_id', userId);
      
      return !error;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }
  
  // ============================================
  // PORTFOLIO OPERATIONS
  // ============================================
  
  static async createLook(userId: string, look: Partial<PortfolioLook>): Promise<PortfolioLook | null> {
    try {
      // Insert look
      const { data: newLook, error: lookError } = await supabase
        .from('portfolio_looks')
        .insert([{
          user_id: userId,
          title: look.title,
          description: look.description,
          style: look.style,
          before_photo_url: look.beforePhoto,
          after_photo_url: look.afterPhoto,
          process_photos: look.processPhotos,
          ar_tryon_screenshot_url: look.arTryOnScreenshot,
          difficulty: look.difficulty,
          time_spent: look.timeSpent,
          inspiration: look.inspiration,
          techniques: look.techniques,
          skin_condition: look.skinCondition,
          is_public: look.isPublic,
          tags: look.tags
        }])
        .select()
        .single();
      
      if (lookError) throw lookError;
      
      // Insert products
      if (look.productsUsed && look.productsUsed.length > 0) {
        const products = look.productsUsed.map(p => ({
          look_id: newLook.id,
          name: p.name,
          brand: p.brand,
          shade: p.shade,
          category: p.category
        }));
        
        await supabase.from('look_products').insert(products);
      }
      
      // Recalculate skills
      await this.recalculateSkills(userId);
      
      // Check for new achievements
      await this.checkAndAwardAchievements(userId);
      
      return {
        ...newLook,
        userId: newLook.user_id,
        date: newLook.created_at,
        beforePhoto: newLook.before_photo_url,
        afterPhoto: newLook.after_photo_url,
        processPhotos: newLook.process_photos || [],
        arTryOnScreenshot: newLook.ar_tryon_screenshot_url,
        productsUsed: look.productsUsed || [],
        techniques: newLook.techniques || [],
        skinCondition: newLook.skin_condition,
        likes: 0,
        comments: [],
        shares: 0,
        isPublic: newLook.is_public,
        featured: newLook.featured,
        tags: newLook.tags || []
      } as PortfolioLook;
    } catch (error) {
      console.error('Error creating look:', error);
      return null;
    }
  }
  
  static async deleteLook(lookId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_looks')
        .delete()
        .eq('id', lookId)
        .eq('user_id', userId);
      
      if (!error) {
        // Recalculate skills after deletion
        await this.recalculateSkills(userId);
      }
      
      return !error;
    } catch (error) {
      console.error('Error deleting look:', error);
      return false;
    }
  }
  
  // ============================================
  // COMMENT OPERATIONS
  // ============================================
  
  static async addComment(
    lookId: string, 
    userId: string, 
    username: string, 
    text: string,
    userAvatar?: string
  ): Promise<Comment | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          look_id: lookId,
          user_id: userId,
          text,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        username,
        userAvatar,
        text: data.text,
        createdAt: data.created_at,
        likes: 0
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }
  
  static async deleteComment(commentId: string, userId: string): Promise<boolean> {
    try {
      // Check if user owns comment or the look
      const { data: comment } = await supabase
        .from('comments')
        .select('*, portfolio_looks(user_id)')
        .eq('id', commentId)
        .single();
      
      if (!comment) return false;
      
      const canDelete = comment.user_id === userId || 
                        comment.portfolio_looks?.user_id === userId;
      
      if (!canDelete) return false;
      
      // Soft delete
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: true, text: '[deleted]' })
        .eq('id', commentId);
      
      return !error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }
  
  // ============================================
  // PRACTICE TRACKING
  // ============================================
  
  static async recordPractice(
    userId: string, 
    minutes: number, 
    tutorialId?: string, 
    lookId?: string
  ): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Log practice
      await supabase
        .from('practice_logs')
        .upsert([{
          user_id: userId,
          date: today,
          minutes_practiced: minutes,
          tutorial_id: tutorialId,
          look_id: lookId
        }], { onConflict: 'user_id,date' });
      
      // Update stats via algorithm
      const profile = await this.getFullProfile(userId);
      if (profile) {
        const updatedProfile = HabitTracker.recordPractice(profile, minutes);
        
        // Update stats in database
        await supabase
          .from('user_stats')
          .update({
            current_streak: updatedProfile.stats.currentStreak,
            longest_streak: updatedProfile.stats.longestStreak,
            last_practice_date: updatedProfile.stats.lastPracticeDate,
            hours_practiced: updatedProfile.stats.hoursPracticed,
            practice_heatmap: updatedProfile.stats.practiceHeatmap
          })
          .eq('user_id', userId);
        
        // Check achievements
        await this.checkAndAwardAchievements(userId);
      }
      
      return true;
    } catch (error) {
      console.error('Error recording practice:', error);
      return false;
    }
  }
  
  // ============================================
  // PRIVATE HELPERS
  // ============================================
  
  private static async initializeAchievements(userId: string): Promise<void> {
    // Get all achievement definitions
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*');
    
    if (achievements) {
      // Create user achievement records with 0 progress
      const userAchievements = achievements.map(a => ({
        user_id: userId,
        achievement_id: a.id,
        progress: 0,
        max_progress: a.requirement_value || 100
      }));
      
      await supabase.from('user_achievements').insert(userAchievements);
    }
  }
  
  private static async recalculateSkills(userId: string): Promise<void> {
    // Get portfolio
    const { data: portfolio } = await supabase
      .from('portfolio_looks')
      .select('*, look_products(*)')
      .eq('user_id', userId);
    
    if (portfolio) {
      // Calculate skills
      const skills = SkillCalculator.calculateSkills(portfolio);
      const improvementAreas = SkillCalculator.identifyImprovementAreas(skills);
      const topTechniques = SkillCalculator.identifyTopTechniques(portfolio);
      
      // Update stats
      await supabase
        .from('user_stats')
        .update({
          skill_foundation: skills.foundation,
          skill_concealer: skills.concealer,
          skill_powder: skills.powder,
          skill_blush: skills.blush,
          skill_bronzer: skills.bronzer,
          skill_highlighter: skills.highlighter,
          skill_eyeshadow: skills.eyeshadow,
          skill_eyeliner: skills.eyeliner,
          skill_mascara: skills.mascara,
          skill_eyebrows: skills.eyebrows,
          skill_lips: skills.lips,
          skill_contouring: skills.contouring,
          skill_overall: skills.overall,
          improvement_areas: improvementAreas,
          top_techniques: topTechniques
        })
        .eq('user_id', userId);
    }
  }
  
  private static async checkAndAwardAchievements(userId: string): Promise<void> {
    const profile = await this.getFullProfile(userId);
    if (!profile) return;
    
    const newAchievements = AchievementManager.checkAchievements(profile);
    
    // Update unlocked achievements
    for (const achievement of newAchievements) {
      await supabase
        .from('user_achievements')
        .update({
          progress: 100,
          unlocked_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id);
    }
  }
}

export default ProfileService;
