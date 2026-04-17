import OpenAI from 'openai';
import { agentMemory, type AgentPlan } from './agentMemory';
import { webSearchService } from './webSearchService';

// Agent Autonomy System
// Implements: Goal-based reasoning, Environmental interaction, Self-correction, Delegated authority

interface Goal {
  id: string;
  userId: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  context: any;
  status: 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
  createdAt: string;
}

interface EnvironmentState {
  userProfile: any;
  currentContext: string;
  availableTools: string[];
  externalData: any;
  lastUpdateTime: string;
}

interface Action {
  type: 'analyze' | 'search' | 'plan' | 'execute' | 'correct' | 'escalate';
  description: string;
  parameters: any;
  expectedOutcome: string;
}

export class AgentAutonomy {
  private client: OpenAI;
  private activeGoals: Map<string, Goal> = new Map();
  private environmentState: Map<string, EnvironmentState> = new Map();

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true
    });
  }

  // ============================================
  // GOAL-BASED REASONING
  // ============================================
  
  async createGoal(userId: string, description: string, priority: Goal['priority'] = 'medium', context?: any): Promise<Goal> {
    const goal: Goal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      description,
      priority,
      context: context || {},
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.activeGoals.set(goal.id, goal);
    
    // Store in memory
    await agentMemory.storeLongTermMemory(userId, `New goal created: ${description}`, priority === 'critical' ? 9 : 6, ['goal'], { goalId: goal.id });
    
    // Start planning immediately if high priority
    if (priority === 'high' || priority === 'critical') {
      await this.reasonAboutGoal(goal);
    }

    return goal;
  }

  async reasonAboutGoal(goal: Goal): Promise<AgentPlan> {
    // Update goal status
    goal.status = 'planning';
    this.activeGoals.set(goal.id, goal);

    // Get environmental context
    const environment = await this.assessEnvironment(goal.userId);
    
    // Use LLM to reason about the goal and create plan
    const reasoningPrompt = `You are Tessi, an autonomous AI beauty coach. Analyze this goal and create a detailed plan.

Goal: ${goal.description}
Priority: ${goal.priority}
Context: ${JSON.stringify(goal.context)}
Environment: ${JSON.stringify(environment)}

Your capabilities:
- Vision analysis (makeup assessment)
- Web search (trends, products, tutorials)
- Knowledge base access
- Memory retrieval
- Planning and execution

Create a step-by-step plan to achieve this goal. Consider:
1. What information do I need?
2. What tools should I use?
3. What are the potential obstacles?
4. How will I measure success?

Respond with:
REASONING: [Your reasoning process]
STEPS: [Step 1, Step 2, Step 3, etc]`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: 'You are Tessi, an autonomous AI agent capable of reasoning and planning.' },
          { role: 'user', content: reasoningPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content || '';
      
      // Parse reasoning and steps
      const reasoningMatch = response.match(/REASONING:\s*([\s\S]*?)(?=STEPS:|$)/);
      const stepsMatch = response.match(/STEPS:\s*([\s\S]+)/);
      
      const reasoning = reasoningMatch?.[1]?.trim() || 'Planning goal achievement';
      const stepsText = stepsMatch?.[1]?.trim() || 'Analyze, Plan, Execute';
      const steps = stepsText.split('\n').filter(s => s.trim()).map(s => s.replace(/^\d+\.\s*/, '').trim());

      // Create and store plan
      const plan = await agentMemory.createPlan(goal.userId, goal.description, reasoning);
      
      // Update plan with generated steps
      await this.updatePlanSteps(plan.id, steps);
      
      // Start execution
      goal.status = 'executing';
      this.activeGoals.set(goal.id, goal);
      
      return plan;
    } catch (error) {
      console.error('Goal reasoning failed:', error);
      goal.status = 'failed';
      this.activeGoals.set(goal.id, goal);
      throw error;
    }
  }

  // ============================================
  // ENVIRONMENTAL INTERACTION
  // ============================================
  
  async assessEnvironment(userId: string): Promise<EnvironmentState> {
    const currentState = this.environmentState.get(userId);
    
    // Gather environmental data
    const [workingMemory, recentEpisodes] = await Promise.all([
      agentMemory.getWorkingMemory(userId),
      agentMemory.getRecentEpisodes(userId, 1)
    ]);

    const environment: EnvironmentState = {
      userProfile: await this.getUserProfile(userId),
      currentContext: workingMemory?.currentContext || '',
      availableTools: ['vision', 'search', 'knowledge', 'memory'],
      externalData: {
        recentEpisodes,
        currentTime: new Date().toISOString(),
        systemStatus: 'operational'
      },
      lastUpdateTime: new Date().toISOString()
    };

    this.environmentState.set(userId, environment);
    return environment;
  }

  async interactWithEnvironment(userId: string, action: Action): Promise<any> {
    switch (action.type) {
      case 'analyze':
        return await this.performAnalysis(userId, action.parameters);
      
      case 'search':
        return await this.performSearch(userId, action.parameters);
      
      case 'execute':
        return await this.executeAction(userId, action.parameters);
      
      case 'correct':
        return await this.performCorrection(userId, action.parameters);
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  // ============================================
  // SELF-CORRECTION
  // ============================================
  
  async performSelfCorrection(userId: string, failedAction: Action, error: string): Promise<Action> {
    // Analyze why action failed
    const correctionPrompt = `An action failed and needs correction.

Failed Action: ${failedAction.description}
Parameters: ${JSON.stringify(failedAction.parameters)}
Expected Outcome: ${failedAction.expectedOutcome}
Actual Error: ${error}

Your capabilities:
- Vision analysis
- Web search
- Knowledge base
- Memory retrieval
- Alternative approaches

Provide a corrected action plan:
CORRECTED_ACTION: [New action description]
CORRECTED_PARAMETERS: [New parameters]
CORRECTION_REASONING: [Why this should work better]`;

    try {
      const goalTriggers: Array<{pattern: RegExp; type: string; priority: 'low' | 'medium' | 'high' | 'critical'}> = [
      { pattern: /help me/i, type: 'tutorial', priority: 'medium' },
      { pattern: /learn/i, type: 'tutorial', priority: 'medium' },
      { pattern: /find/i, type: 'search', priority: 'low' },
      { pattern: /create/i, type: 'creative', priority: 'high' },
      { pattern: /fix/i, type: 'problem-solving', priority: 'high' },
      { pattern: /recommend/i, type: 'recommendation', priority: 'medium' }
    ];

      const completion = await this.client.chat.completions.create({
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: 'You are Tessi, an AI agent capable of self-correction and adaptive problem-solving.' },
          { role: 'user', content: correctionPrompt }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content || '';
      
      const actionMatch = response.match(/CORRECTED_ACTION:\s*([\s\S]*?)(?=CORRECTED_PARAMETERS:|$)/);
      const paramsMatch = response.match(/CORRECTED_PARAMETERS:\s*([\s\S]*?)(?=CORRECTION_REASONING:|$)/);
      const reasoningMatch = response.match(/CORRECTION_REASONING:\s*([\s\S]+)/);

      const correctedAction: Action = {
        type: failedAction.type,
        description: actionMatch?.[1]?.trim() || failedAction.description,
        parameters: paramsMatch?.[1]?.trim() ? JSON.parse(paramsMatch[1].trim()) : failedAction.parameters,
        expectedOutcome: failedAction.expectedOutcome
      };

      // Store correction in memory
      await agentMemory.storeEpisodicMemory(userId, `Self-correction: ${failedAction.description} -> ${correctedAction.description}`, {
        originalError: error,
        correctionReasoning: reasoningMatch?.[1]?.trim()
      });

      return correctedAction;
    } catch (error) {
      console.error('Self-correction failed:', error);
      return failedAction; // Return original if correction fails
    }
  }

  // ============================================
  // DELEGATED AUTHORITY & ESCALATION
  // ============================================
  
  async shouldEscalate(userId: string, action: Action, context: any): Promise<boolean> {
    // Escalate if:
    // 1. High-impact decisions (purchases, account changes)
    // 2. Multiple failed attempts
    // 3. Uncertainty above threshold
    // 4. Safety/privacy concerns
    
    const highImpactActions = ['purchase', 'delete', 'share', 'publish'];
    const isHighImpact = highImpactActions.some(impact => action.description.toLowerCase().includes(impact));
    
    const hasFailures = context.recentFailures >= 3;
    const isUncertain = action.parameters.uncertainty > 0.7;
    const isPrivacyConcern = action.description.toLowerCase().includes('personal') || 
                            action.description.toLowerCase().includes('private');

    return isHighImpact || hasFailures || isUncertain || isPrivacyConcern;
  }

  async escalateToHuman(userId: string, reason: string, context: any): Promise<void> {
    // Store escalation in memory
    await agentMemory.storeLongTermMemory(userId, `ESCALATION NEEDED: ${reason}`, 9, ['escalation'], {
      context,
      timestamp: new Date().toISOString(),
      requiresHumanAttention: true
    });

    // Update any active goals to reflect escalation
    for (const [goalId, goal] of this.activeGoals.entries()) {
      if (goal.userId === userId && goal.status === 'executing') {
        goal.status = 'pending'; // Pause until human input
        this.activeGoals.set(goalId, goal);
      }
    }
  }

  // ============================================
  // CONTINUOUS OPERATION
  // ============================================
  
  async processGoals(userId: string): Promise<void> {
    const userGoals = Array.from(this.activeGoals.entries())
      .filter(([_, goal]) => goal.userId === userId)
      .map(([_, goal]) => goal);
    
    for (const goal of userGoals) {
      if (goal.status === 'pending') {
        await this.reasonAboutGoal(goal);
      } else if (goal.status === 'executing') {
        await this.executeGoal(goal);
      }
    }
  }

  private async executeGoal(goal: Goal): Promise<void> {
    try {
      // Get current plan for this goal
      const environment = await this.assessEnvironment(goal.userId);
      
      // Execute next step in plan
      const success = await this.interactWithEnvironment(goal.userId, {
        type: 'execute',
        description: `Execute goal: ${goal.description}`,
        parameters: { goalId: goal.id, environment },
        expectedOutcome: 'Goal progress'
      });

      if (success) {
        // Check if goal is complete
        const isComplete = await this.evaluateGoalCompletion(goal);
        if (isComplete) {
          goal.status = 'completed';
          await agentMemory.storeLongTermMemory(goal.userId, `Goal completed: ${goal.description}`, 8, ['achievement'], { goalId: goal.id });
        }
      } else {
        // Try self-correction
        await this.performSelfCorrection(goal.userId, {
          type: 'execute',
          description: `Execute goal: ${goal.description}`,
          parameters: { goalId: goal.id },
          expectedOutcome: 'Goal progress'
        }, 'Execution failed');
      }

      this.activeGoals.set(goal.id, goal);
    } catch (error) {
      console.error('Goal execution error:', error);
      goal.status = 'failed';
      this.activeGoals.set(goal.id, goal);
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================
  
  private async performAnalysis(userId: string, parameters: any): Promise<any> {
    if (parameters.type === 'vision') {
      return await tessiVision.analyzeMakeup(parameters.image);
    }
    if (parameters.type === 'profile') {
      return await this.getUserProfile(userId);
    }
    return null;
  }

  private async performSearch(userId: string, parameters: any): Promise<any> {
    return await webSearchService.searchMakeup(parameters.query);
  }

  private async executeAction(userId: string, parameters: any): Promise<any> {
    // This would integrate with actual action execution
    return { success: true, result: 'Action executed' };
  }

  private async performCorrection(userId: string, parameters: any): Promise<any> {
    // Implement correction logic
    return { success: true, result: 'Correction applied' };
  }

  private async getUserProfile(userId: string): Promise<any> {
    // Get user profile from database
    return { userId, skillLevel: 'intermediate', preferences: [] };
  }

  private async evaluateGoalCompletion(goal: Goal): Promise<boolean> {
    // Logic to determine if goal is complete
    return false; // Would implement actual evaluation
  }

  private async updatePlanSteps(planId: string, steps: string[]): Promise<void> {
    // Update plan in database with new steps
    // This would integrate with actual database operations
  }

  // Get agent status for monitoring
  getAgentStatus(userId: string): {
    activeGoals: Goal[];
    environmentState: EnvironmentState | null;
    lastUpdate: string;
  } {
    return {
      activeGoals: Array.from(this.activeGoals.values()).filter(g => g.userId === userId),
      environmentState: this.environmentState.get(userId) || null,
      lastUpdate: new Date().toISOString()
    };
  }
}

export const agentAutonomy = new AgentAutonomy();
