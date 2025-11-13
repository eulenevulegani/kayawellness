import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'blank' | 'orb-appear' | 'text-reveal' | 'fade-out' | 'complete'>('blank');

  useEffect(() => {
    // Animation sequence timeline - 3.5 seconds total before fading to landing page
    const timeline = [
      { delay: 200, action: () => setPhase('orb-appear') },      // Orb appears at 0.2s
      { delay: 1000, action: () => setPhase('text-reveal') },    // Text reveals at 1s
      { delay: 3500, action: () => setPhase('fade-out') },       // Start fade out at 3.5s
      { delay: 4500, action: () => { setPhase('complete'); onComplete(); } }  // Complete at 4.5s
    ];

    const timers = timeline.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 w-full h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black transition-opacity duration-1000 ${phase === 'fade-out' || phase === 'complete' ? 'opacity-0' : 'opacity-100'}`}>
      {/* Cosmic particle background - appears with orb */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 'blank' ? 'opacity-0' : 'opacity-100'}`}>
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
      <div className={`absolute inset-0 transition-opacity duration-1500 ${phase === 'blank' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-glow-pulse" />
      </div>

      {/* Central Orb - animated appearance */}
      <div className={`relative z-10 transition-all duration-1500 ${
        phase === 'blank' 
          ? 'opacity-0 scale-0' 
          : phase === 'orb-appear' 
          ? 'opacity-100 scale-100' 
          : 'opacity-100 scale-100'
      }`}>
        {/* Outer rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 border border-cyan-400/30 rounded-full animate-ring-pulse" style={{ animationDelay: '0s' }} />
          <div className="absolute w-40 h-40 sm:w-52 sm:h-52 border border-cyan-400/20 rounded-full animate-ring-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 border border-cyan-400/10 rounded-full animate-ring-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Main orb - Official KAYA design */}
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

      {/* Text reveal - "Your Calm Universe" */}
      <div className={`relative z-10 mt-8 sm:mt-12 transition-all duration-1000 ${
        phase === 'text-reveal' || phase === 'fade-out'
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}>
        <div className="flex flex-col items-center">
          {/* Main tagline with staggered letter animation */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white tracking-wide text-center px-6">
            {['Your', 'Calm', 'Universe'].map((word, wordIndex) => (
              <span key={word} className="inline-block mx-2">
                {word.split('').map((letter, letterIndex) => (
                  <span
                    key={letterIndex}
                    className="inline-block animate-letter-appear"
                    style={{
                      animationDelay: `${(wordIndex * 0.15) + (letterIndex * 0.05)}s`,
                      opacity: 0,
                      animationFillMode: 'forwards'
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </div>
          
          {/* Subtle underline */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-line-expand" />
        </div>
      </div>

      {/* Animated styles */}
      <style>{`
        @keyframes cosmic-float {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 60 - 80}px) scale(1.5); opacity: 0; }
        }
        .animate-cosmic-float {
          animation: cosmic-float 6s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 4s ease-in-out infinite;
        }

        @keyframes ring-pulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.4; }
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

        @keyframes shimmer {
          0%, 100% { opacity: 0.4; transform: rotate(0deg); }
          50% { opacity: 0.7; transform: rotate(180deg); }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes core-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-core-pulse {
          animation: core-pulse 2s ease-in-out infinite;
        }

        @keyframes letter-appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-letter-appear {
          animation: letter-appear 0.6s ease-out forwards;
        }

        @keyframes line-expand {
          0% { width: 0; opacity: 0; }
          100% { width: 8rem; opacity: 1; }
        }
        .animate-line-expand {
          animation: line-expand 1s ease-out 1s forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
