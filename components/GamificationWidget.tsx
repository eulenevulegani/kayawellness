import React from 'react';
import { StarIcon, FlameIcon } from './Icons';

interface GamificationWidgetProps {
  points: number;
  streak: number;
  rank?: number;
  onViewDetails: () => void;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({
  points,
  streak,
  rank,
  onViewDetails
}) => {
  return (
    <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 rounded-2xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/90 font-semibold flex items-center gap-2">
          <StarIcon className="w-5 h-5 text-cyan-400" />
          Your Progress
        </h3>
        <button
          onClick={onViewDetails}
          className="text-xs text-white/60 hover:text-white/90 transition"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Points */}
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {points.toLocaleString()}
          </div>
          <div className="text-xs text-white/60">Points</div>
        </div>

        {/* Streak */}
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FlameIcon className="w-5 h-5 text-orange-400" />
            <span className="text-3xl font-bold text-white">{streak}</span>
          </div>
          <div className="text-xs text-white/60">Day Streak</div>
        </div>
      </div>

      {/* Rank Badge */}
      {rank && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-2 text-center">
          <span className="text-white/80 text-sm">
            🏆 Ranked #{rank} globally
          </span>
        </div>
      )}
    </div>
  );
};

export default GamificationWidget;
