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
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'title' | 'content'>('initial');

  useEffect(() => {
    // Start animation immediately - orb grows right away
    const titleTimer = setTimeout(() => setAnimationPhase('title'), 1500);  // Title at 1.5s
    const contentTimer = setTimeout(() => setAnimationPhase('content'), 4500); // Content at 4.5s (after 3s hold)
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const handleStartFreeTrial = () => {
    // Start with breathing intro before setup
    console.log('🚀 Starting free trial - navigating to breathing intro');
    setView('breathingIntro');
  };

  const handleLogin = () => {
    // Go to auth screen for existing users
    console.log('🔐 Logging in - navigating to auth');
    setView('auth');
  };

  return (
    <>
      <div className="w-full h-screen overflow-y-auto text-white relative">
        
        {/* Minimal Header - slides down */}
        <header className={`w-full max-w-6xl mx-auto p-4 sm:p-6 flex justify-between items-center relative z-20 transition-all duration-1000 ease-out delay-[400ms] ${animationPhase === 'content' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <span className="text-xl sm:text-2xl font-extralight text-white tracking-[0.3em]">KAYA</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleLogin} 
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/10 hover:border-white/40 transition-all text-xs sm:text-sm"
            >
              Log In
            </button>
            <button 
              onClick={handleStartFreeTrial} 
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all text-xs sm:text-sm shadow-lg"
            >
              Start<span className="hidden sm:inline"> Free Trial</span>
            </button>
          </div>
        </header>

        <main className="relative z-20">
          {/* Hero Section - Orb and text stay permanently */}
          <section className="w-full max-w-4xl mx-auto text-center py-16 sm:py-24 md:py-32 px-4 relative min-h-screen flex flex-col items-center justify-center">
            
            {/* Animated Orb - grows immediately on load */}
            <div className="relative z-10 mb-8 sm:mb-12 w-24 h-24 sm:w-32 sm:h-32 animate-orb-entrance">
              {/* Cosmic particle background */}
              <div className="absolute inset-0 -mx-32 -my-32 animate-particles-fade-in">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-px h-px bg-cyan-300/60 rounded-full animate-cosmic-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${4 + Math.random() * 4}s`
                    }}
                  />
                ))}
              </div>

              {/* Radial glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none animate-glow-fade-in" />
              
              {/* Main orb */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 animate-orb-float shadow-[0_0_80px_rgba(6,182,212,0.8),0_0_120px_rgba(20,184,166,0.6)]">
                {/* Inner white glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 blur-md animate-core-pulse" />
                </div>
                
                {/* Center white core */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Title - appears after orb at 1.5s */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extralight text-white tracking-wide transition-all duration-1000 ease-out ${animationPhase === 'initial' ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
              Your Calm Universe
            </h1>
            
            <p className={`mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-white/60 max-w-lg mx-auto font-light px-4 transition-all duration-1000 ease-out ${animationPhase === 'content' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Simple guided exercises to help you stress less,<br/>sleep better, and live well.
            </p>
            
            <div className={`mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 transition-all duration-1000 ease-out delay-300 ${animationPhase === 'content' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button
                onClick={handleStartFreeTrial}
                className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-white text-black rounded-full font-semibold text-sm sm:text-base hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Start Free Trial
              </button>
              <button
                onClick={handleLogin}
                className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-medium text-sm sm:text-base hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300"
              >
                Log In
              </button>
            </div>
            
            <p className={`mt-6 text-white/50 text-sm transition-all duration-1000 ease-out delay-500 ${animationPhase === 'content' ? 'opacity-100' : 'opacity-0'}`}>No credit card required • 7-day free trial</p>

            {/* Floating indicators */}
            <div className={`flex items-center gap-2 mt-16 transition-all duration-1000 ease-out delay-700 ${animationPhase === 'content' ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-2 h-2 rounded-full bg-white/40"></div>
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <div className="w-2 h-2 rounded-full bg-white/40"></div>
            </div>
          </section>

          {/* Features Section - Minimal Cards */}
          <section className={`w-full max-w-4xl mx-auto py-20 px-4 transition-all duration-1000 ease-out delay-[800ms] ${animationPhase === 'content' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
        @keyframes ring-pulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-ring-pulse {
          animation: ring-pulse 3s ease-out infinite;
        }
        
        @keyframes orb-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        .animate-orb-float {
          animation: orb-float 3s ease-in-out infinite;
        }
        
        @keyframes core-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-core-pulse {
          animation: core-pulse 2s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.8; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 4s ease-in-out infinite;
        }
        
        @keyframes cosmic-float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .animate-cosmic-float {
          animation: cosmic-float linear infinite;
        }
        
        @keyframes orb-entrance {
          0% { opacity: 0; transform: scale(0.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-orb-entrance {
          animation: orb-entrance 1s ease-out forwards;
        }
        
        @keyframes particles-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-particles-fade-in {
          animation: particles-fade-in 1s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        @keyframes glow-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-glow-fade-in {
          animation: glow-fade-in 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        @keyframes ring-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-ring-fade-in {
          animation: ring-fade-in 0.7s ease-out 0.7s forwards;
          opacity: 0;
        }
        .animate-ring-fade-in-delayed {
          animation: ring-fade-in 0.7s ease-out 0.8s forwards;
          opacity: 0;
        }
        .animate-ring-fade-in-more-delayed {
          animation: ring-fade-in 0.7s ease-out 0.9s forwards;
          opacity: 0;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
        }
        
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