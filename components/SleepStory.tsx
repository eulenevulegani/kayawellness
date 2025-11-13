
import React, { useState, useEffect, useRef } from 'react';
import { SleepStoryData } from '../types';
import { generateSleepStory, generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { ArrowLeftIcon, MoonIcon, PlayIcon, PauseIcon } from './Icons';

const Player: React.FC<{ sleepStoryData: SleepStoryData }> = ({ sleepStoryData }) => {
  const { title, story } = sleepStoryData;
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const storyBufferRef = useRef<AudioBuffer | null>(null);
  const storySourceRef = useRef<AudioBufferSourceNode | null>(null);

  const soundscapeAudioRef = useRef<HTMLAudioElement | null>(null);
  // Use a reliable ambient sound source - fallback to silence if unavailable
  const soundscapeUrl = 'https://assets.mixkit.co/active_storage/sfx/2486/2486-preview.mp3'; // Nature ambient sound

  useEffect(() => {
    const initStoryAudio = async () => {
      try {
        const audioData = await generateSpeech(story);
        if (!audioData) {
          // Text-to-speech not available yet, use text-only mode
          console.log("Text-to-speech not available, displaying story text only");
          setIsLoading(false);
          return;
        }
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decodedBuffer = await decodeAudioData(decode(audioData), audioContextRef.current, 24000, 1);
        storyBufferRef.current = decodedBuffer;
      } catch (err) {
        console.error(err);
        setError("Could not load the story's audio. You can still read the story below.");
      } finally {
        setIsLoading(false);
      }
    };
    initStoryAudio();
    
    // Initialize soundscape audio with error handling
    try {
      soundscapeAudioRef.current = new Audio(soundscapeUrl);
      soundscapeAudioRef.current.loop = true;
      soundscapeAudioRef.current.volume = 0.3; // Softer background sound
      soundscapeAudioRef.current.onerror = () => {
        console.warn('Soundscape audio failed to load, continuing without background music');
      };
    } catch (err) {
      console.warn('Failed to initialize soundscape audio:', err);
    }

    return () => {
      storySourceRef.current?.stop();
      audioContextRef.current?.close().catch(e => console.error(e));
      if (soundscapeAudioRef.current) {
          soundscapeAudioRef.current.pause();
          soundscapeAudioRef.current = null;
      }
    }
  }, [story, soundscapeUrl]);
  
  const createStorySource = (): AudioBufferSourceNode | null => {
      if (!audioContextRef.current || !storyBufferRef.current) return null;
      const source = audioContextRef.current.createBufferSource();
      source.buffer = storyBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      return source;
  }

  const togglePlayback = () => {
    if (isLoading) return;
    
    // If no audio buffer available (TTS not implemented), just toggle reading mode
    if (!storyBufferRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      storySourceRef.current?.stop();
      soundscapeAudioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const source = createStorySource();
      if (source) {
         source.start();
         storySourceRef.current = source;
      }
      soundscapeAudioRef.current?.play().catch(e => console.warn("Soundscape playback failed", e));
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 text-center animate-fade-in">
       <h2 className="text-3xl font-light text-white">{title}</h2>
       <p className="text-white/70">Close your eyes and drift away.</p>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 h-20">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-white/60">KAYA is dreaming up your story...</p>
            </div>
        ) : error ? (
            <p className="text-red-400/80">{error}</p>
        ) : (
            <button onClick={togglePlayback} className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50">
                {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
            </button>
        )}
         <div className="max-h-60 overflow-y-auto p-4 bg-black/10 rounded-lg">
            <p className="text-white/60 text-left whitespace-pre-wrap">{story}</p>
         </div>
    </div>
  );
};


const SleepStories: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [sleepStory, setSleepStory] = useState<SleepStoryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const themes = ['Enchanted Forest', 'Cosmic Journey', 'Rainy Night In', 'Peaceful Beach', 'The Whispering Library'];

  const handleGenerate = async (selectedTheme: string) => {
    setIsLoading(true);
    setSleepStory(null);
    const generatedStory = await generateSleepStory(selectedTheme);
    setSleepStory(generatedStory);
    setIsLoading(false);
  };
  
  if (sleepStory) {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center">
            <button onClick={() => setSleepStory(null)} className="absolute top-6 left-6 text-white/60 hover:text-white transition">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <Player sleepStoryData={sleepStory} />
        </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto text-center p-4 animate-fade-in">
        <button onClick={onClose} className="absolute top-6 left-6 text-white/60 hover:text-white transition">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="w-20 h-20 mb-6 bg-white/10 rounded-full flex items-center justify-center text-white/80 mx-auto">
            <MoonIcon className="w-10 h-10" />
        </div>
        <h2 className="text-3xl text-white/90 mb-2">Sleep Stories</h2>
        <p className="text-white/70 mb-8">Choose a theme and let KAYA generate a unique story to help you unwind.</p>

        {isLoading ? (
             <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-white/80 animate-pulse">KAYA is aligning with the cosmos...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map(theme => (
                <button 
                    key={theme} 
                    onClick={() => handleGenerate(theme)} 
                    className="px-4 py-6 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 transition-colors duration-200 text-lg"
                >
                    {theme}
                </button>
                ))}
            </div>
        )}
    </div>
  );
};

export default SleepStories;