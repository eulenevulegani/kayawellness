
import React, { useState, useEffect, useRef } from 'react';
import { Activity } from '../types';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import BreathworkAnimator from './BreathworkAnimator';
import SoundscapePlayer from './SoundscapePlayer';
import { CloseIcon, PlayIcon, PauseIcon } from './Icons';

interface ActivityPlayerProps {
  activity: Activity;
  onClose: () => void;
}

const MeditationPlayer: React.FC<{ script: string, title: string }> = ({ script, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const audioData = await generateSpeech(script);
        if (!audioData) throw new Error("Failed to generate audio.");
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decodedBuffer = await decodeAudioData(decode(audioData), audioContextRef.current, 24000, 1);
        audioBufferRef.current = decodedBuffer;
        
      } catch (err) {
        console.error(err);
        setError("Could not load audio. Please close and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    initAudio();

    return () => {
      sourceRef.current?.stop();
      audioContextRef.current?.close();
    }
  }, [script]);

  const togglePlayback = () => {
    if (!audioContextRef.current || !audioBufferRef.current) return;
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }
    if (isPlaying) {
      sourceRef.current?.stop();
      setIsPlaying(false);
    } else {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      sourceRef.current = source;
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
        <h2 className="text-3xl font-light text-white">{title}</h2>
        <p className="text-white/70 italic max-w-md">{script}</p>
        {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 h-20">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-white/60">Preparing meditation...</p>
            </div>
        ) : error ? (
            <p className="text-red-400/80">{error}</p>
        ) : (
            <button onClick={togglePlayback} className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50">
                {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
            </button>
        )}
    </div>
  );
};


const ActivityPlayer: React.FC<ActivityPlayerProps> = ({ activity, onClose }) => {
  const renderActivity = () => {
    switch(activity.type) {
      case 'meditation':
        return <MeditationPlayer script={activity.data.script} title={activity.data.title} />;
      case 'breathwork':
        return (
            <div className="flex flex-col items-center text-center space-y-8 w-full max-w-2xl">
                 <h2 className="text-2xl font-light text-white/90 tracking-wide">{activity.data.title}</h2>
                <BreathworkAnimator breathwork={activity.data} />
            </div>
        );
      case 'soundscape':
        return <SoundscapePlayer title={activity.data.title} description={activity.data.description} />;
      default:
        return <p>Unknown activity type.</p>
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center animate-fade-in">
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white transition z-10">
                <CloseIcon className="w-8 h-8"/>
            </button>
            <main className="flex-grow flex items-center justify-center">
                {renderActivity()}
            </main>
        </div>
    </div>
  );
};

export default ActivityPlayer;