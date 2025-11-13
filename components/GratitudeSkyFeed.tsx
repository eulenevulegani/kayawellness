import React, { useState } from 'react';
import { SparklesIcon, UsersIcon } from './Icons';

/**
 * Viral Social Proof: Anonymous gratitude feed like BeReal
 * Shows users they're part of a growing community
 */
interface GratitudeSkyPost {
  id: string;
  word: string;
  timestamp: Date;
  glowIntensity: number;
}

interface GratitudeSkyFeedProps {
  recentPosts: GratitudeSkyPost[];
  onAddGratitude: () => void;
  totalCommunityCount?: number;
}

const GratitudeSkyFeed: React.FC<GratitudeSkyFeedProps> = ({
  recentPosts,
  onAddGratitude,
  totalCommunityCount = 1248,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="w-full bg-gradient-to-br from-slate-900/50 via-indigo-950/50 to-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Gratitude Sky</h3>
            <p className="text-xs text-white/60">
              <UsersIcon className="w-3 h-3 inline mr-1" />
              {totalCommunityCount.toLocaleString()} souls glowing today
            </p>
          </div>
        </div>
        <button
          onClick={onAddGratitude}
          className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full text-sm font-semibold hover:opacity-90 transition shadow-md"
        >
          + Add
        </button>
      </div>

      {/* Floating Gratitude Words */}
      <div className="relative h-48 bg-black/30 rounded-2xl overflow-hidden mb-4">
        {/* Starry background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/40 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Gratitude words floating */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 p-4">
          {recentPosts.slice(0, 8).map((post, index) => {
            const isActive = activeIndex === index;
            const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            
            return (
              <div
                key={post.id}
                onClick={() => setActiveIndex(isActive ? null : index)}
                className={`
                  ${size} px-4 py-2 rounded-full cursor-pointer
                  bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm
                  border border-white/20 text-white
                  hover:from-cyan-500/20 hover:to-teal-500/20 hover:border-cyan-400/50
                  transition-all duration-300 transform hover:scale-110
                  ${isActive ? 'scale-110 shadow-lg shadow-cyan-500/50' : ''}
                  animate-gentle-float
                `}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                {post.word}
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <p className="text-xl font-bold text-white">{recentPosts.length}</p>
          <p className="text-xs text-white/60">This Hour</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <p className="text-xl font-bold text-cyan-400">{Math.floor(totalCommunityCount / 24)}</p>
          <p className="text-xs text-white/60">Per Minute</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <p className="text-xl font-bold text-teal-400">🌍</p>
          <p className="text-xs text-white/60">Worldwide</p>
        </div>
      </div>

      {/* Motivational prompt */}
      <p className="text-xs text-white/50 text-center mt-4 italic">
        "Your glow inspires others. Add yours to the sky."
      </p>
    </div>
  );
};

export default GratitudeSkyFeed;
