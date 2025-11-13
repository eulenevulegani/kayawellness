import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, StarIcon, SparklesIcon, LockClosedIcon } from './Icons';
import QuickWinTrivia from './QuickWinTrivia';

interface TriviaGameProps {
  onBack: () => void;
  onPointsEarned?: (points: number) => void;
  subscriptionTier?: 'stardust' | 'constellation' | 'universe';
}

const TriviaGame: React.FC<TriviaGameProps> = ({ onBack, onPointsEarned, subscriptionTier = 'stardust' }) => {
  const [showTrivia, setShowTrivia] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [questionsToday, setQuestionsToday] = useState(0);
  
  // Free tier: 3 questions per day
  // Paid tiers: unlimited
  const maxQuestionsPerDay = subscriptionTier === 'stardust' ? 3 : Infinity;
  const questionsRemaining = maxQuestionsPerDay - questionsToday;
  const hasQuestionsRemaining = questionsToday < maxQuestionsPerDay;

  useEffect(() => {
    // Load today's question count from localStorage
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('kaya-trivia-progress');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        if (data.date === today) {
          setQuestionsToday(data.count || 0);
          setTotalPoints(data.points || 0);
        } else {
          // New day, reset count
          localStorage.setItem('kaya-trivia-progress', JSON.stringify({ date: today, count: 0, points: 0 }));
        }
      } catch (error) {
        console.error('Failed to load trivia progress:', error);
      }
    } else {
      localStorage.setItem('kaya-trivia-progress', JSON.stringify({ date: today, count: 0, points: 0 }));
    }
  }, []);

  const handleTriviaComplete = (earnedPoints: number) => {
    const newTotalPoints = totalPoints + earnedPoints;
    const newQuestionsToday = questionsToday + 1;
    const newQuestionsCompleted = questionsCompleted + 1;
    
    setTotalPoints(newTotalPoints);
    setQuestionsToday(newQuestionsToday);
    setQuestionsCompleted(newQuestionsCompleted);
    setShowTrivia(false);
    
    if (onPointsEarned) {
      onPointsEarned(earnedPoints);
    }
    
    // Save progress to localStorage
    const today = new Date().toDateString();
    localStorage.setItem('kaya-trivia-progress', JSON.stringify({ 
      date: today, 
      count: newQuestionsToday, 
      points: newTotalPoints 
    }));
  };

  const handleTriviaSkip = () => {
    setShowTrivia(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto p-6 pt-24 pb-8">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Universe
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center animate-gentle-pulse">
            <SparklesIcon className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-4xl font-light text-white mb-3">Cosmic Trivia</h1>
          <p className="text-white/70 text-lg">Test your knowledge and earn points</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{totalPoints}</span>
            </div>
            <p className="text-xs text-white/60">Points Today</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold text-white">{questionsToday}</span>
            </div>
            <p className="text-xs text-white/60">Answered Today</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`text-2xl font-bold ${hasQuestionsRemaining ? 'text-cyan-400' : 'text-white/40'}`}>
                {questionsRemaining === Infinity ? '∞' : questionsRemaining}
              </span>
            </div>
            <p className="text-xs text-white/60">Remaining</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">How to Play</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Answer cosmic trivia questions to earn points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Each correct answer earns you 10-15 points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Learn fascinating facts about breath, wellness, and the universe</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>New questions available every session</span>
            </li>
          </ul>
        </div>

        {/* Daily limit reached */}
        {!hasQuestionsRemaining && (
          <div className="max-w-md mx-auto bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-2xl p-6 text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-400/20 rounded-full flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Daily Limit Reached!</h3>
            <p className="text-white/70 mb-4">
              You've completed your 3 free questions for today. Come back tomorrow for more!
            </p>
            <p className="text-sm text-white/50">
              Want unlimited trivia? Upgrade to Constellation or Universe tier.
            </p>
          </div>
        )}

        {/* Start button or auto-show trivia */}
        {!showTrivia && hasQuestionsRemaining && (
          <div className="text-center">
            <button
              onClick={() => setShowTrivia(true)}
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
            >
              {questionsToday === 0 ? 'Start First Question' : `Question ${questionsToday + 1} of ${maxQuestionsPerDay}`}
            </button>
          </div>
        )}
      </div>

      {/* Trivia Overlay */}
      {showTrivia && (
        <QuickWinTrivia 
          onComplete={(points) => {
            setShowTrivia(false);
            handleTriviaComplete(points);
          }}
          onSkip={() => {
            setShowTrivia(false);
            handleTriviaSkip();
          }}
        />
      )}
    </div>
  );
};

export default TriviaGame;
