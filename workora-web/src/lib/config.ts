/**
 * Application Configuration
 * 
 * This file contains configuration values that can be updated without code changes.
 * In a future version, these should be moved to a database or admin panel.
 */

export const APP_CONFIG = {
  // Pro Plus Kickstart Pricing
  proPlus: {
    monthlyPrice: 300,
    currency: 'Ksh',
    features: [
      'Guided onboarding',
      'Keyword research',
      'ID verification',
      'AI-generated profile feedback',
      'Promotions: Up to 5 orders/month',
      'Coupons: 5/month',
      'Follow-up messages: 5/month',
      'Buyer activity insights',
      'Priority support',
      'Live walkthrough sessions',
      'Tips and insights'
    ]
  },

  // Default values and fallbacks
  defaults: {
    location: 'Kenya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'
  }
} as const;
