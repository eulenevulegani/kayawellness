import React, { useState, useEffect } from 'react';
import KayaLogo from './KayaLogo';
import PulsingOrb from './PulsingOrb';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [affirmation, setAffirmation] = useState("Your quiet moment begins now");

  useEffect(() => {
    // Simulate AI affirmation generation
    const affirmations = [
      "Your quiet moment begins now",
      "You are exactly where you need to be",
      "Breathe deep. You've got this",
      "Welcome to your pocket sanctuary",
      "Let's find your calm together"
    ];
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    
    // Show splash for 2 seconds then transition
    const timer = setTimeout(() => onComplete(), 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: '#06b6d4' }}>
      {/* Animated particle background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Central universe orb with KAYA text */}
      <PulsingOrb size="xl" variant="cyan" intensity="medium" className="mb-8">
        <span className="text-xl font-extralight text-white tracking-[0.3em]">KAYA</span>
      </PulsingOrb>

      {/* Affirmation text */}
      <p className="text-white/80 text-xl font-light text-center px-6 animate-fade-in max-w-md">
        {affirmation}
      </p>

      {/* Loading indicator */}
      <div className="mt-8 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
