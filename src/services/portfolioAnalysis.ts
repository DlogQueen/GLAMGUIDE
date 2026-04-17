import { agentAutonomy } from './agentAutonomy';
import { agentMemory } from './agentMemory';
import { webSearchService } from './webSearchService';
import { tessiKnowledge } from './tessiKnowledge';
import { ProfileService } from './profileService';
import { 
  PortfolioLook, 
  AnalysisResult, 
  TechniqueAssessment, 
  ProductRecommendation 
} from '@/types/profile';

interface LookAnalysisContext {
  userProfile: any;
  currentTrends: any[];
  productKnowledge: any[];
  techniqueLibrary: any[];
}

export class PortfolioAnalysisService {
  private contextCache: Map<string, LookAnalysisContext> = new Map();

  async analyzeLook(lookId: string, userId: string): Promise<AnalysisResult> {
    try {
      // Get the look and user profile
      const look = await this.getLook(lookId, userId);
      const userProfile = await this.getUserProfile(userId);

      if (!look || !userProfile) {
        throw new Error('Look or user profile not found');
      }

      // Get or create analysis context
      const context = await this.getAnalysisContext(userId);

      // Perform AI-powered analysis
      const analysis = await this.performAnalysis(look, userProfile, context);

      // Store analysis in memory
      await this.storeAnalysis(lookId, userId, analysis);

      return analysis;
    } catch (error) {
      console.error('Error analyzing look:', error);
      throw error;
    }
  }

  async analyzePortfolio(userId: string): Promise<PortfolioAnalysisResult> {
    try {
      const portfolio = await this.getUserPortfolio(userId);
      const userProfile = await this.getUserProfile(userId);

      if (!portfolio || !userProfile) {
        throw new Error('Portfolio or user profile not found');
      }

      const context = await this.getAnalysisContext(userId);
      const analyses = await Promise.all(
        portfolio.map(look => this.performAnalysis(look, userProfile, context))
      );

      // Aggregate portfolio insights
      const aggregated = this.aggregatePortfolioInsights(analyses, portfolio);

      return {
        analyses,
        aggregatedInsights: aggregated,
        overallScore: this.calculateOverallScore(aggregated),
        recommendations: this.generatePortfolioRecommendations(aggregated, userProfile)
      };
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      throw error;
    }
  }

  private async getLook(lookId: string, userId: string): Promise<PortfolioLook> {
    const { data } = await ProfileService.getLook(lookId, userId);
    return data;
  }

  private async getUserProfile(userId: string): Promise<any> {
    const profile = await ProfileService.getFullProfile(userId);
    return profile;
  }

  private async getUserPortfolio(userId: string): Promise<PortfolioLook[]> {
    const profile = await ProfileService.getFullProfile(userId);
    return profile?.portfolio || [];
  }

  private async getAnalysisContext(userId: string): Promise<LookAnalysisContext> {
    // Check cache first
    const cached = this.contextCache.get(userId);
    if (cached) return cached;

    // Build context from various sources
    const [userProfile, trends, products, techniques] = await Promise.all([
      this.getUserProfile(userId),
      webSearchService.searchTrends(),
      tessiKnowledge.getProducts(),
      tessiKnowledge.getTutorials()
    ]);

    const context: LookAnalysisContext = {
      userProfile,
      currentTrends: trends.results,
      productKnowledge: products,
      techniqueLibrary: techniques
    };

    this.contextCache.set(userId, context);
    return context;
  }

  private async performAnalysis(
    look: PortfolioLook, 
    userProfile: any, 
    context: LookAnalysisContext
  ): Promise<AnalysisResult> {
    // Use agent autonomy for AI-powered analysis
    const goal = await agentAutonomy.createGoal(
      userProfile.userId,
      `Analyze look: ${look.title}`,
      'high',
      { lookId: look.id, lookData: look }
    );

    const plan = await agentAutonomy.reasonAboutGoal(goal);

    // Execute analysis steps
    const results = await this.executeAnalysisSteps(plan, look, userProfile, context);

    return {
      lookId: look.id,
      title: look.title,
      analysisDate: new Date().toISOString(),
      overallScore: results.overallScore,
      techniqueAssessment: results.techniqueAssessment,
      productUsage: results.productUsage,
      trendAlignment: results.trendAlignment,
      improvementSuggestions: results.improvementSuggestions,
      colorHarmony: results.colorHarmony,
      composition: results.composition,
      creativityScore: results.creativityScore,
      technicalExecution: results.technicalExecution
    };
  }

  private async executeAnalysisSteps(
    plan: any,
    look: PortfolioLook,
    userProfile: any,
    context: LookAnalysisContext
  ): Promise<AnalysisResults> {
    const results: Partial<AnalysisResults> = {};

    // Execute each step in the plan
    for (const step of plan.steps) {
      try {
        switch (step) {
          case 'Analyze techniques':
            results.techniqueAssessment = await this.assessTechniques(look, userProfile, context);
            break;
          case 'Evaluate products':
            results.productUsage = await this.evaluateProducts(look, context);
            break;
          case 'Check trends':
            results.trendAlignment = await this.checkTrendAlignment(look, context);
            break;
          case 'Suggest improvements':
            results.improvementSuggestions = await this.suggestImprovements(look, userProfile, context);
            break;
          case 'Assess color harmony':
            results.colorHarmony = await this.assessColorHarmony(look);
            break;
          case 'Evaluate composition':
            results.composition = await this.evaluateComposition(look);
            break;
          case 'Score creativity':
            results.creativityScore = await this.scoreCreativity(look, userProfile);
            break;
          case 'Assess technical execution':
            results.technicalExecution = await this.assessTechnicalExecution(look);
            break;
        }
      } catch (error) {
        console.error(`Error executing step "${step}":`, error);
      }
    }

    // Calculate overall score
    results.overallScore = this.calculateOverallScoreFromResults(results as AnalysisResults);

    return results as AnalysisResults;
  }

  private async assessTechniques(
    look: PortfolioLook,
    userProfile: any,
    context: LookAnalysisContext
  ): Promise<TechniqueAssessment> {
    const assessment: TechniqueAssessment = {
      techniquesUsed: look.techniques || [],
      skillLevel: userProfile.preferences.skillLevel || 'beginner',
      techniqueQuality: {},
      improvementAreas: [],
      advancedTechniques: []
    };

    // Analyze each technique used
    for (const technique of assessment.techniquesUsed) {
      const quality = await this.evaluateTechniqueQuality(technique, look, context);
      assessment.techniqueQuality[technique] = quality;

      if (quality < 7) { // Scale of 1-10
        assessment.improvementAreas.push({
          technique,
          reason: this.getImprovementReason(technique, quality),
          suggestions: this.getTechniqueImprovementSuggestions(technique)
        });
      }
    }

    // Suggest advanced techniques based on current skill level
    assessment.advancedTechniques = await this.suggestAdvancedTechniques(
      assessment.skillLevel,
      assessment.techniquesUsed
    );

    return assessment;
  }

  private async evaluateProducts(
    look: PortfolioLook,
    context: LookAnalysisContext
  ): Promise<ProductUsageAnalysis> {
    const productAnalysis: ProductUsageAnalysis = {
      productsUsed: look.productsUsed || [],
      productQuality: {},
      alternatives: {},
      applicationTips: {}
    };

    for (const product of productAnalysis.productsUsed) {
      const quality = await this.evaluateProductQuality(product, context);
      productAnalysis.productQuality[product.name] = quality;

      // Suggest alternatives if product quality is low
      if (quality < 7) {
        productAnalysis.alternatives[product.name] = await this.suggestProductAlternatives(
          product,
          context
        );
      }

      // Provide application tips
      productAnalysis.applicationTips[product.name] = await this.getProductApplicationTips(
        product,
        context
      );
    }

    return productAnalysis;
  }

  private async checkTrendAlignment(
    look: PortfolioLook,
    context: LookAnalysisContext
  ): Promise<TrendAlignment> {
    const trendAnalysis: TrendAlignment = {
      currentTrends: context.currentTrends.slice(0, 5), // Top 5 trends
      alignmentScore: 0,
      matchingTrends: [],
      trendRecommendations: []
    };

    // Analyze alignment with current trends
    for (const trend of trendAnalysis.currentTrends) {
      const alignment = await this.calculateTrendAlignment(look, trend);
      if (alignment > 0.5) { // 50% or more alignment
        trendAnalysis.matchingTrends.push({
          trend: trend.title,
          alignmentScore: alignment,
          relevance: this.calculateRelevance(look, trend)
        });
      }
    }

    trendAnalysis.alignmentScore = this.calculateAverageAlignment(trendAnalysis.matchingTrends);
    trendAnalysis.trendRecommendations = await this.generateTrendRecommendations(
      look,
      trendAnalysis.matchingTrends,
      context
    );

    return trendAnalysis;
  }

  private async suggestImprovements(
    look: PortfolioLook,
    userProfile: any,
    context: LookAnalysisContext
  ): Promise<ImprovementSuggestion[]> {
    const suggestions: ImprovementSuggestion[] = [];

    // Technique improvements
    const techniqueAssessment = await this.assessTechniques(look, userProfile, context);
    suggestions.push(...techniqueAssessment.improvementAreas);

    // Product improvements
    const productAnalysis = await this.evaluateProducts(look, context);
    for (const [productName, alternatives] of Object.entries(productAnalysis.alternatives)) {
      suggestions.push({
        category: 'product',
        suggestion: `Consider using ${alternatives[0].name} instead of ${productName} for better results`,
        priority: 'medium'
      });
    }

    // Trend improvements
    const trendAnalysis = await this.checkTrendAlignment(look, context);
    if (trendAnalysis.alignmentScore < 7) {
      suggestions.push({
        category: 'trend',
        suggestion: 'This look could be more aligned with current trends. Consider incorporating some trending elements.',
        priority: 'low'
      });
    }

    // Color harmony improvements
    const colorHarmony = await this.assessColorHarmony(look);
    if (colorHarmony.harmonyScore < 8) {
      suggestions.push({
        category: 'color',
        suggestion: `The color harmony could be improved. Consider ${colorHarmony.suggestions.join(', ')}`,
        priority: 'medium'
      });
    }

    return suggestions;
  }

  private async assessColorHarmony(look: PortfolioLook): Promise<ColorHarmonyAnalysis> {
    // Analyze color harmony in the look
    const colors = this.extractColorsFromLook(look);
    const harmonyScore = this.calculateColorHarmonyScore(colors);
    const suggestions = this.generateColorHarmonySuggestions(colors, harmonyScore);

    return {
      colorsUsed: colors,
      harmonyScore,
      colorTheoryCompliance: this.assessColorTheoryCompliance(colors),
      suggestions
    };
  }

  private async evaluateComposition(look: PortfolioLook): Promise<CompositionAnalysis> {
    // Analyze composition and balance
    const balanceScore = this.calculateBalanceScore(look);
    const focalPointAnalysis = this.analyzeFocalPoints(look);
    const proportionAnalysis = this.analyzeProportions(look);

    return {
      balanceScore,
      focalPointAnalysis,
      proportionAnalysis,
      overallCompositionScore: (balanceScore + focalPointAnalysis.score + proportionAnalysis.score) / 3
    };
  }

  private async scoreCreativity(
    look: PortfolioLook,
    userProfile: any
  ): Promise<CreativityScore> {
    // Score creativity based on various factors
    const originalityScore = this.calculateOriginalityScore(look, userProfile);
    const innovationScore = this.calculateInnovationScore(look);
    const personalExpressionScore = this.calculatePersonalExpressionScore(look, userProfile);

    return {
      originalityScore,
      innovationScore,
      personalExpressionScore,
      overallCreativityScore: (originalityScore + innovationScore + personalExpressionScore) / 3
    };
  }

  private async assessTechnicalExecution(look: PortfolioLook): Promise<TechnicalExecution> {
    // Assess technical aspects of the look
    const precisionScore = this.calculatePrecisionScore(look);
    const blendingScore = this.calculateBlendingScore(look);
    const longevityScore = this.calculateLongevityScore(look);

    return {
      precisionScore,
      blendingScore,
      longevityScore,
      overallTechnicalScore: (precisionScore + blendingScore + longevityScore) / 3
    };
  }

  private async storeAnalysis(lookId: string, userId: string, analysis: AnalysisResult): Promise<void> {
    try {
      await agentMemory.storeLongTermMemory(
        userId,
        `Look analysis: ${analysis.title}`,
        8, // High importance
        ['look_analysis', 'portfolio'],
        { lookId, analysis }
      );
    } catch (error) {
      console.error('Error storing analysis:', error);
    }
  }

  private aggregatePortfolioInsights(
    analyses: AnalysisResult[],
    portfolio: PortfolioLook[]
  ): AggregatedPortfolioInsights {
    const aggregated: AggregatedPortfolioInsights = {
      totalLooks: portfolio.length,
      averageScore: 0,
      techniqueSummary: {},
      productSummary: {},
      trendAlignment: 0,
      improvementAreas: [],
      strengths: [],
      weaknesses: []
    };

    // Calculate averages and summaries
    let totalScore = 0;
    const techniqueCounts: Record<string, number> = {};
    const productCounts: Record<string, number> = {};

    for (const analysis of analyses) {
      totalScore += analysis.overallScore;

      // Count techniques
      for (const technique of analysis.techniqueAssessment.techniquesUsed) {
        techniqueCounts[technique] = (techniqueCounts[technique] || 0) + 1;
      }

      // Count products
      for (const product of analysis.productUsage.productsUsed) {
        productCounts[product.name] = (productCounts[product.name] || 0) + 1;
      }
    }

    aggregated.averageScore = totalScore / analyses.length;
    aggregated.techniqueSummary = techniqueCounts;
    aggregated.productSummary = productCounts;

    // Identify common improvement areas
    const allImprovementAreas = analyses.flatMap(a => a.improvementSuggestions);
    const improvementAreaCounts = this.countImprovementAreas(allImprovementAreas);
    aggregated.improvementAreas = Object.entries(improvementAreaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5 improvement areas
      .map(([area, count]) => ({ area, count }));

    // Identify strengths and weaknesses
    aggregated.strengths = this.identifyStrengths(analyses);
    aggregated.weaknesses = this.identifyWeaknesses(analyses);

    return aggregated;
  }

  private calculateOverallScoreFromResults(results: AnalysisResults): number {
    const scores = [
      results.overallScore || 0,
      results.techniqueAssessment?.techniqueQuality ? 
        Object.values(results.techniqueAssessment.techniqueQuality).reduce((a, b) => a + b, 0) / 
        Object.keys(results.techniqueAssessment.techniqueQuality).length : 0,
      results.productUsage?.productQuality ? 
        Object.values(results.productUsage.productQuality).reduce((a, b) => a + b, 0) / 
        Object.keys(results.productUsage.productQuality).length : 0,
      results.trendAlignment?.alignmentScore || 0,
      results.colorHarmony?.harmonyScore || 0,
      results.composition?.overallCompositionScore || 0,
      results.creativityScore?.overallCreativityScore || 0,
      results.technicalExecution?.overallTechnicalScore || 0
    ].filter(score => score > 0);

    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  private calculateOverallScore(aggregated: AggregatedPortfolioInsights): number {
    const scores = [
      aggregated.averageScore,
      Object.values(aggregated.techniqueSummary).reduce((a, b) => a + b, 0) / 
        Object.keys(aggregated.techniqueSummary).length,
      Object.values(aggregated.productSummary).reduce((a, b) => a + b, 0) / 
        Object.keys(aggregated.productSummary).length,
      aggregated.trendAlignment
    ].filter(score => score > 0);

    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  private generatePortfolioRecommendations(
    aggregated: AggregatedPortfolioInsights,
    userProfile: any
  ): PortfolioRecommendation[] {
    const recommendations: PortfolioRecommendation[] = [];

    // Technique recommendations
    if (aggregated.averageScore < 7) {
      recommendations.push({
        type: 'technique',
        recommendation: 'Focus on improving your core techniques. Practice the most frequently used techniques to build consistency.',
        priority: 'high'
      });
    }

    // Product recommendations
    const mostUsedProducts = Object.entries(aggregated.productSummary)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    recommendations.push({
      type: 'product',
      recommendation: `You frequently use ${mostUsedProducts.map(([name]) => name).join(', ')}. Consider exploring alternatives or mastering these products.`,
      priority: 'medium'
    });

    // Trend recommendations
    if (aggregated.trendAlignment < 7) {
      recommendations.push({
        type: 'trend',
        recommendation: 'Your looks could be more aligned with current trends. Explore the latest makeup trends and incorporate them into your looks.',
        priority: 'medium'
      });
    }

    // Improvement area recommendations
    for (const improvementArea of aggregated.improvementAreas) {
      recommendations.push({
        type: 'improvement',
        recommendation: `You have opportunities to improve in ${improvementArea.area}. Focus on this area to enhance your overall skills.`,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  // Helper methods for various analyses
  private extractColorsFromLook(look: PortfolioLook): string[] {
    // Extract colors from look description and products
    const colors: string[] = [];
    if (look.description) {
      colors.push(...this.extractColorsFromText(look.description));
    }
    if (look.productsUsed) {
      for (const product of look.productsUsed) {
        if (product.shade) {
          colors.push(product.shade);
        }
      }
    }
    return colors;
  }

  private extractColorsFromText(text: string): string[] {
    // Simple color extraction from text
    const colorWords = ['red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'black', 'white', 'gold', 'silver'];
    return text.split(' ').filter(word => colorWords.includes(word.toLowerCase()));
  }

  private calculateColorHarmonyScore(colors: string[]): number {
    // Simple color harmony calculation
    if (colors.length <= 1) return 10;
    if (colors.length === 2) return 8;
    if (colors.length === 3) return 7;
    return Math.max(5, 10 - (colors.length * 2));
  }

  private generateColorHarmonySuggestions(colors: string[], harmonyScore: number): string[] {
    const suggestions: string[] = [];

    if (harmonyScore < 7) {
      suggestions.push('Consider using a more cohesive color palette');
      if (colors.length > 3) {
        suggestions.push('Reduce the number of colors for better harmony');
      }
    }

    return suggestions;
  }

  private assessColorTheoryCompliance(colors: string[]): ColorTheoryCompliance {
    // Simple color theory compliance check
    const compliance: ColorTheoryCompliance = {
      complementary: false,
      analogous: false,
      triadic: false,
      monochromatic: false,
      notes: []
    };

    // Check for complementary colors
    const complementaryPairs = [
      ['red', 'green'],
      ['blue', 'orange'],
      ['yellow', 'purple']
    ];
    for (const [color1, color2] of complementaryPairs) {
      if (colors.includes(color1) && colors.includes(color2)) {
        compliance.complementary = true;
        compliance.notes.push(`Uses complementary colors: ${color1} and ${color2}`);
      }
    }

    // Check for analogous colors
    const analogousGroups = [
      ['red', 'orange', 'yellow'],
      ['yellow', 'green', 'blue'],
      ['blue', 'purple', 'red']
    ];
    for (const group of analogousGroups) {
      if (group.every(color => colors.includes(color))) {
        compliance.analogous = true;
        compliance.notes.push(`Uses analogous colors: ${group.join(', ')}`);
      }
    }

    return compliance;
  }

  private calculateBalanceScore(look: PortfolioLook): number {
    // Simple balance calculation based on product distribution
    const productCounts = this.countProductsByArea(look);
    const totalProducts = Object.values(productCounts).reduce((a, b) => a + b, 0);

    if (totalProducts === 0) return 0;

    const idealDistribution = {
      eyes: 0.3,
      face: 0.3,
      lips: 0.2,
      cheeks: 0.1,
      other: 0.1
    };

    let balanceScore = 0;
    for (const [area, ideal] of Object.entries(idealDistribution)) {
      const actual = (productCounts[area as keyof typeof productCounts] || 0) / totalProducts;
      balanceScore += 1 - Math.abs(ideal - actual);
    }

    return (balanceScore / Object.keys(idealDistribution).length) * 10;
  }

  private countProductsByArea(look: PortfolioLook): Record<string, number> {
    const counts: Record<string, number> = {
      eyes: 0,
      face: 0,
      lips: 0,
      cheeks: 0,
      other: 0
    };

    if (look.productsUsed) {
      for (const product of look.productsUsed) {
        if (product.area) {
          counts[product.area] = (counts[product.area] || 0) + 1;
        } else {
          counts.other++;
        }
      }
    }

    return counts;
  }

  private analyzeFocalPoints(look: PortfolioLook): FocalPointAnalysis {
    // Analyze focal points in the look
    const focalPoints: string[] = [];
    let score = 5; // Neutral score

    if (look.description) {
      if (look.description.toLowerCase().includes('focus on eyes')) {
        focalPoints.push('eyes');
        score += 2;
      }
      if (look.description.toLowerCase().includes('bold lips')) {
        focalPoints.push('lips');
        score += 2;
      }
      if (look.description.toLowerCase().includes('natural')) {
        focalPoints.push('balanced');
        score -= 1;
      }
    }

    return {
      focalPoints,
      score,
      notes: `Identified focal points: ${focalPoints.join(', ') || 'none'}`
    };
  }

  private analyzeProportions(look: PortfolioLook): ProportionAnalysis {
    // Analyze proportions in the look
    const proportions: Record<string, number> = {
      eyes: 0,
      face: 0,
      lips: 0,
      cheeks: 0
    };

    if (look.productsUsed) {
      for (const product of look.productsUsed) {
        if (product.area && product.coverage) {
          proportions[product.area] = (proportions[product.area] || 0) + product.coverage;
        }
      }
    }

    const totalCoverage = Object.values(proportions).reduce((a, b) => a + b, 0);
    const idealProportions = {
      eyes: 0.3,
      face: 0.3,
      lips: 0.2,
      cheeks: 0.2
    };

    let proportionScore = 0;
    for (const [area, ideal] of Object.entries(idealProportions)) {
      const actual = (proportions[area as keyof typeof proportions] || 0) / totalCoverage;
      proportionScore += 1 - Math.abs(ideal - actual);
    }

    return {
      proportions,
      idealProportions,
      proportionScore: (proportionScore / Object.keys(idealProportions).length) * 10,
      notes: 'Analyzed product coverage proportions'
    };
  }

  private calculateOriginalityScore(look: PortfolioLook, userProfile: any): number {
    // Calculate originality score based on user's previous looks
    const userLooks = userProfile.portfolio || [];
    if (userLooks.length <= 1) return 8; // New users get higher originality score

    // Check for similar looks
    let similarCount = 0;
    for (const prevLook of userLooks) {
      if (prevLook.id !== look.id && this.looksSimilar(look, prevLook)) {
        similarCount++;
      }
    }

    const similarityRatio = similarCount / userLooks.length;
    return Math.max(2, 10 - (similarityRatio * 8));
  }

  private looksSimilar(look1: PortfolioLook, look2: PortfolioLook): boolean {
    // Simple similarity check based on techniques and products
    const techniqueSimilarity = this.calculateJaccardSimilarity(
      new Set(look1.techniques || []),
      new Set(look2.techniques || [])
    );

    const productSimilarity = this.calculateJaccardSimilarity(
      new Set((look1.productsUsed || []).map(p => p.name)),
      new Set((look2.productsUsed || []).map(p => p.name))
    );

    return techniqueSimilarity > 0.5 && productSimilarity > 0.5;
  }

  private calculateJaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  private calculateInnovationScore(look: PortfolioLook): number {
    // Calculate innovation score based on unique elements
    const uniqueTechniques = (look.techniques || []).length;
    const uniqueProducts = (look.productsUsed || []).length;

    return Math.min(10, uniqueTechniques + uniqueProducts);
  }

  private calculatePersonalExpressionScore(look: PortfolioLook, userProfile: any): number {
    // Calculate personal expression score based on user preferences
    const styleMatch = this.calculateStyleMatch(look, userProfile.preferences.style || 'natural');
    const colorMatch = this.calculateColorMatch(look, userProfile.preferences.colors || []);

    return (styleMatch + colorMatch) / 2;
  }

  private calculateStyleMatch(look: PortfolioLook, preferredStyle: string): number {
    // Simple style matching
    const lookStyle = this.extractStyleFromDescription(look.description);
    return lookStyle === preferredStyle ? 10 : 5;
  }

  private extractStyleFromDescription(description: string): string {
    if (!description) return 'natural';
    const lower = description.toLowerCase();
    if (lower.includes('natural') || lower.includes('minimal')) return 'natural';
    if (lower.includes('glam') || lower.includes('dramatic')) return 'glam';
    if (lower.includes('bold') || lower.includes('vibrant')) return 'bold';
    return 'natural';
  }

  private calculateColorMatch(look: PortfolioLook, preferredColors: string[]): number {
    // Calculate color match with user preferences
    if (preferredColors.length === 0) return 5;
    const lookColors = this.extractColorsFromLook(look);
    const matchingColors = lookColors.filter(color => preferredColors.includes(color));
    return (matchingColors.length / preferredColors.length) * 10;
  }

  private calculatePrecisionScore(look: PortfolioLook): number {
    // Calculate precision score based on technique quality
    const techniques = look.techniques || [];
    if (techniques.length === 0) return 5;

    // Assume higher precision for more complex techniques
    const complexityScores = {
      'winged eyeliner': 8,
      'cut crease': 9,
      'smokey eye': 7,
      'natural look': 6,
      'bold lip': 7
    };

    const scores = techniques.map(technique => complexityScores[technique] || 5);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  private calculateBlendingScore(look: PortfolioLook): number {
    // Calculate blending score based on product types
    const products = look.productsUsed || [];
    if (products.length === 0) return 5;

    const blendingProducts = products.filter(p => 
      p.type === 'cream' || p.type === 'liquid' || p.type === 'powder'
    ).length;

    return Math.min(10, blendingProducts * 2);
  }

  private calculateLongevityScore(look: PortfolioLook): number {
    // Calculate longevity score based on product types
    const products = look.productsUsed || [];
    if (products.length === 0) return 5;

    const longWearingProducts = products.filter(p => 
      p.longWearing || p.type === 'longwear'
    ).length;

    return Math.min(10, longWearingProducts * 3);
  }

  private countImprovementAreas(improvementAreas: ImprovementSuggestion[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const area of improvementAreas) {
      counts[area.category] = (counts[area.category] || 0) + 1;
    }
    return counts;
  }

  private identifyStrengths(analyses: AnalysisResult[]): string[] {
    const strengths: string[] = [];

    // Identify common strengths
    const strongTechniques = analyses
      .flatMap(a => Object.entries(a.techniqueAssessment.techniqueQuality))
      .filter(([_, quality]) => quality >= 8);

    if (strongTechniques.length > 0) {
      strengths.push('Strong technique execution');
    }

    const highQualityProducts = analyses
      .flatMap(a => Object.entries(a.productUsage.productQuality))
      .filter(([_, quality]) => quality >= 8);

    if (highQualityProducts.length > 0) {
      strengths.push('Good product selection');
    }

    const goodTrendAlignment = analyses.filter(a => a.trendAlignment.alignmentScore >= 7);
    if (goodTrendAlignment.length > 0) {
      strengths.push('Good trend awareness');
    }

    return strengths;
  }

  private identifyWeaknesses(analyses: AnalysisResult[]): string[] {
    const weaknesses: string[] = [];

    // Identify common weaknesses
    const weakTechniques = analyses
      .flatMap(a => Object.entries(a.techniqueAssessment.techniqueQuality))
      .filter(([_, quality) => quality < 6);

    if (weakTechniques.length > 0) {
      weaknesses.push('Technique improvement needed');
    }

    const lowQualityProducts = analyses
      .flatMap(a => Object.entries(a.productUsage.productQuality))
      .filter(([_, quality) => quality < 6);

    if (lowQualityProducts.length > 0) {
      weaknesses.push('Product quality improvement needed');
    }

    const poorTrendAlignment = analyses.filter(a => a.trendAlignment.alignmentScore < 5);
    if (poorTrendAlignment.length > 0) {
      weaknesses.push('Trend alignment improvement needed');
    }

    return weaknesses;
  }

  private async evaluateTechniqueQuality(
    technique: string,
    look: PortfolioLook,
    context: LookAnalysisContext
  ): Promise<number> {
    // Evaluate technique quality using AI
    const qualityPrompt = `Evaluate the quality of this makeup technique:
Technique: ${technique}
Look description: ${look.description || 'No description provided'}
User skill level: ${context.userProfile.preferences.skillLevel || 'beginner'}
Context: ${JSON.stringify(context, null, 2)}

Rate the quality on a scale of 1-10 and provide reasoning.`;

    try {
      const completion = await agentAutonomy.client.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: 'You are a makeup expert evaluating technique quality.' },
          { role: 'user', content: qualityPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || '';
      const qualityMatch = response.match(/(\d+)\s*\/\s*10/);
      return qualityMatch ? parseInt(qualityMatch[1]) : 5;
    } catch (error) {
      console.error('Error evaluating technique quality:', error);
      return 5; // Default to average quality
    }
  }

  private async evaluateProductQuality(
    product: any,
    context: LookAnalysisContext
  ): Promise<number> {
    // Evaluate product quality using AI
    const qualityPrompt = `Evaluate the quality of this makeup product:
Product: ${product.name}
Shade: ${product.shade || 'Not specified'}
Type: ${product.type || 'Not specified'}
User skin type: ${context.userProfile.preferences.skinType || 'Not specified'}
Context: ${JSON.stringify(context, null, 2)}

Rate the quality on a scale of 1-10 and provide reasoning.`;

    try {
      const completion = await agentAutonomy.client.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: 'You are a makeup expert evaluating product quality.' },
          { role: 'user', content: qualityPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || '';
      const qualityMatch = response.match(/(\d+)\s*\/\s*10/);
      return qualityMatch ? parseInt(qualityMatch[1]) : 5;
    } catch (error) {
      console.error('Error evaluating product quality:', error);
      return 5; // Default to average quality
    }
  }

  private async calculateTrendAlignment(
    look: PortfolioLook,
    trend: any
  ): Promise<number> {
    // Calculate trend alignment using AI
    const alignmentPrompt = `Calculate the alignment of this look with the following trend:
Look description: ${look.description || 'No description provided'}
Trend: ${trend.title}
Trend description: ${trend.snippet || 'No description provided'}

Rate the alignment on a scale of 0-1 (0 = no alignment, 1 = perfect alignment) and provide reasoning.`;

    try {
      const completion = await agentAutonomy.client.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: 'You are a trend expert calculating look-trend alignment.' },
          { role: 'user', content: alignmentPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || '';
      const alignmentMatch = response.match(/(\d+(?:\.\d+)?)\s*\(/);
      return alignmentMatch ? parseFloat(alignmentMatch[1]) : 0;
    } catch (error) {
      console.error('Error calculating trend alignment:', error);
      return 0;
    }
  }

  private calculateRelevance(look: PortfolioLook, trend: any): number {
    // Simple relevance calculation based on keywords
    const lookKeywords = look.description?.toLowerCase().split(' ') || [];
    const trendKeywords = trend.snippet?.toLowerCase().split(' ') || [];

    const commonKeywords = lookKeywords.filter(word => trendKeywords.includes(word));
    return commonKeywords.length / trendKeywords.length;
  }

  private calculateAverageAlignment(matchingTrends: any[]): number {
    if (matchingTrends.length === 0) return 0;
    const totalAlignment = matchingTrends.reduce((sum, trend) => sum + trend.alignmentScore, 0);
    return totalAlignment / matchingTrends.length;
  }

  private async generateTrendRecommendations(
    look: PortfolioLook,
    matchingTrends: any[],
    context: LookAnalysisContext
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Suggest incorporating matching trends
    for (const trend of matchingTrends) {
      recommendations.push(`Consider incorporating elements from the ${trend.trend} trend to enhance alignment`);
    }

    // Suggest exploring new trends
    const unexploredTrends = context.currentTrends.filter(
      trend => !matchingTrends.some(t => t.trend === trend.title)
    ).slice(0, 3); // Top 3 unexplored trends

    for (const trend of unexploredTrends) {
      recommendations.push(`Explore the ${trend.title} trend for fresh inspiration`);
    }

    return recommendations;
  }

  private getImprovementReason(technique: string, quality: number): string {
    const reasons: Record<string, string> = {
      'winged eyeliner': 'Winged eyeliner requires precision and practice to master the perfect flick',
      'cut crease': 'Cut crease techniques need careful blending and sharp lines',
      'smokey eye': 'Smokey eyes require proper blending to avoid harsh lines',
      'foundation': 'Foundation application needs proper skin preparation and technique',
      'contouring': 'Contouring requires understanding of face shape and light/shadow'
    };

    return reasons[technique] || 'This technique needs more practice and refinement';
  }

  private getTechniqueImprovementSuggestions(technique: string): string[] {
    const suggestions: Record<string, string[]> = {
      'winged eyeliner': [
        'Use tape as a guide for the wing',
        'Start with small strokes and build up',
        'Use a fine-tipped liquid liner for precision'
      ],
      'cut crease': [
        'Use a transition shade before applying the crease color',
        'Blend thoroughly with a clean brush',
        'Use concealer to create a sharp line'
      ],
      'smokey eye': [
        'Start with a light hand and build up color gradually',
        'Use multiple shades for depth',
        'Blend, blend, blend!'
      ],
      'foundation': [
        'Always moisturize before applying foundation',
        'Use a damp beauty sponge for seamless application',
        'Apply in thin layers rather than one thick layer'
      ],
      'contouring': [
        'Use cream products for a more natural look',
        'Blend thoroughly to avoid harsh lines',
        'Start with a light hand and build up gradually'
      ]
    };

    return suggestions[technique] || ['Practice regularly', 'Watch tutorials', 'Get feedback from others'];
  }

  private async suggestProductAlternatives(
    product: any,
    context: LookAnalysisContext
  ): Promise<any[]> {
    const alternatives: any[] = [];

    // Suggest alternatives based on product type
    const productType = product.type || 'general';
    const knowledgeProducts = context.productKnowledge.filter(p => 
      p.category === 'product' && p.tags.includes(productType)
    );

    // Get top 3 alternatives
    for (const knowledgeProduct of knowledgeProducts.slice(0, 3)) {
      alternatives.push({
        name: knowledgeProduct.topic,
        description: knowledgeProduct.content,
        tags: knowledgeProduct.tags
      });
    }

    return alternatives;
  }

  private async getProductApplicationTips(
    product: any,
    context: LookAnalysisContext
  ): Promise<string[]> {
    const tips: string[] = [];

    // Get application tips from knowledge base
    const knowledgeEntries = context.productKnowledge.filter(p => 
      p.category === 'knowledge' && 
      p.tags.some(tag => product.name.toLowerCase().includes(tag))
    );

    for (const entry of knowledgeEntries.slice(0, 3)) {
      tips.push(entry.content);
    }

    return tips;
  }

  private async suggestAdvancedTechniques(
    skillLevel: string,
    currentTechniques: string[]
  ): Promise<string[]> {
    const advancedTechniques: Record<string, string[]> = {
      beginner: ['winged eyeliner', 'contouring', 'smokey eye'],
      intermediate: ['cut crease', 'halo eye', 'ombre lips'],
      advanced: ['negative space eyeliner', 'abstract eye art', 'body painting']
    };

    const suggestions = advancedTechniques[skillLevel] || [];
    return suggestions.filter(technique => !currentTechniques.includes(technique));
  }
}

export interface AnalysisResults {
  overallScore: number;
  techniqueAssessment?: TechniqueAssessment;
  productUsage?: ProductUsageAnalysis;
  trendAlignment?: TrendAlignment;
  improvementSuggestions?: ImprovementSuggestion[];
  colorHarmony?: ColorHarmonyAnalysis;
  composition?: CompositionAnalysis;
  creativityScore?: CreativityScore;
  technicalExecution?: TechnicalExecution;
}

export interface PortfolioAnalysisResult {
  analyses: AnalysisResult[];
  aggregatedInsights: AggregatedPortfolioInsights;
  overallScore: number;
  recommendations: PortfolioRecommendation[];
}

export interface AggregatedPortfolioInsights {
  totalLooks: number;
  averageScore: number;
  techniqueSummary: Record<string, number>;
  productSummary: Record<string, number>;
  trendAlignment: number;
  improvementAreas: { area: string; count: number }[];
  strengths: string[];
  weaknesses: string[];
}

export interface PortfolioRecommendation {
  type: string;
  recommendation: string;
  priority: string;
}

export interface TechniqueAssessment {
  techniquesUsed: string[];
  skillLevel: string;
  techniqueQuality: Record<string, number>;
  improvementAreas: ImprovementSuggestion[];
  advancedTechniques: string[];
}

export interface ProductUsageAnalysis {
  productsUsed: any[];
  productQuality: Record<string, number>;
  alternatives: Record<string, any[]>;
  applicationTips: Record<string, string[]>;
}

export interface TrendAlignment {
  currentTrends: any[];
  alignmentScore: number;
  matchingTrends: { trend: string; alignmentScore: number; relevance: number }[];
  trendRecommendations: string[];
}

export interface ImprovementSuggestion {
  category: string;
  suggestion: string;
  priority: string;
}

export interface ColorHarmonyAnalysis {
  colorsUsed: string[];
  harmonyScore: number;
  colorTheoryCompliance: ColorTheoryCompliance;
  suggestions: string[];
}

export interface ColorTheoryCompliance {
  complementary: boolean;
  analogous: boolean;
  triadic: boolean;
  monochromatic: boolean;
  notes: string[];
}

export interface CompositionAnalysis {
  balanceScore: number;
  focalPointAnalysis: FocalPointAnalysis;
  proportionAnalysis: ProportionAnalysis;
  overallCompositionScore: number;
}

export interface FocalPointAnalysis {
  focalPoints: string[];
  score: number;
  notes: string;
}

export interface ProportionAnalysis {
  proportions: Record<string, number>;
  idealProportions: Record<string, number>;
  proportionScore: number;
  notes: string;
}

export interface CreativityScore {
  originalityScore: number;
  innovationScore: number;
  personalExpressionScore: number;
  overallCreativityScore: number;
}

export interface TechnicalExecution {
  precisionScore: number;
  blendingScore: number;
  longevityScore: number;
  overallTechnicalScore: number;
}

export const portfolioAnalysisService = new PortfolioAnalysisService();
export default portfolioAnalysisService;