import React, { useState } from 'react';
import { MicrophoneIcon } from './Icons';

interface VoiceOrbProps {
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  isListening?: boolean;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ onVoiceStart, onVoiceEnd, isListening = false }) => {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = () => {
    if (isListening) {
      onVoiceEnd?.();
      setIsPulsing(false);
    } else {
      onVoiceStart?.();
      setIsPulsing(true);
      // Haptic feedback simulation
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <button
        onClick={handleClick}
        className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isListening 
            ? 'shadow-[0_0_80px_rgba(6,182,212,0.9),0_0_120px_rgba(20,184,166,0.7)]' 
            : 'shadow-[0_0_60px_rgba(6,182,212,0.7),0_0_90px_rgba(20,184,166,0.5)]'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {/* White center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-full bg-white/90 blur-md ${
            isListening ? 'w-10 h-10 animate-pulse' : 'w-8 h-8 animate-orb-breathe'
          }`}></div>
        </div>

        {/* Pulse rings when listening */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-cyan-400/50 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full bg-teal-400/30 animate-pulse opacity-50"></div>
          </>
        )}

        {/* Icon with white background */}
        <div className="relative z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <MicrophoneIcon className={`w-5 h-5 text-cyan-600 ${isListening ? 'animate-pulse' : ''}`} />
        </div>
      </button>

      {/* Tooltip */}
      {!isListening && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-black/80 backdrop-blur-md text-white text-xs rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Hey KAYA...
        </div>
      )}
    </div>
  );
};

export default VoiceOrb;
