import React, { useState, useEffect, useRef } from 'react';
import { SessionHistoryEntry, Achievement, UserProfile } from '../types';
import { ArrowLeftIcon, StarIcon, SparklesIcon, BrainIcon, MicrophoneIcon } from './Icons';
import { generateJournalPrompts, generateWeeklyInsight, generateFollowUpPrompt } from '../services/geminiService';

interface JournalProps {
  history: SessionHistoryEntry[];
  achievements: Achievement[];
  onClose: () => void;
  onSaveEntry: (entryText: string) => void;
  userProfile: UserProfile;
}

const Journal: React.FC<JournalProps> = ({ history, achievements, onClose, onSaveEntry, userProfile }) => {
  const [newEntry, setNewEntry] = useState('');
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  // Ensure achievements and history are always arrays
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  const safeHistory = Array.isArray(history) ? history : [];

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef(''); // To store the text before starting transcription

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      const separator = baseTextRef.current.trim() ? ' ' : '';
      setNewEntry(baseTextRef.current + separator + transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    
    return () => {
        recognitionRef.current?.stop();
    };

  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      baseTextRef.current = newEntry; // Save current text
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleGetPrompt = async () => {
    if (userProfile.subscriptionTier !== 'premium') return;
    setPromptsLoading(true);
    if (newEntry.trim()) {
        const followUp = await generateFollowUpPrompt(newEntry);
        setNewEntry(prev => `${prev}\n\n${followUp} `);
    } else {
        const context = `A user is looking for inspiration for a new journal entry. Their last reflection was about: "${history[0]?.reflection || 'their day'}".`;
        const prompts = await generateJournalPrompts(context);
        if (prompts.length > 0) {
            setNewEntry(prompts[Math.floor(Math.random() * prompts.length)]);
        }
    }
    setPromptsLoading(false);
  };

  const handleGetInsight = async () => {
    setInsightLoading(true);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentHistory = safeHistory.filter(entry => new Date(entry.date) > oneWeekAgo);

    const generatedInsight = await generateWeeklyInsight(recentHistory);
    setInsight(generatedInsight);
    setInsightLoading(false);
  };

  const handleSaveEntry = () => {
    if (newEntry.trim() === '') return;
    onSaveEntry(newEntry.trim());
    setNewEntry(''); // Clear the textarea
  };

  return (
    <div className="h-screen overflow-y-auto p-6 pt-24">
      <div className="w-full max-w-4xl mx-auto animate-fade-in text-white pb-20">
        <header className="mb-6">
          <h2 className="text-3xl font-light text-white">Your Journal</h2>
        </header>
      
      <div className="space-y-8">
        <section>
            <h3 className="text-xl font-medium text-white/90 mb-4 border-b border-white/20 pb-2">Kaya's Weekly Insight</h3>
            {userProfile.subscriptionTier === 'premium' ? (
                <>
                    {insightLoading ? (
                        <div className="flex items-center justify-center space-x-2 text-white/60 bg-white/5 rounded-lg p-4">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Kaya is reflecting on your week...</span>
                        </div>
                    ) : insight ? (
                        <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                            <p className="text-white/80 italic">"{insight}"</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-white/5 rounded-lg">
                            <p className="text-white/70 mb-3">Discover patterns and insights from your past week.</p>
                            <button onClick={handleGetInsight} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/90 font-semibold rounded-full hover:bg-white/20 transition">
                                <BrainIcon className="w-5 h-5" />
                                Generate My Insight
                            </button>
                        </div>
                    )}
                </>
            ) : (
                 <div className="flex flex-col items-center justify-center text-center p-4 bg-white/5 rounded-lg border border-yellow-500/20">
                    <StarIcon className="w-8 h-8 text-yellow-300 mb-3" />
                    <p className="font-semibold text-white">Unlock Weekly Insights</p>
                    <p className="text-white/70 text-sm mt-1 mb-3">Upgrade to Kaya+ to discover patterns and insights from your week.</p>
                    <button onClick={onClose} className="px-4 py-2 bg-yellow-400/20 text-yellow-200 text-sm font-semibold rounded-full hover:bg-yellow-400/30 transition">
                        View Upgrade Options
                    </button>
                </div>
            )}
        </section>

        <section>
            <h3 className="text-xl font-medium text-white/90 mb-4 border-b border-white/20 pb-2">New Reflection</h3>
            <div className="space-y-3">
                <div className="relative">
                    <textarea 
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        placeholder={isListening ? "Listening..." : "What's on your mind?"}
                        className="w-full h-28 bg-white/5 border border-white/20 rounded-lg p-3 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                    />
                    <button 
                        type="button" 
                        onClick={toggleListening} 
                        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'text-red-400 bg-white/20' : 'text-white/60 hover:bg-white/20'}`}
                    >
                        <MicrophoneIcon className="w-5 h-5" />
                        {isListening && <span className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-ping"></span>}
                    </button>
                </div>
                <div className="flex justify-end items-center gap-3">
                    <div className="relative">
                        <button onClick={handleGetPrompt} disabled={promptsLoading || userProfile.subscriptionTier === 'free'} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 text-sm rounded-full hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed peer">
                            {promptsLoading ? (
                               <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                               <SparklesIcon className="w-4 h-4" />
                            )}
                            {newEntry.trim() ? 'Reflect Deeper' : 'Inspire Me'}
                        </button>
                        {userProfile.subscriptionTier === 'free' && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 peer-disabled:opacity-100 transition-opacity pointer-events-none">
                                ✨ AI prompts available in KAYA+
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                            </div>
                        )}
                    </div>
                    <button onClick={handleSaveEntry} disabled={!newEntry.trim()} className="px-4 py-2 bg-white text-blue-900 text-sm font-semibold rounded-full hover:bg-opacity-90 transition disabled:opacity-50">
                        Save Reflection
                    </button>
                </div>
            </div>
        </section>

        <section>
          <h3 className="text-xl font-medium text-white/90 mb-4 border-b border-white/20 pb-2">Achievement Gallery</h3>
          {safeAchievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeAchievements.map((ach, index) => (
                <div key={index} className="bg-white/10 p-4 rounded-lg text-center border border-white/10">
                  <StarIcon className="w-8 h-8 mx-auto text-yellow-300 mb-2" />
                  <p className="font-semibold text-white">{ach.title}</p>
                  <p className="text-sm text-white/70 mt-1">{ach.description}</p>
                  <p className="text-xs text-white/50 mt-2">{formatDate(ach.date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-lg border border-white/10">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4">
                <StarIcon className="w-9 h-9 text-yellow-300" />
              </div>
              <p className="text-white font-medium mb-2">Your First Achievement Awaits</p>
              <p className="text-white/60 text-sm mb-4">Complete a wellness session to unlock your first achievement and start building your collection.</p>
              <button onClick={onClose} className="px-6 py-2 bg-white/10 text-white text-sm font-semibold rounded-full hover:bg-white/20 transition">
                Start a Session
              </button>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xl font-medium text-white/90 mb-4 border-b border-white/20 pb-2">Session History</h3>
          {safeHistory.length > 0 ? (
            <ul className="space-y-4">
              {safeHistory.map((entry, index) => (
                <li key={index} className="bg-white/10 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-white/50">{formatDate(entry.date)}</p>
                  <p className="font-semibold text-white/90 mt-1">You were feeling: <span className="font-normal italic">{entry.mood}</span></p>
                  {entry.reflection && (
                    <blockquote className="mt-2 text-sm text-white/80 border-l-2 border-white/30 pl-3 italic">
                      "{entry.reflection}"
                    </blockquote>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-lg border border-white/10">
              <div className="w-16 h-16 bg-cyan-400/10 rounded-full flex items-center justify-center mb-4">
                <SparklesIcon className="w-9 h-9 text-cyan-300" />
              </div>
              <p className="text-white font-medium mb-2">Begin Your Wellness Journey</p>
              <p className="text-white/60 text-sm mb-4">Your session history and reflections will appear here. Start your first session to begin tracking your progress.</p>
              <button onClick={onClose} className="px-6 py-2 bg-white/10 text-white text-sm font-semibold rounded-full hover:bg-white/20 transition">
                Go to Home
              </button>
            </div>
          )}
        </section>
        </div>
      </div>
    </div>
  );
};

export default Journal;
