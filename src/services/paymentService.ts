// 💳 PAYMENT SERVICE - Stripe Integration
// For subscriptions and referral tracking

import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export const PLANS: PaymentPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Basic tutorials',
      '3 AR try-ons/day',
      'Limited portfolio (10 looks)',
      'Community access'
    ],
    stripePriceId: ''
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited tutorials',
      'Unlimited AR try-ons',
      'AI voice coach',
      'Full portfolio & progress tracking',
      'Priority support',
      'All specialized techniques'
    ],
    stripePriceId: 'price_monthly_premium' // Your Stripe price ID
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    price: 79.99,
    interval: 'year',
    features: [
      'Everything in Monthly',
      '2 months FREE (vs monthly)',
      'Exclusive yearly subscriber badge',
      'Early access to new features'
    ],
    stripePriceId: 'price_yearly_premium' // Your Stripe price ID
  }
];

export class PaymentService {
  
  // Create Stripe customer on signup
  static async createCustomer(userId: string, email: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId }
      });
      
      // Save to database
      await supabase.from('stripe_customers').insert({
        user_id: userId,
        stripe_customer_id: customer.id,
        created_at: new Date().toISOString()
      });
      
      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  }
  
  // Create checkout session for subscription
  static async createCheckoutSession(
    customerId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan || !plan.stripePriceId) {
      throw new Error('Invalid plan');
    }
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: plan.stripePriceId,
        quantity: 1
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        trial_period_days: 14 // 14-day free trial
      }
    });
    
    return session.url!;
  }
  
  // Handle referral reward (free premium time)
  static async applyReferralReward(userId: string, referrals: number): Promise<void> {
    // Check if user already has active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!subscription) {
      // No subscription - create free one with extended trial
      const weeksFree = referrals >= 10 ? 999999 : // Lifetime
                       referrals >= 5 ? 12 : // 3 months
                       referrals >= 3 ? 4 : // 1 month
                       referrals >= 1 ? 1 : 0; // 1 week
      
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + (weeksFree * 7));
      
      await supabase.from('subscriptions').insert({
        user_id: userId,
        status: 'trial',
        plan_id: 'free',
        trial_end: trialEnd.toISOString(),
        current_period_end: trialEnd.toISOString(),
        referrals_count: referrals
      });
    } else {
      // Extend existing subscription
      const currentEnd = new Date(subscription.current_period_end);
      const weeksToAdd = referrals >= 10 ? 5200 : // ~100 years (lifetime)
                        referrals >= 5 ? 12 :
                        referrals >= 3 ? 4 :
                        referrals >= 1 ? 1 : 0;
      
      currentEnd.setDate(currentEnd.getDate() + (weeksToAdd * 7));
      
      await supabase.from('subscriptions')
        .update({
          current_period_end: currentEnd.toISOString(),
          referrals_count: referrals
        })
        .eq('user_id', userId);
    }
  }
  
  // Get user's subscription status
  static async getSubscriptionStatus(userId: string): Promise<{
    isPremium: boolean;
    plan: string;
    trialDaysLeft: number;
    expiresAt: string | null;
  }> {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!subscription) {
      return {
        isPremium: false,
        plan: 'free',
        trialDaysLeft: 14, // Default trial
        expiresAt: null
      };
    }
    
    const now = new Date();
    const endDate = new Date(subscription.current_period_end);
    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null;
    
    const isPremium = subscription.status === 'active' || 
                     (trialEnd && trialEnd > now);
    
    const daysLeft = trialEnd 
      ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    return {
      isPremium,
      plan: subscription.plan_id,
      trialDaysLeft: daysLeft,
      expiresAt: subscription.current_period_end
    };
  }
  
  // Cancel subscription
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', userId)
        .single();
      
      if (subscription?.stripe_subscription_id) {
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
      }
      
      await supabase.from('subscriptions')
        .update({ status: 'canceled', canceled_at: new Date().toISOString() })
        .eq('user_id', userId);
      
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }
}

// Webhook handler for Stripe events
export async function handleStripeWebhook(payload: any, signature: string): Promise<void> {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update user subscription in database
      await supabase.from('subscriptions').upsert({
        user_id: session.metadata.userId,
        stripe_subscription_id: session.subscription,
        status: 'active',
        plan_id: session.metadata.planId,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      break;
      
    case 'invoice.payment_failed':
      // Handle failed payment - notify user
      break;
      
    case 'customer.subscription.deleted':
      // Subscription ended
      break;
  }
}

export default PaymentService;
