
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { PlayIcon, PauseIcon } from './Icons';
import { frequencyGenerator, getFrequenciesForConcern, generateSoundscapeConfig } from '../services/frequencyService';

interface SoundscapePlayerProps {
  title: string;
  description: string;
  concerns?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | string;
  hideUI?: boolean;
}


// All ambient/fallback sound URLs removed for a silent experience
// getSoundscapeUrl is now a no-op
const getSoundscapeUrl = (title: string): string => '';

const SoundscapePlayer = forwardRef(function SoundscapePlayer(
  props: SoundscapePlayerProps,
  ref
) {
  const { title, description, concerns = ['meditation'], timeOfDay = 'afternoon', hideUI = false } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState<string>('');
  const localRef = useRef<any>(null);

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

  // Expose imperative methods to parent via ref
  useImperativeHandle(ref, () => ({
    playAmbient: () => {
      try {
        frequencyGenerator.playSoundscape(soundscapeConfig);
        setIsPlaying(true);
      } catch (e) {
        console.error('Failed to play ambient:', e);
      }
    },
    stopAmbient: () => {
      frequencyGenerator.stop();
      setIsPlaying(false);
    }
  }));

  // Auto-play when hide UI is desired (useful for in-session ambient)
  useEffect(() => {
    if (hideUI) {
      try {
        frequencyGenerator.playSoundscape(soundscapeConfig);
        setIsPlaying(true);
      } catch (e) {
        // may require user gesture
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideUI]);

  return (
    <div ref={localRef} className="flex flex-col items-center space-y-6 text-center">
      <p className="text-white/80">{description}</p>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 h-20">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm">Initializing ambient sound...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* Skip button for ambient sound */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                frequencyGenerator.stop();
                setIsPlaying(false);
              }
              if (typeof (window as any).onAmbientSkip === 'function') {
                (window as any).onAmbientSkip();
              }
            }}
            className="mt-4 px-8 py-2 bg-cyan-400/80 text-cyan-900 font-semibold rounded-full shadow hover:bg-cyan-300 transition-colors text-base"
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
});

export default SoundscapePlayer;
