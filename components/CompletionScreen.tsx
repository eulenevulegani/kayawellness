


import React from 'react';
import { AppView } from '../types';
import { HomeIcon, BookOpenIcon, LotusIcon, UserIcon, UniverseIcon } from './Icons';

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
      className={`flex flex-col items-center justify-center w-full min-h-[56px] py-2 transition-all duration-200 transform active:scale-95 ${isActive ? 'text-white scale-110' : 'text-white/70 hover:text-white hover:scale-105'}`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`w-8 h-8 mb-1 flex items-center justify-center transition-transform ${isActive ? 'animate-gentle-pulse' : ''}`}>{icon}</div>
      <span className={`text-xs font-medium transition-opacity ${isActive ? 'opacity-100' : 'opacity-90'}`}>{label}</span>
      {isActive && <div className="absolute bottom-0 w-8 h-0.5 bg-white rounded-full"></div>}
    </button>
  );
};

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  // Map old view names to new ones for backward compatibility
  const normalizedView = currentView === 'dashboard' ? 'stellarHome' 
    : currentView === 'explore' ? 'cosmicLibrary'
    : currentView === 'journal' ? 'reflectionChamber'
    : currentView === 'profile' ? 'stellarAtlas'
    : currentView;

  return (
    <nav className="relative z-20 w-full max-w-lg mx-auto bg-black/30 backdrop-blur-lg border-t border-white/20 p-2 safe-area-bottom" role="navigation" aria-label="Main navigation">
      <div className="flex justify-around items-center">
        <NavItem view="stellarHome" label="Home" icon={<HomeIcon className="w-6 h-6" />} currentView={normalizedView} setView={setView} />
        <NavItem view="cosmicLibrary" label="Library" icon={<LotusIcon className="w-6 h-6" />} currentView={normalizedView} setView={setView} />
        <NavItem view="universe" label="Connect" icon={<UniverseIcon className="w-6 h-6" />} currentView={normalizedView} setView={setView} />
        <NavItem view="reflectionChamber" label="Reflect" icon={<BookOpenIcon className="w-6 h-6" />} currentView={normalizedView} setView={setView} />
        <NavItem view="stellarAtlas" label="Atlas" icon={<UserIcon className="w-6 h-6" />} currentView={normalizedView} setView={setView} />
      </div>
    </nav>
  );
};

export default Navigation;