import React, { useState, useEffect } from 'react';
import { AppView, UserProfile } from '../types';
import Pricing from './Pricing';
import { LotusIcon, BrainIcon, MoonIcon, StarIcon } from './Icons';
import KayaLogo from './KayaLogo';
import PulsingOrb from './PulsingOrb';

interface LandingPageProps {
  setView: (view: AppView) => void;
  userProfile: UserProfile | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView, userProfile }) => {
  const handleStartFreeTrial = () => {
    // Start with onboarding directly (no auth first)
    console.log('🚀 Starting free trial - navigating to setup');
    setView('setup');
  };

  const handleLogin = () => {
    // Go to auth screen for existing users
    console.log('🔐 Logging in - navigating to auth');
    setView('auth');
  };

  return (
    <>
      <div className="w-full h-full overflow-y-auto animate-fade-in text-white relative" style={{ background: '#06b6d4' }}>
        {/* Animated particle background - same as splash */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-cyan-600/10"></div>
        
        {/* Minimal Header */}
        <header className="w-full max-w-6xl mx-auto p-6 flex justify-between items-center relative z-10">
          <span className="text-2xl font-extralight text-white tracking-[0.3em]">KAYA</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogin} 
              className="px-6 py-2.5 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/10 hover:border-white/40 transition-all text-sm"
            >
              Log In
            </button>
            <button 
              onClick={handleStartFreeTrial} 
              className="px-6 py-2.5 bg-white text-cyan-600 rounded-full font-semibold hover:bg-white/90 transition-all text-sm shadow-lg"
            >
              Start Free Trial
            </button>
          </div>
        </header>

        <main className="relative z-10">
          {/* Hero Section - Splash-inspired */}
          <section className="w-full max-w-4xl mx-auto text-center py-24 md:py-32 px-4 relative min-h-[80vh] flex flex-col items-center justify-center">
            
            {/* Central universe orb with KAYA text */}
            <div className="flex justify-center mb-12">
              <PulsingOrb size="xl" variant="cyan" intensity="medium">
                <span className="text-xl md:text-2xl font-extralight text-white tracking-[0.3em]">KAYA</span>
              </PulsingOrb>
            </div>

            <h1 className="text-4xl md:text-6xl font-extralight tracking-tight text-white leading-tight mb-6">
              Your Calm Universe
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/60 max-w-lg mx-auto font-light">
              AI-powered mindfulness that adapts to you.<br/>Find calm. Build resilience. Live better.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleStartFreeTrial}
                className="px-12 py-4 bg-white text-cyan-600 rounded-full font-semibold text-base hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Start Free Trial
              </button>
              <button
                onClick={handleLogin}
                className="px-12 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-medium text-base hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300"
              >
                Log In
              </button>
            </div>
            
            <p className="mt-6 text-white/50 text-sm">No credit card required • 7-day free trial</p>

            {/* Floating indicators */}
            <div className="flex items-center gap-2 mt-16">
              <div className="w-2 h-2 rounded-full bg-white/40"></div>
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <div className="w-2 h-2 rounded-full bg-white/40"></div>
            </div>
          </section>

          {/* Features Section - Minimal Cards */}
          <section className="w-full max-w-4xl mx-auto py-20 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BrainIcon className="w-7 h-7 text-white/80"/>
                </div>
                <h3 className="text-xl font-light text-white mb-2">Personalized Sessions</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  AI that understands your mood and creates sessions just for you
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MoonIcon className="w-7 h-7 text-white/80"/>
                </div>
                <h3 className="text-xl font-light text-white mb-2">Sleep Stories</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Calming narratives designed to guide you into deep, restorative rest
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <StarIcon className="w-7 h-7 text-white/80"/>
                </div>
                <h3 className="text-xl font-light text-white mb-2">Guided Programs</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Multi-day journeys that build lasting wellness habits
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LotusIcon className="w-7 h-7 text-white/80"/>
                </div>
                <h3 className="text-xl font-light text-white mb-2">Mindful Tools</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Breathwork, meditation, and soundscapes for every moment
                </p>
              </div>

            </div>
          </section>
          
          {/* Pricing Section */}
          <Pricing onSelectPlan={handleStartFreeTrial} />

        </main>

        {/* Footer */}
        <footer className="w-full text-center py-12 px-4 border-t border-white/5 relative z-10">
          <p className="text-white/30 text-sm font-extralight tracking-wide">
            &copy; {new Date().getFullYear()} KAYA
          </p>
        </footer>
      </div>
      <style>{`
        @keyframes aurora-one {
          0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
          100% { transform: translateX(300px) translateY(200px) rotate(90deg) scale(1.2); }
        }
        @keyframes aurora-two {
          0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1.2); }
          100% { transform: translateX(-300px) translateY(-200px) rotate(-90deg) scale(1); }
        }
        @keyframes pulse-orb {
          0%, 100% { opacity: 0.15; transform: scale(0.95); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        .animate-pulse-orb {
          animation: pulse-orb 8s ease-in-out infinite;
        }
        .glow-button::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: conic-gradient(from 180deg at 50% 50%, #2dd4bf, #06b6d4, #2dd4bf);
          filter: blur(15px);
          border-radius: 9999px;
          z-index: -1;
          animation: spin 4s linear infinite;
          opacity: 0.5;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default LandingPage;