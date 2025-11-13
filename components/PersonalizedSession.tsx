import React, { useState, useEffect, useRef } from 'react';
import { PersonalizedSessionData, SessionStep, UserProfile } from '../types';
import { generateSpeech, generateMeditationVisual } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import BreathworkAnimator from './BreathworkAnimator';
import { CloseIcon, PlayIcon, PauseIcon, SparklesIcon, LungIcon, BrainIcon, ShareIcon } from './Icons';

interface PersonalizedSessionProps {
  session: PersonalizedSessionData;
  onComplete: () => void;
  userProfile: UserProfile;
}

const MeditationPlayer: React.FC<{ script: string, title: string, onAudioEnd: () => void }> = ({ script, title, onAudioEnd }) => {
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
        setError("Could not load audio. Please try again.");
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
      if (sourceRef.current) {
        // Prevent onended from firing on manual stop, which would incorrectly advance the session.
        sourceRef.current.onended = null;
        sourceRef.current.stop();
      }
      setIsPlaying(false);
    } else {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsPlaying(false);
        onAudioEnd();
      };
      source.start();
      sourceRef.current = source;
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
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

const getSoundscapeUrl = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  // Using reliable free audio sources
  if (lowerTitle.includes('rain')) return 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3';
  if (lowerTitle.includes('forest') || lowerTitle.includes('meadow') || lowerTitle.includes('sunlit')) return 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3';
  if (lowerTitle.includes('cosmic') || lowerTitle.includes('space') || lowerTitle.includes('drift')) return 'https://assets.mixkit.co/active_storage/sfx/513/513-preview.mp3';
  if (lowerTitle.includes('ocean') || lowerTitle.includes('waves')) return 'https://assets.mixkit.co/active_storage/sfx/2472/2472-preview.mp3';
  // Fallback sound - gentle ambient
  return 'https://assets.mixkit.co/active_storage/sfx/2466/2466-preview.mp3';
};

const IntegratedSoundscapePlayer: React.FC<{ soundscape: PersonalizedSessionData['soundscape'] }> = ({ soundscape }) => {
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioUrl = getSoundscapeUrl(soundscape.title);

    useEffect(() => {
        const audio = new Audio(audioUrl);
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        const handleCanPlay = () => {
            setIsLoading(false);
            audio.play().catch(() => {}); // Autoplay, ignore error if blocked
        };
        audio.addEventListener('canplaythrough', handleCanPlay);

        return () => {
            audio.removeEventListener('canplaythrough', handleCanPlay);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    return null;
};


const PersonalizedSession: React.FC<PersonalizedSessionProps> = ({ session, onComplete, userProfile }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const currentStep = session.steps[currentStepIndex];
  const isLastStep = currentStepIndex === session.steps.length - 1;
  
  // State for generative visuals
  const [currentVisual, setCurrentVisual] = useState<string | null>(null);
  const [nextVisual, setNextVisual] = useState<string | null>(null);
  const visualIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const cleanup = () => {
      if (visualIntervalRef.current) {
        clearInterval(visualIntervalRef.current);
        visualIntervalRef.current = null;
      }
      setCurrentVisual(null);
      setNextVisual(null);
    };

    if (userProfile.subscriptionTier === 'premium' && currentStep.type === 'meditation') {
      const fetchVisual = async (isInitial = false) => {
        try {
          const prompt = `Abstract art for meditation on '${currentStep.data.title}'. Keywords: calm, flowing, ethereal.`;
          const newVisual = await generateMeditationVisual(prompt);
          
          if (isInitial) {
            setCurrentVisual(newVisual);
          } else {
            setNextVisual(newVisual);
            // The timeout handles the state swap *after* the CSS transition completes
            setTimeout(() => {
              setCurrentVisual(newVisual);
              setNextVisual(null);
            }, 2000); // This MUST match the transition duration
          }
        } catch (error) {
          console.error("Failed to fetch meditation visual:", error);
        }
      };

      fetchVisual(true); // Initial fetch
      visualIntervalRef.current = window.setInterval(() => fetchVisual(false), 15000);
    }

    return cleanup;
  }, [currentStep.type, currentStep.data, userProfile.subscriptionTier]);


  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  
  const handleShare = async (affirmationText: string) => {
    const shareData = {
        title: `My Kaya Affirmation`,
        text: `A moment of intention from my Kaya session: "${affirmationText}"`,
    };
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error("Error sharing:", err);
        }
    } else {
        navigator.clipboard.writeText(shareData.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };


  const renderStepContent = (step: SessionStep) => {
    switch (step.type) {
      case 'affirmation':
        return (
          <div className="text-center space-y-6">
            <SparklesIcon className="w-12 h-12 mx-auto text-white/80"/>
            <h2 className="text-3xl font-light text-white">A Moment of Intention</h2>
            <p className="text-sm text-white/60 max-w-md mx-auto mb-4">
              Take this in at your own pace. You can repeat it silently, or simply let it resonate.
            </p>
            <div className="flex items-center justify-center gap-x-4 max-w-2xl mx-auto">
              <p className="text-2xl md:text-3xl text-white/90 italic animate-gentle-pulse">
                "{step.data.text}"
              </p>
              <button
                  onClick={() => handleShare(step.data.text)}
                  className="flex-shrink-0 p-3 bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Share affirmation"
              >
                  <ShareIcon className="w-5 h-5"/>
              </button>
            </div>
            {copied && (
                <div className="text-sm text-white/80 animate-fade-in">
                    Copied to clipboard!
                </div>
            )}
          </div>
        );
      case 'breathwork':
        return (
          <div className="text-center space-y-6">
            <LungIcon className="w-12 h-12 mx-auto text-white/80"/>
            <h2 className="text-3xl font-light text-white">{step.data.title}</h2>
            <BreathworkAnimator breathwork={step.data} />
          </div>
        );
      case 'meditation':
        return (
           <div className="text-center space-y-6 max-w-3xl mx-auto">
            <BrainIcon className="w-12 h-12 mx-auto text-white/80"/>
            <h2 className="text-3xl font-light text-white">{step.data.title}</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left space-y-3">
              <p className="text-xs text-white/50 italic">
                💡 You can pause or stop anytime. Whatever you notice during this practice is welcome.
              </p>
              <p className="text-white/80 whitespace-pre-line leading-relaxed">{step.data.script}</p>
            </div>
            <MeditationPlayer script={step.data.script} title={step.data.title} onAudioEnd={handleNext} />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex flex-col items-center justify-center animate-fade-in p-4 overflow-hidden">
        {/* Generative Visuals Background */}
        <div className="absolute inset-0 z-0">
            <div 
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
                style={{ 
                    backgroundImage: currentVisual ? `url(${currentVisual})` : 'none',
                    opacity: nextVisual ? 0 : 1,
                }}
            />
            <div 
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
                style={{ 
                    backgroundImage: nextVisual ? `url(${nextVisual})` : 'none',
                    opacity: nextVisual ? 1 : 0,
                }}
            />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full p-4 flex items-center gap-4">
                <div className="flex-grow flex items-center space-x-2">
                    {session.steps.map((_, index) => (
                        <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white rounded-full transition-transform duration-500 ease-out"
                                style={{ 
                                    transform: index < currentStepIndex ? 'scaleX(1)' : 'scaleX(0)',
                                    transformOrigin: 'left'
                                }}
                            />
                        </div>
                    ))}
                </div>
                <button onClick={onComplete} className="p-2 -m-2 text-white/50 hover:text-white transition">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>

            <IntegratedSoundscapePlayer soundscape={session.soundscape} />

            <main className="flex-grow flex items-center justify-center w-full px-4">
                {renderStepContent(currentStep)}
            </main>

            {currentStep.type !== 'meditation' && (
                <footer className="w-full p-4">
                    <button
                        onClick={handleNext}
                        className="w-full max-w-xs mx-auto px-12 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition duration-300"
                    >
                        {isLastStep ? 'Finish Session' : 'Next'}
                    </button>
                </footer>
            )}
        </div>
    </div>
  );
};

export default PersonalizedSession;
