
import React, { useState, useEffect } from 'react';
import { BookOpenIcon, StarIcon, TreeIcon } from './Icons';
import { SessionHistoryEntry, GratitudeEntry } from '../types';
import QuickWinTrivia from './QuickWinTrivia';

interface PostSessionScreenProps {
  onAddGratitude: (word: string) => void;
  onDone: () => void;
  gratitudeEntries: GratitudeEntry[];
  onSaveReflection: (reflectionText: string) => void;
}

const PostSessionScreen: React.FC<PostSessionScreenProps> = ({ onAddGratitude, onDone, gratitudeEntries, onSaveReflection }) => {
  // Show trivia 50% of the time for quick dopamine hit
  const [showTrivia, setShowTrivia] = useState(Math.random() > 0.5);

  // Handle trivia completion
  const handleTriviaComplete = (earnedPoints: number) => {
    if (earnedPoints > 0) {
      // Show celebration animation
      console.log(`🎉 Earned ${earnedPoints} points from trivia!`);
    }
    setShowTrivia(false);
  };

  const handleTriviaSkip = () => {
    setShowTrivia(false);
  };

  const renderMain = () => (
    <>
      <h1 className="text-4xl font-light text-white mb-4">Session Complete</h1>
      <p className="text-white/70 mb-8">Beautiful work. Your breath is your anchor.</p>
      
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full flex items-center justify-center animate-gentle-pulse">
        <StarIcon className="w-8 h-8 text-cyan-400" />
      </div>

      <button
        onClick={onDone}
        className="w-full max-w-xs mx-auto px-10 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transform hover:scale-105 transition shadow-lg shadow-cyan-500/30"
      >
        Continue
      </button>
    </>
  );

  return (
    <>
      {/* Show trivia overlay first if enabled */}
      {showTrivia && (
        <QuickWinTrivia 
          onComplete={handleTriviaComplete}
          onSkip={handleTriviaSkip}
        />
      )}

      <div className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 animate-fade-in text-center flex flex-col items-center">
        {renderMain()}
      </div>
    </>
  );
};

export default PostSessionScreen;