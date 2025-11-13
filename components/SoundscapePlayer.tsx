
import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon } from './Icons';
import { frequencyGenerator, getFrequenciesForConcern, generateSoundscapeConfig } from '../services/frequencyService';

interface SoundscapePlayerProps {
  title: string;
  description: string;
  concerns?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | string;
}


// All ambient/fallback sound URLs removed for a silent experience
// getSoundscapeUrl is now a no-op
const getSoundscapeUrl = (title: string): string => '';

const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({ 
  title, 
  description, 
  concerns = ['meditation'],
  timeOfDay = 'afternoon'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState<string>('');
  // Removed audioRef for silent soundscapes

  // Determine current time of day if not provided
  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const validTimeOfDay = (timeOfDay === 'morning' || timeOfDay === 'afternoon' || timeOfDay === 'evening' || timeOfDay === 'night') 
    ? timeOfDay 
    : getCurrentTimeOfDay();

  // Get soundscape configuration based on concerns
  const soundscapeConfig = generateSoundscapeConfig(concerns, validTimeOfDay, 10);
  const frequencies = soundscapeConfig.frequencies;

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      frequencyGenerator.stop();
    };
  }, []);

  const togglePlayback = () => {
    if (isPlaying) {
      frequencyGenerator.stop();
      setIsPlaying(false);
      setActiveFrequency('');
    } else {
      setIsLoading(true);
      frequencyGenerator.playSoundscape(soundscapeConfig);
      if (frequencies.length > 0) {
        setActiveFrequency(frequencies[0].name);
      }
      setIsLoading(false);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <p className="text-white/80">{description}</p>
      
      {/* Frequency Information */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-cyan-300 mb-3">Therapeutic Frequencies</h4>
        <div className="space-y-2">
          {frequencies.slice(0, 3).map((freq, index) => (
            <div key={index} className="text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">{freq.name}</span>
                <span className="text-xs text-cyan-400">{freq.baseFrequency} Hz</span>
              </div>
              <p className="text-xs text-white/60">{freq.description}</p>
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 h-20">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm">Initializing frequencies...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={togglePlayback}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 ${
              isPlaying 
                ? 'bg-cyan-500/30 hover:bg-cyan-500/40 animate-pulse-slow' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label={isPlaying ? 'Pause soundscape' : 'Play soundscape'}
          >
            {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
          </button>
          
          {isPlaying && activeFrequency && (
            <div className="text-center">
              <p className="text-xs text-white/60">Now playing:</p>
              <p className="text-sm font-medium text-cyan-300">{activeFrequency}</p>
            </div>
          )}
        </div>
      )}

      {/* Benefits Display */}
      {frequencies.length > 0 && (
        <div className="w-full max-w-md bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-400/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-2">✨ Benefits</h4>
          <ul className="text-xs text-white/70 space-y-1">
            {frequencies[0].benefits.slice(0, 3).map((benefit, index) => (
              <li key={index}>• {benefit}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SoundscapePlayer;
