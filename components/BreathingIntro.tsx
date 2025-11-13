import React, { useState, useEffect } from 'react';

interface BreathingIntroProps {
  onComplete: (feeling: string) => void;
}

const BreathingIntro: React.FC<BreathingIntroProps> = ({ onComplete }) => {
    // Sound frequency oscillator state
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
    const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
    const FREQUENCY = 432; // Hz (can change to 528, 396, etc.)
  const [phase, setPhase] = useState<'intro' | 'breathing' | 'complete'>('intro');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [selectedFeeling, setSelectedFeeling] = useState('');

  const totalCycles = 3;

  useEffect(() => {
    if (phase !== 'breathing') {
      // Cleanup: stop oscillator when phase changes away from breathing
      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch {}
        setOscillator(null);
      }
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch {}
        setAudioCtx(null);
      }
      return;
    }

    // Start oscillator on breathing phase
    if (!audioCtx) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = FREQUENCY;
      osc.connect(ctx.destination);
      osc.start();
      setOscillator(osc);
    } else if (!oscillator) {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = FREQUENCY;
      osc.connect(audioCtx.destination);
      osc.start();
      setOscillator(osc);
    }

    const breathingSequence = [
      { phase: 'inhale', duration: 4000 },
      { phase: 'hold', duration: 2000 },
      { phase: 'exhale', duration: 6000 },
      { phase: 'rest', duration: 2000 }
    ];

    let currentStep = 0;
    let currentCycle = cycleCount;

    const runBreathingCycle = () => {
      const step = breathingSequence[currentStep];
      setBreathPhase(step.phase as typeof breathPhase);

      setTimeout(() => {
        currentStep++;
        if (currentStep >= breathingSequence.length) {
          currentStep = 0;
          currentCycle++;
          setCycleCount(currentCycle);

          if (currentCycle >= totalCycles) {
            setPhase('complete');
            return;
          }
        }
        runBreathingCycle();
      }, step.duration);
    };

    runBreathingCycle();
    // Cleanup: stop oscillator when phase changes
    return () => {
      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch {}
        setOscillator(null);
      }
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch {}
        setAudioCtx(null);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const feelings = [
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'relaxed', label: 'Relaxed', emoji: '😊' },
    { id: 'centered', label: 'Centered', emoji: '🧘' },
    { id: 'peaceful', label: 'Peaceful', emoji: '✨' },
    { id: 'curious', label: 'Curious', emoji: '🤔' },
    { id: 'unsure', label: 'Not sure yet', emoji: '🤷' }
  ];

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in slowly...';
      case 'hold': return 'Hold gently...';
      case 'exhale': return 'Breathe out completely...';
      case 'rest': return 'Rest...';
    }
  };

  const getOrbScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1.0;
      case 'rest': return 1.0;
    }
  };

  const getTransitionDuration = () => {
    switch (breathPhase) {
      case 'inhale': return 4000;
      case 'exhale': return 6000;
      case 'hold': return 2000;
      case 'rest': return 2000;
    }
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Orb */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 rounded-full">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.6)] animate-gentle-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 blur-md animate-core-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white">
            Welcome to Your Calm Universe
          </h1>
          
          <p className="text-lg text-white/70 max-w-lg mx-auto font-light">
            Before we begin, let's take a moment together.<br/>
            A simple breathing exercise to center yourself.
          </p>

          <button
            onClick={() => setPhase('breathing')}
            className="px-12 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Let's Begin
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'breathing') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          {/* Progress */}
          <div className="text-white/50 text-sm">
            Breath {cycleCount + 1} of {totalCycles}
          </div>

          {/* Breathing Orb */}
          <div className="flex justify-center">
            <div 
              className="relative w-40 h-40 rounded-full ease-in-out"
              style={{
                transform: `scale(${getOrbScale()})`,
                transition: `transform ${getTransitionDuration()}ms ease-in-out`
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 shadow-[0_0_100px_rgba(6,182,212,0.8)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 blur-lg animate-core-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Instruction */}
          <div className="space-y-4">
            <p className="text-2xl sm:text-3xl text-white font-light animate-fade-in">
              {getBreathInstruction()}
            </p>
            <p className="text-white/50 text-sm">
              Follow the orb as it expands and contracts
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Complete phase
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Orb */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 rounded-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.6)] animate-gentle-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 blur-md animate-core-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extralight text-white">
          How do you feel?
        </h2>

        <p className="text-white/60 text-lg font-light">
          Take a moment to notice what's present for you
        </p>

        {/* Feeling Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto mt-8">
          {feelings.map(feeling => (
            <button
              key={feeling.id}
              onClick={() => setSelectedFeeling(feeling.id)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                selectedFeeling === feeling.id
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
            >
              <div className="text-3xl mb-2">{feeling.emoji}</div>
              <div className="text-white text-sm font-light">{feeling.label}</div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        {selectedFeeling && (
          <button
            onClick={() => onComplete(selectedFeeling)}
            className="mt-8 px-12 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl animate-fade-in"
          >
            Continue
          </button>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
        }
        @keyframes gentle-pulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-gentle-pulse {
          animation: gentle-pulse 4s ease-in-out infinite;
        }
        @keyframes core-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-core-pulse {
          animation: core-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BreathingIntro;
