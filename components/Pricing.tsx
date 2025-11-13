
import React, { useState } from 'react';
import { StarIcon, CheckIcon } from './Icons';
import { SubscriptionTier } from '../types';

interface PricingProps {
  onSelectPlan: (tierId: 'stardust' | 'constellation' | 'universe') => void;
  currentTier?: 'stardust' | 'constellation' | 'universe';
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'stardust',
    displayName: 'Stardust',
    price: { monthly: 0, yearly: 0 },
    description: 'Begin your cosmic journey',
    features: [
      { text: '1 personalized session per day', included: true },
      { text: 'Daily affirmations', included: true },
      { text: 'Basic breathwork & meditation', included: true },
      { text: 'Community access (view only)', included: true },
      { text: 'Basic analytics & progress tracking', included: true },
      { text: 'Journeys (multi-day programs)', included: false },
      { text: 'Premium content (sleep stories, subliminals, soundscapes)', included: false },
      { text: 'Calendar integrations', included: false },
      { text: 'Unlimited sessions', included: false },
      { text: 'Personal coach access', included: false }
    ]
  },
  {
    id: 'constellation',
    displayName: 'Constellation',
    price: { monthly: 9.99, yearly: 79.99 },
    description: 'Unlimited access to your universe',
    popular: true,
    badge: 'Most Popular',
    features: [
      { text: 'Everything in Stardust, plus:', included: true },
      { text: 'Unlimited personalized sessions', included: true, highlight: true },
      { text: 'All Journeys (multi-day programs)', included: true, highlight: true },
      { text: 'Premium content (sleep stories, subliminals, soundscapes)', included: true, highlight: true },
      { text: 'Advanced breathwork & meditations', included: true, highlight: true },
      { text: 'Calendar integrations', included: true, highlight: true },
      { text: 'Community posting access', included: true },
      { text: 'Offline downloads', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Personal coach access', included: false }
    ]
  },
  {
    id: 'universe',
    displayName: 'Universe',
    price: { monthly: 19.99, yearly: 159.99 },
    description: 'Complete cosmic mastery with personal guidance',
    badge: 'Premium',
    features: [
      { text: 'Everything in Constellation, plus:', included: true },
      { text: 'Personal wellness coach access', included: true, highlight: true },
      { text: '1-on-1 coaching sessions (30min/month)', included: true, highlight: true },
      { text: 'Custom program creation by coach', included: true, highlight: true },
      { text: 'Priority coach response (24hr)', included: true },
      { text: 'Live group coaching sessions', included: true },
      { text: 'Family plan (up to 5 members)', included: true },
      { text: 'Early access to new content', included: true },
      { text: 'Export all data & insights', included: true }
    ]
  }
];

const Pricing: React.FC<PricingProps> = ({ onSelectPlan, currentTier = 'stardust' }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const calculateSavings = (tier: SubscriptionTier) => {
    if (tier.price.yearly === 0) return 0;
    const monthlyCost = tier.price.monthly * 12;
    const yearlyCost = tier.price.yearly;
    const savings = monthlyCost - yearlyCost;
    const percentSaved = Math.round((savings / monthlyCost) * 100);
    return percentSaved;
  };

  return (
    <div className="min-h-screen p-6 overflow-y-auto" style={{ backgroundColor: '#06b6d4' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-wide">
            Choose Your Cosmic Journey
          </h1>
          <p className="text-white/70 text-lg mb-8">
            From free exploration to unlimited universe access
          </p>
          
          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/60 text-sm mb-8">
            <span className="flex items-center gap-2">
              <span className="text-cyan-400">✦</span>
              100,000+ journeys started
            </span>
            <span className="flex items-center gap-2">
              <span className="text-cyan-400">✦</span>
              4.8★ from 12,000+ reviews
            </span>
            <span className="flex items-center gap-2">
              <span className="text-cyan-400">✦</span>
              #1 mindfulness app 2025
            </span>
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 shadow-lg shadow-cyan-500/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 shadow-lg shadow-cyan-500/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-semibold shadow-md">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isCurrentTier = currentTier === tier.id;
            const price = billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly;
            const savings = calculateSavings(tier);
            
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20 md:scale-105 hover:shadow-cyan-500/30'
                    : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-semibold px-4 py-1 rounded-full shadow-lg ${
                      tier.popular
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 shadow-cyan-500/30'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900'
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                    {tier.displayName}
                    {tier.id === 'universe' && <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                  </h3>
                  <p className="text-white/60 text-sm">{tier.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  {price === 0 ? (
                    <div>
                      <span className="text-5xl font-light text-white">Free</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-light text-white">${price}</span>
                        <span className="text-white/60 text-sm">
                          / {billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && savings > 0 && (
                        <p className="text-cyan-400 text-sm mt-1 font-medium">
                          Save {savings}% with annual billing
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-grow mb-8">
                  {tier.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 text-sm ${
                        feature.highlight ? 'text-white font-medium' : 'text-white/70'
                      }`}
                    >
                      {feature.included ? (
                        <CheckIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          feature.highlight ? 'text-cyan-400' : 'text-white/50'
                        }`} />
                      ) : (
                        <span className="w-5 h-5 flex-shrink-0 text-white/30 mt-0.5">×</span>
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {isCurrentTier ? (
                  <button
                    disabled
                    className="w-full py-3 bg-white/10 backdrop-blur-sm text-white/50 rounded-full font-medium cursor-not-allowed border border-white/10"
                  >
                    Current Plan
                  </button>
                ) : tier.id === 'stardust' ? (
                  <button
                    onClick={() => onSelectPlan(tier.id)}
                    className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium hover:bg-white/20 hover:border-white/30 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Get Started Free
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectPlan(tier.id)}
                    className={`w-full py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                      tier.popular
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 hover:shadow-xl hover:shadow-cyan-500/30'
                        : 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 hover:shadow-xl hover:shadow-cyan-500/30'
                    }`}
                  >
                    {tier.id === 'constellation' ? 'Start 7-Day Free Trial' : 'Start Free Trial'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-12">
          <p className="text-white/60 text-sm mb-4">
            All plans include 7-day free trial • Cancel anytime • No credit card required to start
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-xs text-white/50">
            <span className="flex items-center gap-2">
              <span className="text-cyan-400">✓</span>
              Money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <span className="text-cyan-400">✓</span>
              Secure payment
            </span>
            <span className="flex items-center gap-2">
              <span className="text-cyan-400">✓</span>
              Privacy protected
            </span>
            <span className="flex items-center gap-2">
              <span className="text-cyan-400">✓</span>
              24/7 support
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-light text-white text-center mb-8 tracking-wide">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.'
              },
              {
                q: 'What happens after the free trial?',
                a: "You'll be automatically enrolled in the paid plan you selected. Cancel anytime during the trial to avoid charges."
              },
              {
                q: 'Can I switch between plans?',
                a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and Apple Pay for your convenience.'
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/10 transition-all group"
              >
                <summary className="text-white font-medium cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-cyan-400 group-open:rotate-180 transition-transform duration-300">▼</span>
                </summary>
                <p className="text-white/70 text-sm mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;