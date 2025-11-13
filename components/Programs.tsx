

import React, { useState, useEffect } from 'react';
import { WellnessProgram, Activity, AppView, UserProfile } from '../types';
import { getMeditationsForMood, getBreathworkForMood, getSoundscapesForMood } from '../services/geminiService';
import { StarIcon, LotusIcon, LungIcon, SoundIcon, PlayIcon, MoonIcon } from './Icons';
import Loader from './Loader';

interface ExploreProps {
  programs: WellnessProgram[];
  onStartProgram: (programId: string) => void;
  onStartActivity: (activity: Activity) => void;
  onNavigate: (view: AppView) => void;
  userProfile: UserProfile;
}

type ExploreTab = 'journeys' | 'breathe' | 'soundscapes' | 'frequencies' | 'sleep';
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

const ToolList: React.FC<{
    mood: string;
    fetcher: (mood: string) => Promise<any[]>;
    type: Activity['type'];
    onStartActivity: (activity: Activity) => void;
    icon: React.ReactNode;
    isPremium: boolean;
    onUpgradeClick: () => void;
}> = ({ mood, fetcher, type, onStartActivity, icon, isPremium, onUpgradeClick }) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const fetchedItems = await fetcher(mood);
                // Ensure fetchedItems is an array
                setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
            } catch (error) {
                console.error('Error loading items:', error);
                setItems([]);
            }
            setLoading(false);
        };
        loadItems();
    }, [mood, fetcher]);

    if (loading) return <div className="flex justify-center p-8"><Loader /></div>;
    
    // Ensure items is an array before slicing
    const safeItems = Array.isArray(items) ? items : [];
    const itemsToShow = isPremium ? safeItems : safeItems.slice(0, 2);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {itemsToShow.map((item, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                    <div className="flex-grow">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 flex-shrink-0 bg-white/10 rounded-full flex items-center justify-center mt-1">
                                {icon}
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">{item.title}</h4>
                                <p className="text-sm text-white/70">
                                    {item.durationMinutes ? `${item.durationMinutes} min` : item.description?.substring(0, 50) + '...'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => onStartActivity({ type, data: item })} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition text-sm font-semibold">
                        <PlayIcon className="w-4 h-4"/>
                        Start Session
                    </button>
                </div>
            ))}
             {!isPremium && safeItems.length > 2 && (
                <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 p-4 rounded-lg border border-cyan-400/30 flex flex-col items-center justify-center text-center">
                    <StarIcon className="w-8 h-8 text-cyan-300 mb-2"/>
                    <h4 className="font-semibold text-white">Unlock {safeItems.length - 2}+ More Sessions</h4>
                    <p className="text-sm text-white/70 mt-1">Upgrade to KAYA+ for full access to our library.</p>
                    <button onClick={onUpgradeClick} className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full hover:opacity-90 transition text-sm font-semibold">
                        Upgrade to KAYA+
                    </button>
                </div>
            )}
        </div>
    );
}

const Explore: React.FC<ExploreProps> = ({ programs, onStartProgram, onStartActivity, onNavigate, userProfile }) => {
  const [activeTab, setActiveTab] = useState<ExploreTab>('journeys');
  const [selectedMood, setSelectedMood] = useState('Stress');
  const isPremium = userProfile.subscriptionTier === 'premium';

  const TABS: { id: ExploreTab; label: string; icon: React.ReactNode }[] = [
    { id: 'journeys', label: 'Journeys', icon: <StarIcon className="w-6 h-6" /> },
    { id: 'breathe', label: 'Breathe', icon: <LungIcon className="w-6 h-6" /> },
    { id: 'soundscapes', label: 'Soundscapes', icon: <SoundIcon className="w-6 h-6" /> },
    { id: 'frequencies', label: 'Frequencies', icon: <SoundIcon className="w-6 h-6" /> },
    { id: 'sleep', label: 'Sleep', icon: <MoonIcon className="w-6 h-6" /> },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
        case 'journeys':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                    {programs.map((program) => (
                        <div key={program.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20 relative overflow-hidden">
                             {!isPremium && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10 text-center p-4">
                                    <div className="flex items-center gap-2 text-yellow-300 font-semibold mb-2">
                                        <StarIcon className="w-5 h-5"/>
                                        <span>KAYA+ Journey</span>
                                    </div>
                                    <p className="text-white/80 text-sm">Upgrade to unlock multi-day programs for deeper transformation.</p>
                                </div>
                            )}
                            <div className="flex-grow">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 flex-shrink-0 bg-yellow-400/20 text-yellow-300 rounded-full flex items-center justify-center mt-1">
                                        <StarIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">{program.title}</h4>
                                        <p className="text-sm text-white/70">{program.duration} Days • Guided Program</p>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 mt-3">{program.description}</p>
                            </div>
                            <button 
                                onClick={() => isPremium ? onStartProgram(program.id) : onNavigate('profile')} 
                                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition text-sm font-semibold z-20 relative"
                            >
                                <PlayIcon className="w-4 h-4"/>
                                {isPremium ? 'Start Journey' : 'Upgrade to Access'}
                            </button>
                        </div>
                    ))}
                </div>
            );
        case 'soundscapes':
            return <ToolList mood={selectedMood} fetcher={getSoundscapesForMood} type="soundscape" onStartActivity={onStartActivity} icon={<SoundIcon className="w-4 h-4" />} isPremium={isPremium} onUpgradeClick={() => onNavigate('profile')}/>;
        case 'breathe':
            return <ToolList mood={selectedMood} fetcher={getBreathworkForMood} type="breathwork" onStartActivity={onStartActivity} icon={<LungIcon className="w-4 h-4" />} isPremium={isPremium} onUpgradeClick={() => onNavigate('profile')}/>;
        case 'frequencies':
            return (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-400/20 rounded-xl p-5 text-center">
                        <h3 className="text-lg font-semibold text-white mb-2">🎵 Therapeutic Frequencies</h3>
                        <p className="text-sm text-white/70">Scientifically-researched sound frequencies designed to support specific wellness concerns through binaural beats and Solfeggio tones.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: 'Anxiety Relief', freq: '10 Hz Alpha + 432 Hz', desc: 'Calms nervous system, reduces cortisol', concern: 'Stress' },
                            { title: 'Sleep Enhancement', freq: '1-4 Hz Delta Waves', desc: 'Deep sleep induction, 174 Hz pain relief', concern: 'Sleep' },
                            { title: 'Focus & Concentration', freq: '40 Hz Gamma Waves', desc: 'Enhanced cognition, mental clarity', concern: 'Focus' },
                            { title: 'Depression Support', freq: '528 Hz + Theta', desc: 'DNA repair frequency, emotional healing', concern: 'Anxiety' },
                            { title: 'Meditation Depth', freq: '7.83 Hz Schumann', desc: 'Earth resonance, spiritual connection', concern: 'Gratitude' },
                            { title: 'Pain Management', freq: '174 Hz Solfeggio', desc: 'Natural anesthetic, pain reduction', concern: 'Stress' },
                            { title: 'Energy Boost', freq: '14 Hz Beta Waves', desc: 'Alertness, motivation, vitality', concern: 'Focus' },
                            { title: 'Heart Healing', freq: '639 Hz + 528 Hz', desc: 'Emotional balance, relationship healing', concern: 'Gratitude' }
                        ].map((freq, idx) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                                <div className="flex-grow">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 flex-shrink-0 bg-purple-400/20 text-purple-300 rounded-full flex items-center justify-center mt-1">
                                            <SoundIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">{freq.title}</h4>
                                            <p className="text-xs text-purple-300 font-mono mt-1">{freq.freq}</p>
                                            <p className="text-sm text-white/70 mt-2">{freq.desc}</p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onStartActivity({ 
                                        type: 'soundscape', 
                                        data: { 
                                            title: freq.title, 
                                            description: freq.desc,
                                            concern: freq.concern 
                                        } 
                                    })} 
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-200 rounded-full hover:bg-purple-500/30 transition text-sm font-semibold border border-purple-400/30"
                                >
                                    <PlayIcon className="w-4 h-4"/>
                                    Play Frequency
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'sleep':
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

      {(activeTab === 'soundscapes' || activeTab === 'breathe') && (
          <div className="mb-4">
              <label className="text-sm text-white/70 mb-2 block">Show me practices for:</label>
              <div className="flex flex-wrap gap-2">
                  {MOODS.map(mood => (
                      <button 
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedMood === mood ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                      >
                          {mood}
                      </button>
                  ))}
              </div>
          </div>
        )}
        
        <div className="pb-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Explore;
