import React, { useState, useEffect, useRef } from 'react';
import { PersonalizedSessionData, SessionStep, UserProfile } from '../types';
import BreathworkAnimator from './BreathworkAnimator';
import { CloseIcon, SparklesIcon, BrainIcon, ShareIcon } from './Icons';
import SoundscapePlayer from './SoundscapePlayer';
import GratitudeInput from './GratitudeInput';
import QuickWinTrivia from './QuickWinTrivia';
import userService from '../services/user.service';

interface PersonalizedSessionProps {
  session: PersonalizedSessionData;
  onComplete: () => void;
  userProfile: UserProfile;
  mood?: string;
}

const MeditationPlayer: React.FC<{ script: string; title: string }> = ({ script, title }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 w-full max-w-2xl">
      <h2 className="text-2xl font-light text-white/90 tracking-wide mb-2">{title}</h2>
      <div className="bg-white/5 rounded-lg p-4 text-white/80 text-lg font-light mb-4 whitespace-pre-line" style={{ minHeight: 120 }}>{script}</div>
    </div>
  );
};

const IntegratedSoundscapePlayer: React.FC<{ soundscape?: PersonalizedSessionData['soundscape']; userProfile?: UserProfile; mood?: string; }> = () => {
  // Silent placeholder — audio disabled by design
  return null;
};

const PersonalizedSession: React.FC<PersonalizedSessionProps> = ({ session, onComplete, userProfile, mood }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showGratitude, setShowGratitude] = useState(false);
  const [showTrivia, setShowTrivia] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gratitudeLoading, setGratitudeLoading] = useState(false);
  const [gratitudeSaved, setGratitudeSaved] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false); // State to control breathing step visibility


  // Use session steps directly (no frequency step)
  const steps = session.steps;
  // Freeze step progression when in gratitude, trivia, or completion
  const freezeSteps = showGratitude || showTrivia || showCompletion;
  const currentStep = steps[freezeSteps ? Math.min(currentStepIndex, steps.length - 1) : currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  // Prevent any further UI or step changes after gratitude, trivia, or completion

  // --- Handlers must be defined before any usage in JSX below ---
  const handleGratitudeSubmit = async (word: string) => {
    setGratitudeLoading(true);
    setGratitudeSaved(true);
    setShowGratitude(false);
    setTimeout(() => {
      setShowTrivia(true);
    }, 800);
    try {
      await userService.addGratitudeEntry({ word, date: new Date().toISOString() });
    } catch (e) {
      // Optionally show error, but still proceed
    } finally {
      setGratitudeLoading(false);
    }
  };

  const handleGratitudeSkip = () => {
    setShowGratitude(false);
    setShowTrivia(true);
  };

  const handleTriviaComplete = () => {
    setShowTrivia(false);
    setShowCompletion(true);
  };

  const handleTriviaSkip = () => {
    setShowTrivia(false);
    setShowCompletion(true);
  };

  const handleShare = async (affirmationText: string) => {
    const shareData = {
      title: `My Kaya Affirmation`,
      text: `A moment of intention from my Kaya session: "${affirmationText}"`,
    };

    if ((navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Clipboard error:', err);
      }
    }
  };


  // Ambient sound integration for breathwork step
  const isBreathworkStep = currentStep.type === 'breathwork';
  const ambientSoundRef = useRef<any>(null);
  useEffect(() => {
    if (isBreathworkStep) {
      // Play ambient sound using SoundscapePlayer logic (headless)
      if (ambientSoundRef.current && ambientSoundRef.current.playAmbient) {
        ambientSoundRef.current.playAmbient();
      }
    } else {
      if (ambientSoundRef.current && ambientSoundRef.current.stopAmbient) {
        ambientSoundRef.current.stopAmbient();
      }
    }
    return () => {
      if (ambientSoundRef.current && ambientSoundRef.current.stopAmbient) {
        ambientSoundRef.current.stopAmbient();
      }
    };
  }, [isBreathworkStep]);

  // When the local flow reaches the completion stage, notify the parent to show the global completion screen
  useEffect(() => {
    if (showCompletion) {
      // allow a short moment for any local animation to finish before completing
      const t = setTimeout(() => {
        try {
          onComplete();
        } catch (err) {
          console.error('Error calling onComplete from PersonalizedSession:', err);
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, [showCompletion, onComplete]);

  const renderStepContent = (step: SessionStep) => {
    switch (step.type) {
      case 'affirmation':
        return (
          <div className="text-center space-y-6 animate-fade-in">
            <SparklesIcon className="w-12 h-12 mx-auto text-cyan-300 drop-shadow" />
            <h2 className="text-3xl font-light text-cyan-100 font-brand">A Moment of Intention</h2>
            <p className="text-sm text-cyan-200/80 max-w-md mx-auto mb-4">
              Take this in at your own pace. You can repeat it silently, or simply let it resonate.
            </p>
            <div className="flex items-center justify-center gap-x-4 max-w-2xl mx-auto">
              <p className="text-2xl md:text-3xl text-white/90 italic animate-gentle-pulse">"{step.data.text}"</p>
              <button
                onClick={() => handleShare(step.data.text)}
                className="flex-shrink-0 p-3 bg-cyan-400/20 text-cyan-100 rounded-full hover:bg-cyan-400/30 transition-colors"
                aria-label="Share affirmation"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
            {copied && <div className="text-sm text-cyan-200 animate-fade-in">Copied to clipboard!</div>}
          </div>
        );
      case 'breathwork':
        // Handler for skip button: go to gratitude and post a gratitude note
        const handleAmbientSkip = async () => {
          setShowGratitude(true);
          setShowBreathing(false); // Ensure breathing step is hidden
          // Post a gratitude note to the constellation (can be a default/empty note or prompt user)
          try {
            await userService.addGratitudeEntry({ word: 'Grateful for a mindful pause', date: new Date().toISOString() });
          } catch (e) {
            // Optionally handle error
          }
        };
        // Attach handler to window for SoundscapePlayer to call
        (window as any).onAmbientSkip = handleAmbientSkip;
        return (
          <div className="w-full flex flex-col items-center animate-fade-in">
            {/* Ambient sound is played in the background, no UI */}
            <BreathworkAnimator breathwork={step.data} variant="standard" />
            <SoundscapePlayer
              ref={ambientSoundRef}
              title="Ambient Calm"
              description="Soothing ambient sound for your breath."
              concerns={userProfile.goals.length ? userProfile.goals : ['meditation']}
              timeOfDay={userProfile.preferredTime || undefined}
              hideUI={true}
            />
          </div>
        );
      default:
        return <div />;
    }
  };

  // Added handleNext function to manage step progression.
  const handleNext = () => {
    if (isLastStep) {
      setShowGratitude(true);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <IntegratedSoundscapePlayer soundscape={session.soundscape} userProfile={userProfile} mood={mood} />
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-white">{session.title}</h1>
          <button onClick={() => onComplete()} aria-label="Close session" className="p-2">
            <CloseIcon className="w-5 h-5 text-white/80" />
          </button>
        </div>
        <p className="text-sm text-white/60 mt-2">{session.description}</p>
      </div>

      {/* Main session steps */}
      {!showGratitude && !showTrivia && !showCompletion && (
        <>
          <div className="space-y-6">{renderStepContent(currentStep)}</div>
          <div className="mt-6 flex items-center justify-between">
            <div />
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition"
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </>
      )}

      {/* Gratitude input step */}
      {showGratitude && !showTrivia && !showCompletion && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
          <GratitudeInput onSubmit={handleGratitudeSubmit} loading={gratitudeLoading} />
          <button onClick={handleGratitudeSkip} className="mt-6 px-6 py-2 bg-cyan-400/80 text-cyan-900 font-semibold rounded-full shadow hover:bg-cyan-300 transition-colors text-base">Skip</button>
          {gratitudeSaved && <div className="text-green-400 mt-4 animate-fade-in">Gratitude saved! 🌟</div>}
        </div>
      )}

      {/* Trivia step */}
      {showTrivia && !showCompletion && (
        <QuickWinTrivia
          compact={true}
          onComplete={(points) => {
            setShowTrivia(false);
            setShowCompletion(true);
          }}
          onSkip={() => {
            setShowTrivia(false);
            setShowCompletion(true);
          }}
        />
      )}

    </div>
  );
};

export default PersonalizedSession;
