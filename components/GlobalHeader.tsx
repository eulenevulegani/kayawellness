import React from 'react';
import { FlameIcon, StarIcon } from './Icons';
import KayaLogo from './KayaLogo';
import { UserProfile, AppView } from '../types';

interface GlobalHeaderProps {
  userProfile: UserProfile;
  onNavigate: (view: AppView) => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ userProfile, onNavigate }) => {
  return (
    <header className="w-full bg-gradient-to-r from-cyan-500/10 to-teal-500/10 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Official Logo */}
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition group"
          >
            <KayaLogo size={32} animated={false} className="group-hover:scale-105 transition-transform" />
            <h1 className="text-xl font-extralight text-white tracking-wide">KAYA</h1>
          </button>

          {/* Stats & Profile */}
          <div className="flex items-center gap-4">
            {/* Points */}
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-cyan-400/30">
              <StarIcon className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-semibold text-sm">{Math.floor(userProfile.xp || 0)}</span>
              <span className="text-white/50 text-xs">Points</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-orange-400/30">
              <FlameIcon className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold text-sm">{userProfile.streak || 0}</span>
              <span className="text-white/50 text-xs">Day Streak</span>
            </div>

            {/* Profile Avatar */}
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full flex items-center justify-center text-cyan-900 font-semibold text-sm hover:opacity-90 transition hover:scale-105 transform"
            >
              {userProfile.name?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
