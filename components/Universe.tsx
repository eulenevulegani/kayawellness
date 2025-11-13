import React from 'react';
import { AppView } from '../types';
import { ArrowLeftIcon } from './Icons';

interface UniverseProps {
  onNavigate: (view: AppView) => void;
}

const Universe: React.FC<UniverseProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'community',
      emoji: '✨',
      title: 'Constellation',
      subtitle: 'Community Hub',
      description: 'Connect with others, join challenges, share progress, and celebrate gratitude',
      gradient: 'from-cyan-500/20 to-teal-500/20',
      borderColor: 'border-cyan-400/30',
      textColor: 'text-cyan-200'
    },
    {
      id: 'therapists',
      emoji: '⭐',
      title: 'Guiding Stars',
      subtitle: 'Find Therapists',
      description: 'Connect with licensed therapists who can guide your journey',
      gradient: 'from-cyan-500/20 to-teal-500/20',
      borderColor: 'border-cyan-400/30',
      textColor: 'text-cyan-200'
    },
    {
      id: 'events',
      emoji: '🌌',
      title: 'Event Horizon',
      subtitle: 'Wellness Events',
      description: 'Join community gatherings and wellness workshops',
      gradient: 'from-teal-500/20 to-blue-500/20',
      borderColor: 'border-teal-400/30',
      textColor: 'text-teal-200'
    },
    {
      id: 'resources',
      emoji: '🌠',
      title: 'Galaxy',
      subtitle: 'Tools & Resources',
      description: 'Explore articles, guides, and crisis support resources',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-200'
    },
    {
      id: 'insights',
      emoji: '🪐',
      title: 'Orbit',
      subtitle: 'Your Progress',
      description: 'Track your wellness journey and discover patterns',
      gradient: 'from-cyan-500/20 to-purple-500/20',
      borderColor: 'border-cyan-400/30',
      textColor: 'text-cyan-200'
    }
  ];

  return (
    <div className="h-screen overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto p-6 pt-24 pb-24 animate-fade-in text-white">
        <header className="mb-6">
          <h2 className="text-3xl font-light text-white">Your Universe</h2>
          <p className="text-white/70 text-sm mt-1">Explore wellness resources across your cosmic journey</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20`}
            >
              <div className="flex-grow">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 flex-shrink-0 bg-white/10 rounded-full flex items-center justify-center mt-1`}>
                    <span className="text-xl">{feature.emoji}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{feature.title}</h4>
                    <p className="text-sm text-white/70">{feature.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 mt-3">{feature.description}</p>
              </div>
              <button 
                onClick={() => onNavigate(feature.id as AppView)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition text-sm font-semibold"
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-32 right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
    </div>
  );
};

export default Universe;
