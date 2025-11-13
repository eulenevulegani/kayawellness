

import React, { useState, useEffect } from 'react';
import { WellnessProgram, Activity, AppView, UserProfile } from '../types';
import { getMeditationsForMood, getBreathworkForMood, getSoundscapesForMood } from '../services/geminiService';
import { getFrequenciesForConcern } from '../services/frequencyService';
import { StarIcon, LotusIcon, LungIcon, SoundIcon, PlayIcon, MoonIcon } from './Icons';
import Loader from './Loader';

interface ExploreProps {
  programs: WellnessProgram[];
  onStartProgram: (programId: string) => void;
  onStartActivity: (activity: Activity) => void;
  onNavigate: (view: AppView) => void;
  userProfile: UserProfile;
}

type ExploreTab = 'journeys' | 'breathe' | 'soundscapes' | 'sleep';
const MOODS = ['Stress', 'Anxiety', 'Focus', 'Sleep', 'Gratitude'];

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center p-2 rounded-full transition-all duration-200 w-full ${isActive ? 'bg-white/10 scale-105' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
);

// (previous list-rendering helper removed; UI rendering handled in `Explore` below)

const Explore: React.FC<ExploreProps> = ({ programs, onStartProgram, onStartActivity, onNavigate, userProfile }) => {
    const [activeTab, setActiveTab] = useState<ExploreTab>('breathe');
  const [selectedMood, setSelectedMood] = useState('Stress');
  const isPremium = userProfile.subscriptionTier === 'premium';

    const TABS: { id: ExploreTab; label: string; icon: React.ReactNode }[] = [
        { id: 'breathe', label: 'Breathing Exercises', icon: <LungIcon className="w-6 h-6" /> },
        { id: 'soundscapes', label: 'Soundscapes', icon: <SoundIcon className="w-6 h-6" /> },
        { id: 'journeys', label: 'Journeys', icon: <StarIcon className="w-6 h-6" /> },
        { id: 'sleep', label: 'Sleep', icon: <MoonIcon className="w-6 h-6" /> },
    ];

  const renderTabContent = () => {
    switch(activeTab) {
        case 'journeys':
            // Only the first journey is free, rest are premium
            const journeys = [
                {
                    id: 'free-3-day',
                    title: '3-Day Mindful Reset',
                    description: 'A gentle 3-day introduction to mindfulness and self-care. Each day offers a short, guided practice to help you reset and recharge.',
                    duration: 3,
                    dailyThemes: ['Awareness', 'Breath', 'Gratitude'],
                    premium: false
                },
                ...programs.map((p, i) => ({ ...p, premium: true }))
            ];
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                    {journeys.map((program, idx) => {
                        const isLocked = !isPremium && idx > 0;
                        return (
                            <div key={program.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                                <div className="flex-grow">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 flex-shrink-0 bg-cyan-400/20 text-cyan-300 rounded-full flex items-center justify-center mt-1">
                                            <LotusIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">{program.title}</h4>
                                            <p className="text-sm text-white/70">{program.duration} Days • Guided Journey</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/70 mt-3">{program.description}</p>
                                </div>
                                {isLocked ? (
                                    <button disabled className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-200 rounded-full border border-cyan-400/30 opacity-60 cursor-not-allowed">
                                        <PlayIcon className="w-4 h-4"/>
                                        <span className="flex-1">Upgrade to KAYA+ to unlock</span>
                                    </button>
                                ) : (
                                    <button onClick={() => onStartProgram(program.id)} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full hover:opacity-90 transition text-sm font-semibold z-20 relative">
                                        <PlayIcon className="w-4 h-4"/>
                                        Start Journey
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        case 'soundscapes':
                        // Well-researched soundscapes and frequencies with clear descriptions
                        const soundscapes = [
                            {
                                title: 'Gentle Rain',
                                description: 'Soothing rain sounds proven to reduce anxiety and promote calmness.',
                            },
                            {
                                title: 'Forest Ambience',
                                description: 'Natural forest sounds that enhance focus and relaxation.',
                            },
                            {
                                title: 'Ocean Waves',
                                description: 'Rhythmic ocean waves to help with sleep and deep relaxation.',
                            },
                            {
                                title: 'Cosmic Tones',
                                description: 'Uplifting, expansive tones for peaceful and joyful moods.',
                            }
                        ];
                        const frequencies = [
                            {
                                title: 'Alpha Waves (10 Hz)',
                                description: 'Promotes relaxation and reduces anxiety. Used in clinical studies for stress relief.',
                            },
                            {
                                title: 'Schumann Resonance (7.83 Hz)',
                                description: 'Earth’s natural frequency, shown to improve grounding and focus.',
                            },
                            {
                                title: '432 Hz - Natural Harmony',
                                description: 'A frequency associated with natural harmony and emotional healing.',
                            }
                        ];
                        const freeSoundscapes = soundscapes.slice(0, 1);
                        const premiumSoundscapes = soundscapes.slice(1);
                        const freeFrequencies = frequencies.slice(0, 1);
                        const premiumFrequencies = frequencies.slice(1);
                        const soundscapesToShow = isPremium ? soundscapes : freeSoundscapes;
                        const frequenciesToShow = isPremium ? frequencies : freeFrequencies;
                        return (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {soundscapes.map((item, idx) => {
                                        const isLocked = !isPremium && idx > 0;
                                        return (
                                            <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                                                <div className="flex-grow">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 flex-shrink-0 bg-cyan-400/20 text-cyan-300 rounded-full flex items-center justify-center mt-1">
                                                            <SoundIcon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-white">{item.title}</h4>
                                                            <p className="text-sm text-white/70">{item.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {isLocked ? (
                                                    <button disabled className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-200 rounded-full border border-cyan-400/30 opacity-60 cursor-not-allowed">
                                                        <PlayIcon className="w-4 h-4"/>
                                                        <span className="flex-1">Upgrade to KAYA+ to unlock</span>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => onStartActivity({ type: 'soundscape', data: item })} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-200 rounded-full hover:bg-cyan-500/30 transition text-sm font-semibold border border-cyan-400/30">
                                                        <PlayIcon className="w-4 h-4"/>
                                                        Play Soundscape
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="border-t border-white/10 pt-4">
                                    <h4 className="text-white font-semibold mb-3 text-center">Therapeutic Frequencies</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {frequencies.map((item, idx) => {
                                            const isLocked = !isPremium && idx > 0;
                                            return (
                                                <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                                                    <div className="flex-grow">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 flex-shrink-0 bg-purple-400/20 text-purple-300 rounded-full flex items-center justify-center mt-1">
                                                                <SoundIcon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-white">{item.title}</h4>
                                                                <p className="text-sm text-white/70">{item.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isLocked ? (
                                                        <button disabled className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-200 rounded-full border border-purple-400/30 opacity-60 cursor-not-allowed">
                                                            <PlayIcon className="w-4 h-4"/>
                                                            <span className="flex-1">Upgrade to KAYA+ to unlock</span>
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => onStartActivity({ type: 'soundscape', data: item })} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-200 rounded-full hover:bg-purple-500/30 transition text-sm font-semibold border border-purple-400/30">
                                                            <PlayIcon className="w-4 h-4"/>
                                                            Play Frequency
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
        case 'breathe':
                        // Well-researched breathing exercises
                        const exercises = [
                            {
                                title: 'Box Breathing',
                                pattern: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
                                description: 'A simple, effective technique for reducing stress and increasing focus. Inhale, hold, exhale, and hold again for equal counts.'
                            },
                            {
                                title: '4-7-8 Breathing',
                                pattern: { inhale: 4, hold: 7, exhale: 8 },
                                description: 'Promotes relaxation and helps with sleep. Inhale for 4 seconds, hold for 7, exhale for 8.'
                            },
                            {
                                title: 'Resonant Breathing',
                                pattern: { inhale: 5, hold: 0, exhale: 5 },
                                description: 'Balances the nervous system. Inhale for 5 seconds, exhale for 5 seconds.'
                            },
                            {
                                title: 'Alternate Nostril Breathing',
                                pattern: { inhale: 4, hold: 4, exhale: 4 },
                                description: 'Balances left and right brain. Inhale, hold, and exhale through alternate nostrils.'
                            }
                        ];
                        const freeExercises = exercises.slice(0, 1);
                        const premiumExercises = exercises.slice(1);
                        const itemsToShow = isPremium ? exercises : freeExercises;
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                                {exercises.map((item, index) => {
                                    const isLocked = !isPremium && index > 0;
                                    return (
                                        <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20 opacity-100">
                                            <div className="flex-grow">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 flex-shrink-0 bg-cyan-400/20 text-cyan-300 rounded-full flex items-center justify-center mt-1">
                                                        <LungIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-white">{item.title}</h4>
                                                        <p className="text-sm text-white/70">{item.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {isLocked ? (
                                                <button disabled className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-200 rounded-full border border-cyan-400/30 opacity-60 cursor-not-allowed">
                                                    <PlayIcon className="w-4 h-4"/>
                                                    <span className="flex-1">Upgrade to KAYA+ to unlock</span>
                                                </button>
                                            ) : (
                                                <button onClick={() => onStartActivity({ type: 'breathwork', data: item, forceAnimator: true })} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-200 rounded-full hover:bg-cyan-500/30 transition text-sm font-semibold border border-cyan-400/30">
                                                    <PlayIcon className="w-4 h-4"/>
                                                    Start Exercise
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
        case 'sleep':
            return (
                <div className="text-center p-8 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl animate-fade-in border border-cyan-400/30 relative overflow-hidden">
                    <MoonIcon className="w-12 h-12 mx-auto text-cyan-300 mb-4" />
                    <h3 className="text-xl font-medium text-white/90">Infinite Sleep Stories</h3>
                    <p className="text-white/70 mt-2 mb-6 max-w-md mx-auto">Drift into slumber with unique, calming stories generated just for you. A new story awaits every night.</p>
                    {isPremium ? (
                        <button 
                            onClick={() => onNavigate('sleepStories')} 
                            className="px-6 py-2 bg-white text-blue-900 rounded-full font-semibold hover:bg-opacity-90 transform hover:scale-105 transition"
                        >
                            Explore Sleep Stories
                        </button>
                    ) : (
                        <button 
                            disabled
                            className="px-6 py-2 bg-white/20 text-blue-100 rounded-full font-semibold opacity-60 cursor-not-allowed"
                        >
                            Upgrade to Unlock
                        </button>
                    )}
                </div>
            )
            return (
                <div className="text-center p-8 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl animate-fade-in border border-cyan-400/30 relative overflow-hidden">
                    {!isPremium && (
                         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 text-center p-4">
                             <div className="flex items-center gap-2 text-yellow-300 font-semibold mb-2">
                                <StarIcon className="w-5 h-5"/>
                                <span>KAYA+ Feature</span>
                            </div>
                            <p className="text-white/80 text-sm">Upgrade to unlock infinite AI-generated sleep stories.</p>
                        </div>
                    )}
                    <MoonIcon className="w-12 h-12 mx-auto text-cyan-300 mb-4" />
                    <h3 className="text-xl font-medium text-white/90">Infinite Sleep Stories</h3>
                    <p className="text-white/70 mt-2 mb-6 max-w-md mx-auto">Drift into slumber with unique, calming stories generated just for you. A new story awaits every night.</p>
                    <button 
                        onClick={() => isPremium ? onNavigate('sleepStories') : onNavigate('profile')} 
                        className="px-6 py-2 bg-white text-blue-900 rounded-full font-semibold hover:bg-opacity-90 transform hover:scale-105 transition"
                    >
                        {isPremium ? 'Explore Sleep Stories' : 'Upgrade to Unlock'}
                    </button>
                </div>
            )
    }
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto p-6 pt-24 pb-24 animate-fade-in text-white">
        <header className="mb-6">
          <h2 className="text-3xl font-light text-white">Discover</h2>
          <p className="text-white/70 text-sm mt-1">Explore practices to support your mind and body.</p>
        </header>
        
        <div className="grid grid-cols-5 gap-2 p-1 bg-black/20 rounded-full mb-6">
        {TABS.map(tab => (
            <TabButton 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                isActive={activeTab === tab.id}
                label={tab.label}
                icon={tab.icon}
            />
        ))}
      </div>


        
        <div className="pb-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Explore;
