import React, { useState, useEffect } from 'react';
import { StarIcon, SparklesIcon } from './Icons';

/**
 * Viral Quick-Win Hook: Post-session trivia for instant dopamine
 * Gamifies learning with bite-sized cosmic facts
 */
interface TriviaQuestion {
  id: string;
  question: string;
  fact: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: '1',
    question: 'How many breaths does the average person take per day?',
    fact: 'About 20,000 breaths per day! Each one is a chance to find calm.',
    options: ['5,000', '20,000', '50,000', '100,000'],
    correctAnswer: 1,
    points: 10,
  },
  {
    id: '2',
    question: 'Deep breathing activates which nervous system?',
    fact: 'The parasympathetic nervous system - your body\'s natural calm button.',
    options: ['Sympathetic', 'Parasympathetic', 'Central', 'Peripheral'],
    correctAnswer: 1,
    points: 15,
  },
  {
    id: '3',
    question: 'What percentage of the universe is visible matter?',
    fact: 'Only 5%! Like your calm potential - mostly unexplored.',
    options: ['5%', '25%', '50%', '75%'],
    correctAnswer: 0,
    points: 10,
  },
  {
    id: '4',
    question: 'Box breathing uses what timing pattern?',
    fact: '4-4-4-4 seconds: Inhale, Hold, Exhale, Hold. Navy SEALs use this!',
    options: ['3-3-3-3', '4-4-4-4', '5-5-5-5', '4-7-8-0'],
    correctAnswer: 1,
    points: 10,
  },
  {
    id: '5',
    question: 'Stars outnumber grains of sand on Earth?',
    fact: 'True! There are more stars in the universe than sand grains on all beaches.',
    options: ['True', 'False'],
    correctAnswer: 0,
    points: 10,
  },
];

interface QuickWinTriviaProps {
  onComplete: (earnedPoints: number) => void;
  onSkip: () => void;
  compact?: boolean;
}

const QuickWinTrivia: React.FC<QuickWinTriviaProps> = ({ onComplete, onSkip, compact = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    // Pick random question
    const randomQuestion = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
    setCurrentQuestion(randomQuestion);
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === currentQuestion?.correctAnswer;
    
    setTimeout(() => {
      setShowResult(true);
      if (isCorrect && currentQuestion) {
        setEarnedPoints(currentQuestion.points);
      }
    }, 300);
  };

  const handleContinue = () => {
    onComplete(earnedPoints);
  };

  if (!currentQuestion) return null;

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className={`w-full mx-4 ${compact ? 'max-w-sm' : 'max-w-md'}`}>
        <div className={`bg-gradient-to-br from-black via-cyan-950 to-black border border-cyan-400/20 rounded-3xl ${compact ? 'p-4' : 'p-8'} shadow-2xl`}>
          {/* Header */}
          <div className={`text-center mb-6 ${compact ? 'mb-4' : ''}`}>
            <div className={`${compact ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-4'} mx-auto bg-gradient-to-br from-cyan-400/30 to-teal-400/30 rounded-full flex items-center justify-center animate-gentle-pulse`}>
              <SparklesIcon className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-cyan-300`} />
            </div>
            <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-cyan-100 mb-2 font-brand`}>Quick Cosmic Fact</h2>
            <p className={`${compact ? 'text-xs' : 'text-sm'} text-cyan-300`}>Earn {currentQuestion.points} points</p>
          </div>

          {/* Question */}
          {!showResult ? (
            <>
              <p className={`${compact ? 'text-base' : 'text-lg'} text-cyan-100 text-center mb-6 leading-relaxed font-medium`}>
                {currentQuestion.question}
              </p>

              {/* Options */}
              <div className={`space-y-3 mb-6 ${compact ? '' : ''}`}>
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full ${compact ? 'p-3 rounded-lg' : 'p-4 rounded-xl'} text-left transition-all duration-300 ${
                      selectedAnswer === index
                        ? 'bg-cyan-400/20 border-2 border-cyan-300 scale-105 text-cyan-100'
                        : 'bg-black/10 border border-cyan-400/10 hover:bg-cyan-400/10 hover:border-cyan-400/20 text-white'
                    }`}
                  >
                    <span className="font-semibold">{option}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Result */}
              <div className={`${compact ? 'text-center p-4 rounded-lg mb-4' : 'text-center p-6 rounded-2xl mb-6'} ${
                isCorrect 
                  ? 'bg-gradient-to-br from-cyan-400/10 to-teal-400/10 border border-cyan-400/30'
                  : 'bg-gradient-to-br from-black/10 to-cyan-900/5 border border-cyan-400/10'
              }`}>
                <div className={`${compact ? 'text-3xl' : 'text-4xl'} mb-3`}>{isCorrect ? '✨' : '🌟'}</div>
                <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold mb-2 ${isCorrect ? 'text-cyan-300' : 'text-white/80'} font-brand`}>
                  {isCorrect ? `+${currentQuestion.points} Points!` : 'Good Try!'}
                </h3>
                <p className={`${compact ? 'text-sm' : 'text-base'} text-cyan-100 leading-relaxed`}>
                  {currentQuestion.fact}
                </p>
              </div>

              <button
                onClick={handleContinue}
                className={`w-full ${compact ? 'py-3 text-sm' : 'py-4'} bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30`}
              >
                Continue Your Journey
              </button>
            </>
          )}

          {/* Skip option (only before answering) */}
          {!showResult && (
            <button
              onClick={onSkip}
              className={`w-full ${compact ? 'text-xs mt-3' : 'text-sm mt-4'} text-cyan-200 hover:text-cyan-100 transition`}
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickWinTrivia;
