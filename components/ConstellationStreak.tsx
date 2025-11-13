import React from 'react';
import { StarIcon, FlameIcon } from './Icons';

/**
 * Viral Streak System: Duolingo-inspired but cosmic-themed
 * Shows constellation growing as user maintains streaks
 */
interface ConstellationStreakProps {
  currentStreak: number;
  longestStreak: number;
  onStreakTap?: () => void;
}

const ConstellationStreak: React.FC<ConstellationStreakProps> = ({
  currentStreak,
  longestStreak,
  onStreakTap,
}) => {
  // Calculate constellation pattern based on streak
  const getConstellationStars = () => {
    const stars = [];
    const baseStars = Math.min(currentStreak, 7); // First week
    
    for (let i = 0; i < baseStars; i++) {
      stars.push({
        id: i,
        size: i === baseStars - 1 ? 'large' : 'small',
        glow: i === baseStars - 1,
      });
    }
    return stars;
  };

  const stars = getConstellationStars();
  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 30 ? 30 : currentStreak < 100 ? 100 : currentStreak + 50;

  return (
    <div
      onClick={onStreakTap}
      className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 group"
    >
      {/* Streak Fire Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
            <FlameIcon className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</h3>
            <p className="text-xs text-white/60">Current Streak</p>
          </div>
        </div>
        
        {longestStreak > currentStreak && (
          <div className="text-right">
            <p className="text-lg font-semibold text-white/80">{longestStreak}</p>
            <p className="text-xs text-white/50">Best</p>
          </div>
        )}
      </div>

      {/* Constellation Visualization */}
      <div className="relative h-24 bg-black/30 rounded-xl mb-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-2 px-4">
          {stars.map((star, idx) => (
            <React.Fragment key={star.id}>
              <div
                className={`${
                  star.size === 'large' ? 'w-3 h-3' : 'w-2 h-2'
                } rounded-full bg-white animate-gentle-pulse ${
                  star.glow ? 'shadow-lg shadow-cyan-400/50' : ''
                }`}
                style={{
                  animationDelay: `${idx * 0.1}s`,
                }}
              />
              {idx < stars.length - 1 && (
                <div className="w-4 h-0.5 bg-gradient-to-r from-white/40 to-white/20" />
              )}
            </React.Fragment>
          ))}
          
          {/* Future stars (locked) */}
          {currentStreak < 7 && Array.from({ length: 7 - currentStreak }).map((_, idx) => (
            <React.Fragment key={`future-${idx}`}>
              <div className="w-2 h-2 rounded-full border border-white/20" />
              {idx < 7 - currentStreak - 1 && (
                <div className="w-4 h-0.5 bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Progress to Next Milestone */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/60">
          <span>Next milestone</span>
          <span className="text-cyan-400 font-medium">{nextMilestone - currentStreak} days</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transition-all duration-500"
            style={{
              width: `${(currentStreak / nextMilestone) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Hover Effect: Show bonus */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
    </div>
  );
};

export default ConstellationStreak;
