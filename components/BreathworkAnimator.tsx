import React, { useState, useEffect } from 'react';
import { BreathworkItem } from '../types';

interface BreathworkAnimatorProps {
  breathwork: BreathworkItem;
}

type Stage = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';

const BreathworkAnimator: React.FC<BreathworkAnimatorProps> = ({ breathwork }) => {
  const { pattern = { inhale: 4, hold: 4, exhale: 4 } } = breathwork || {};
  const { inhale, hold, exhale, holdAfterExhale } = pattern;
  const stages: { name: Stage; duration: number }[] = [
    { name: 'inhale', duration: inhale * 1000 },
    { name: 'hold', duration: hold * 1000 },
    { name: 'exhale', duration: exhale * 1000 },
  ];
  if (holdAfterExhale && holdAfterExhale > 0) {
    stages.push({ name: 'holdAfterExhale', duration: holdAfterExhale * 1000 });
  }

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [countdown, setCountdown] = useState(stages[0].duration / 1000);
  const [progress, setProgress] = useState(0);

  // Stage transition timer
  useEffect(() => {
    const stageDuration = stages[currentStageIndex].duration;
    setProgress(0);
    
    const stageTimer = setTimeout(() => {
      setCurrentStageIndex((prevIndex) => (prevIndex + 1) % stages.length);
    }, stageDuration);

    // Smooth progress for animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (stageDuration / 100);
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => {
      clearTimeout(stageTimer);
      clearInterval(progressInterval);
    };
  }, [currentStageIndex, stages]);

  // Countdown timer
  useEffect(() => {
    const initialCount = stages[currentStageIndex].duration / 1000;
    setCountdown(initialCount);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        return next >= 1 ? next : initialCount;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [currentStageIndex, stages]);

  const currentStage = stages[currentStageIndex];
  
  const stageInfo: Record<Stage, { text: string; gradient: string; glowColor: string; scaleClass: string }> = {
    inhale: { 
      text: 'BREATHE IN', 
      gradient: 'from-cyan-400/20 via-blue-500/20 to-teal-600/20',
      glowColor: 'shadow-[0_0_40px_rgba(6,182,212,0.3),0_0_80px_rgba(59,130,246,0.2)]',
      scaleClass: 'scale-110'
    },
    hold: { 
      text: 'GENTLY HOLD', 
      gradient: 'from-cyan-400/20 via-teal-500/20 to-cyan-600/20',
      glowColor: 'shadow-[0_0_40px_rgba(6,182,212,0.3),0_0_80px_rgba(20,184,166,0.2)]',
      scaleClass: 'scale-110'
    },
    exhale: { 
      text: 'BREATHE OUT', 
      gradient: 'from-blue-400/20 via-cyan-500/20 to-teal-600/20',
      glowColor: 'shadow-[0_0_40px_rgba(34,211,238,0.3),0_0_80px_rgba(20,184,166,0.2)]',
      scaleClass: 'scale-95'
    },
    holdAfterExhale: { 
      text: 'REST HERE', 
      gradient: 'from-teal-400/20 via-blue-500/20 to-cyan-600/20',
      glowColor: 'shadow-[0_0_40px_rgba(20,184,166,0.3),0_0_80px_rgba(59,130,246,0.2)]',
      scaleClass: 'scale-95'
    },
  };

  const currentInfo = stageInfo[currentStage.name];

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 relative w-full px-4">
      {/* Simple explanation & Safety Notice */}
      <div className="max-w-md w-full">
        <p className="text-xs sm:text-sm text-white/60 mb-2">
          💡 <span className="font-medium">Why this helps:</span> Controlled breathing can help activate your body's natural calming response, bringing a sense of ease.
        </p>
        <p className="text-xs sm:text-sm text-white/50 italic">
          You can return to natural breathing anytime. If you feel dizzy or uncomfortable, simply pause and breathe normally.
        </p>
      </div>

      {/* Enhanced Breathing Orb */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center" key={currentStageIndex}>
        {/* Outer glow layers */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 opacity-40 blur-[60px] transition-all ease-linear"
          style={{ 
            transitionDuration: `${currentStage.duration}ms`,
            transform: currentStage.name === 'inhale' || currentStage.name === 'hold' ? 'scale(1.25)' : 'scale(0.85)',
            transitionTimingFunction: 'ease-in-out'
          }}
        ></div>
        
        <div 
          className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 opacity-50 blur-[40px] transition-all ease-linear"
          style={{ 
            transitionDuration: `${currentStage.duration}ms`,
            transform: currentStage.name === 'inhale' || currentStage.name === 'hold' ? 'scale(1.2)' : 'scale(0.85)',
            transitionTimingFunction: 'ease-in-out'
          }}
        ></div>
        
        {/* Ring glow */}
        <div 
          className="absolute inset-16 rounded-full border-2 border-blue-400/60 transition-all ease-linear"
          style={{ 
            transitionDuration: `${currentStage.duration}ms`,
            transform: currentStage.name === 'inhale' || currentStage.name === 'hold' ? 'scale(1.15)' : 'scale(0.85)',
            boxShadow: currentStage.name === 'inhale' || currentStage.name === 'hold' 
              ? '0 0 40px rgba(59, 130, 246, 0.9), inset 0 0 40px rgba(6, 182, 212, 0.6)'
              : '0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.2)',
            transitionTimingFunction: 'ease-in-out'
          }}
        ></div>
        
        {/* Main orb */}
        <div className="relative z-10">
          <div
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 backdrop-blur-xl flex items-center justify-center transition-all ease-linear"
            style={{ 
              transitionDuration: `${currentStage.duration}ms`,
              transform: currentStage.name === 'inhale' || currentStage.name === 'hold' ? 'scale(1.15)' : 'scale(0.85)',
              boxShadow: currentStage.name === 'inhale' || currentStage.name === 'hold'
                ? '0 0 60px rgba(6, 182, 212, 0.9), 0 0 120px rgba(59, 130, 246, 0.7), inset 0 0 60px rgba(255, 255, 255, 0.3)'
                : '0 0 30px rgba(6, 182, 212, 0.4), 0 0 60px rgba(59, 130, 246, 0.2), inset 0 0 30px rgba(255, 255, 255, 0.05)',
              transitionTimingFunction: 'ease-in-out'
            }}
          >
            {/* Inner bright core */}
            <div 
              className="absolute inset-12 rounded-full bg-gradient-to-br from-cyan-300/60 via-teal-300/50 to-transparent blur-md transition-all ease-linear"
              style={{ 
                transitionDuration: `${currentStage.duration}ms`,
                opacity: currentStage.name === 'inhale' || currentStage.name === 'hold' ? 0.7 : 0.2,
                transitionTimingFunction: 'ease-in-out'
              }}
            ></div>
            
            {/* Top highlight */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/30 rounded-full blur-lg"></div>
            
            {/* Content */}
            <div className="relative text-center z-10">
              <p className="text-xs sm:text-sm md:text-base font-light text-white tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2 drop-shadow-lg">
                {currentInfo.text}
              </p>
              <p className="text-4xl sm:text-5xl md:text-6xl font-extralight text-white drop-shadow-lg">{Math.ceil(countdown)}</p>
            </div>
          </div>
        </div>

        {/* Particle effects */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-particle-float opacity-60"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: '4s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex gap-3">
        {stages.map((stage, index) => (
          <div
            key={stage.name + index}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentStageIndex 
                ? 'w-12 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]' 
                : 'w-8 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Permissive guidance */}
      <p className="text-sm text-white/50 max-w-md px-4">
        Follow the rhythm at your own pace. There's no pressure to match it perfectly - simply allow your breath to find its natural flow.
      </p>
    </div>
  );
};

export default BreathworkAnimator;