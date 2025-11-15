import React from 'react';
import { AppView } from '../types';
import { ArrowLeftIcon } from './Icons';

interface UniverseProps {
  onNavigate: (view: AppView) => void;
}

const Universe: React.FC<UniverseProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'community' as AppView,
      emoji: '✨',
      title: 'Gratitude Stars',
      description: 'See the constellation of shared gratitude from the community',
      gradient: 'from-cyan-500/10 to-teal-500/10',
      borderColor: 'border-cyan-400/30'
    },
    {
      id: 'trivia' as AppView,
      emoji: '🎯',
      title: 'Quick Wellness Trivia',
      description: 'Learn fun wellness facts and earn points',
      gradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-400/30'
    },
    {
      id: 'therapists' as AppView,
      emoji: '⭐',
      title: 'Find a Therapist',
      description: 'Connect with licensed wellness practitioners',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'events' as AppView,
      emoji: '🌌',
      title: 'Wellness Events',
      description: 'Join community wellness workshops and gatherings',
      gradient: 'from-indigo-500/10 to-blue-500/10',
      borderColor: 'border-indigo-400/30'
    },
    {
      id: 'resources',
      emoji: '🌠',
      title: 'Galaxy',
      subtitle: 'Tools & Resources',
      description: 'Explore articles, guides, and crisis support resources',
      gradient: 'from-white/15 to-white/10',
      borderColor: 'border-indigo-400/30'
    },
    {
      id: 'insights' as AppView,
      emoji: '🪐',
      title: 'Your Insights',
      description: 'Track patterns in your wellness journey',
      gradient: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-400/30'
    }
  ];

  return (
    <div className="h-screen overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto p-6 pt-24 pb-24 animate-fade-in text-white">
        <header className="mb-8 text-center">
          <h2 className="text-4xl font-light text-white mb-2">Connect & Explore</h2>
          <p className="text-white/70 text-base">Discover wellness resources and connect with your community</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => onNavigate(feature.id)}
              className={`group bg-gradient-to-br ${feature.gradient} p-6 rounded-2xl border ${feature.borderColor} flex flex-col text-left transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 transform`}
            >
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {feature.emoji}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
              <div className="mt-6 flex items-center text-cyan-300 text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                <span>Explore</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
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
