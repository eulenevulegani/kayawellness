import React, { useState } from 'react';
import { TrophyIcon, StarIcon, LockClosedIcon } from './Icons';

/**
 * Viral Achievement Unlock: Instant gratification moment
 * Duolingo-style badge celebration with share mechanics
 */
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-orange-500',
};

interface AchievementUnlockProps {
  achievement: Achievement;
  onShare?: () => void;
  onClose: () => void;
  pointsEarned?: number;
}

const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  achievement,
  onShare,
  onClose,
  pointsEarned = 50,
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      if (onShare) onShare();
      setIsSharing(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-cyan-400 to-teal-400 animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md mx-4 animate-scale-in">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-white/20 rounded-3xl p-8 text-center shadow-2xl">
          {/* Rarity Badge */}
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 border border-white/20">
            <span className={`text-xs font-semibold bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]} bg-clip-text text-transparent uppercase tracking-wider`}>
              {achievement.rarity}
            </span>
          </div>

          {/* Achievement Icon */}
          <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]} rounded-full flex items-center justify-center text-5xl animate-gentle-pulse shadow-2xl`}>
            {achievement.icon}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-3">Achievement Unlocked!</h2>
          <h3 className="text-xl font-semibold text-cyan-400 mb-2">{achievement.title}</h3>
          <p className="text-sm text-white/70 mb-6 leading-relaxed">
            {achievement.description}
          </p>

          {/* Points Earned */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 rounded-full">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">+{pointsEarned} Points</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {onShare && (
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
              >
                {isSharing ? 'Sharing...' : '✨ Share Your Win'}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-all"
            >
              Continue
            </button>
          </div>

          {/* Social proof */}
          <p className="text-xs text-white/50 mt-4">
            Join 12,483 others who unlocked this today
          </p>
        </div>
      </div>
    </div>
  );
};

export default AchievementUnlock;
