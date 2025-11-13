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
        className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${
          isListening 
            ? 'from-rose-500 via-red-500 to-pink-600 shadow-[0_0_30px_rgba(244,63,94,0.8)]' 
            : 'from-cyan-500 via-teal-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
        } flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {/* Pulse rings when listening */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse opacity-50"></div>
          </>
        )}

        {/* Icon */}
        <MicrophoneIcon className={`w-7 h-7 text-white relative z-10 ${isListening ? 'animate-pulse' : ''}`} />

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${
          isListening ? 'from-red-400 to-pink-500' : 'from-cyan-400 to-teal-500'
        } blur-xl opacity-30 ${isListening ? 'animate-pulse' : 'animate-orb-breathe'}`}></div>
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
