


import React from 'react';
import { AppView } from '../types';
import { HomeIcon, LotusIcon, UserIcon, OrbIcon, SparklesIcon } from './Icons';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const NavItem: React.FC<{
  view: AppView;
  label: string;
  icon: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}> = ({ view, label, icon, currentView, setView }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => setView(view)}
      className={`flex flex-col items-center justify-center w-full min-h-[52px] sm:min-h-[56px] py-1.5 sm:py-2 transition-all duration-200 transform active:scale-95 ${isActive ? 'text-white scale-105 sm:scale-110' : 'text-white/70 hover:text-white hover:scale-105'}`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`w-6 h-6 sm:w-8 sm:h-8 mb-0.5 sm:mb-1 flex items-center justify-center transition-transform ${isActive ? 'animate-gentle-pulse' : ''}`}>{icon}</div>
      <span className={`text-[10px] sm:text-xs font-medium transition-opacity ${isActive ? 'opacity-100' : 'opacity-90'}`}>{label}</span>
      {isActive && <div className="absolute bottom-0 w-6 sm:w-8 h-0.5 bg-white rounded-full"></div>}
    </button>
  );
};

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  return (
    <nav className="relative z-20 w-full max-w-lg mx-auto bg-black/30 backdrop-blur-lg border-t border-white/20 p-1.5 sm:p-2 pb-safe" role="navigation" aria-label="Main navigation">
      <div className="flex justify-around items-center">
        <NavItem view="dashboard" label="Home" icon={<HomeIcon className="w-6 h-6" />} currentView={currentView} setView={setView} />
        <NavItem view="explore" label="Explore" icon={<LotusIcon className="w-6 h-6" />} currentView={currentView} setView={setView} />
        <NavItem view="universe" label="Universe" icon={<OrbIcon className="w-6 h-6" />} currentView={currentView} setView={setView} />
        <NavItem view="community" label="Stars" icon={<SparklesIcon className="w-6 h-6" />} currentView={currentView} setView={setView} />
        <NavItem view="profile" label="You" icon={<UserIcon className="w-6 h-6" />} currentView={currentView} setView={setView} />
      </div>
    </nav>
  );
};

export default Navigation;