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
  const [gratitudeLoading, setGratitudeLoading] = useState(false);
  const [gratitudeSaved, setGratitudeSaved] = useState(false);

  // Insert frequency sound step after breathwork
  const stepsWithFrequency = React.useMemo(() => {
    const steps = [...session.steps];
    // Find first breathwork step
    const breathworkIdx = steps.findIndex(s => s.type === 'breathwork');
    if (breathworkIdx !== -1 && !steps.some(s => s.type === 'frequency')) {
      steps.splice(breathworkIdx + 1, 0, { type: 'frequency', data: {} });
    }
    return steps;
  }, [session.steps]);

  const currentStep = stepsWithFrequency[currentStepIndex];
  const isLastStep = currentStepIndex === stepsWithFrequency.length - 1;

  const visualIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (visualIntervalRef.current) {
        clearInterval(visualIntervalRef.current);
        visualIntervalRef.current = null;
      }
    };
  }, []);

  // When session steps are done, show gratitude input
  useEffect(() => {
    if (isLastStep && !showGratitude && !showTrivia) {
      setShowGratitude(true);
    }
  }, [isLastStep, showGratitude, showTrivia]);

  const handleNext = () => {
    if (isLastStep) {
      setShowGratitude(true);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

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

  const handleTriviaComplete = () => {
    setShowTrivia(false);
    onComplete();
  };

  const handleTriviaSkip = () => {
    setShowTrivia(false);
    onComplete();
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

  // Frequency step state (for immersive sound/skip)
  const isFrequencyStep = currentStep.type === 'frequency';
  const [frequencyPlaying, setFrequencyPlaying] = React.useState(false);
  React.useEffect(() => {
    if (isFrequencyStep) {
      setFrequencyPlaying(true);
      // Determine session length in minutes
      let sessionMinutes = 10;
      if (userProfile.sessionLengthPreference === '3-5') sessionMinutes = 4;
      else if (userProfile.sessionLengthPreference === '10-15') sessionMinutes = 12;
      else if (userProfile.sessionLengthPreference === '20-30') sessionMinutes = 25;
      else if (userProfile.sessionLengthPreference === '30+') sessionMinutes = 35;
      else if (userProfile.sessionLength === 'short') sessionMinutes = 4;
      else if (userProfile.sessionLength === 'medium') sessionMinutes = 12;
      else if (userProfile.sessionLength === 'long') sessionMinutes = 25;
      const timeout = setTimeout(() => {
        if (isFrequencyStep) handleNext();
      }, sessionMinutes * 60 * 1000);
      return () => clearTimeout(timeout);
    } else {
      setFrequencyPlaying(false);
    }
  }, [isFrequencyStep]);

  const renderStepContent = (step: SessionStep) => {
    switch (step.type) {
      case 'frequency':
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 relative w-full px-4 bg-gradient-to-br from-black via-slate-900 to-black animate-fade-in">
            <div className="w-full max-w-lg mx-auto">
              <SoundscapePlayer
                title="Frequency Immersion"
                description="Let the therapeutic frequencies wash over you. You can close your eyes, breathe, and simply be."
                concerns={userProfile.goals.length ? userProfile.goals : ['meditation']}
                timeOfDay={userProfile.preferredTime || undefined}
              />
            </div>
            <button
              onClick={handleNext}
              className="mt-8 px-12 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Skip
            </button>
          </div>
        );
      case 'affirmation':
        return (
          <div className="text-center space-y-6">
            <SparklesIcon className="w-12 h-12 mx-auto text-white/80" />
            <h2 className="text-3xl font-light text-white">A Moment of Intention</h2>
            <p className="text-sm text-white/60 max-w-md mx-auto mb-4">
              Take this in at your own pace. You can repeat it silently, or simply let it resonate.
            </p>
            <div className="flex items-center justify-center gap-x-4 max-w-2xl mx-auto">
              <p className="text-2xl md:text-3xl text-white/90 italic animate-gentle-pulse">"{step.data.text}"</p>
              <button
                onClick={() => handleShare(step.data.text)}
                className="flex-shrink-0 p-3 bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Share affirmation"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
            {copied && <div className="text-sm text-white/80 animate-fade-in">Copied to clipboard!</div>}
          </div>
        );
      case 'breathwork':
        // Only allow breathwork activities
        return (
          <div className="w-full flex flex-col items-center">
            <BreathworkAnimator breathwork={step.data} variant="standard" />
          </div>
        );
      default:
        return <div />;
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
      {!showGratitude && !showTrivia && (
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
      {showGratitude && !showTrivia && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
          <GratitudeInput onSubmit={handleGratitudeSubmit} loading={gratitudeLoading} />
          {gratitudeSaved && <div className="text-green-400 mt-4 animate-fade-in">Gratitude saved! 🌟</div>}
        </div>
      )}

      {/* Trivia step */}
      {showTrivia && (
        <QuickWinTrivia onComplete={handleTriviaComplete} onSkip={handleTriviaSkip} />
      )}
    </div>
  );
};

export default PersonalizedSession;
