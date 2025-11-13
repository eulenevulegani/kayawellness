


import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, PersonalizedSessionData, WellnessProgram, AppView, Achievement, ChatMessage, SessionHistoryEntry } from '../types';
import { continueChatWithContext, generatePersonalizedSession } from '../services/geminiService';
import contextService, { UserContext } from '../services/contextService';
import Loader from './Loader';
import { MicrophoneIcon, StarIcon, LotusIcon, KayaIcon } from './Icons';
import PersonalGrowthTree from './PersonalGrowthTree';

interface DashboardProps {
  userProfile: UserProfile;
  achievements: Achievement[];
  sessionHistory: SessionHistoryEntry[];
  onShowAffirmation: (affirmation: string, session: PersonalizedSessionData, mood: string) => void;
  programs: WellnessProgram[];
  sessionCompletedToday: boolean;
  onNavigate: (view: AppView) => void;
}

const SessionCompletedView: React.FC<{ onNavigate: (view: AppView) => void, userProfile: UserProfile, sessionHistory: SessionHistoryEntry[] }> = ({ onNavigate, userProfile, sessionHistory }) => {
    return (
        <div className="w-full max-w-xl mx-auto p-4 animate-fade-in text-center">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full flex items-center justify-center text-cyan-400 mx-auto animate-gentle-pulse">
                    <StarIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-light text-white">Your light shines brighter</h2>
                <p className="text-sm sm:text-base text-white/70 mt-3 mb-6 max-w-md mx-auto">
                    Another star added to your Stellar System. The universe noticed your dedication today.
                </p>
                 <div className="relative w-full h-48 bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center my-6">
                    <PersonalGrowthTree userProfile={userProfile} sessionHistory={sessionHistory} />
                </div>
                <button 
                    onClick={() => onNavigate('cosmicLibrary')} 
                    className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transition shadow-lg shadow-cyan-500/30"
                >
                    <LotusIcon className="w-5 h-5" />
                    Explore Cosmos
                </button>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ userProfile, achievements, sessionHistory, onShowAffirmation, programs, sessionCompletedToday, onNavigate }) => {
    const [loading, setLoading] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string>('');
    const [selectedContext, setSelectedContext] = useState<string>('');
    const [userInput, setUserInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [userContext, setUserContext] = useState<UserContext | null>(null);
    const [showFollowUp, setShowFollowUp] = useState(false);
    
    const recognitionRef = useRef<any>(null);
    const baseTextRef = useRef('');

    const activeProgram = userProfile.activeProgramId
        ? programs.find(p => p.id === userProfile.activeProgramId)
        : null;

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          recognition.onresult = (event) => setUserInput(baseTextRef.current + event.results[0][0].transcript);
          recognition.onerror = (event) => { console.error('Speech recognition error:', event.error); setIsListening(false); };
          recognition.onend = () => setIsListening(false);
          recognitionRef.current = recognition;
        }
        return () => recognitionRef.current?.stop();
    }, []);

    useEffect(() => {
        // Load user context
        const loadContext = async () => {
            const context = await contextService.getUserContext(userProfile, sessionHistory);
            setUserContext(context);
        };
        loadContext();
    }, [userProfile, sessionHistory]);



    const handleMoodSelection = (mood: string) => {
        setSelectedMood(mood);
        setShowFollowUp(true);
    };

    const handleContextSelection = (context: string) => {
        setSelectedContext(context);
        handleSessionGeneration(context);
    };

    const handleVoiceSubmit = () => {
        if (userInput.trim()) {
            handleSessionGeneration(userInput.trim());
        }
    };

    const handleSessionGeneration = async (additionalContext: string = '') => {
        setLoading(true);

        const programContext = activeProgram ? {
            title: activeProgram.title,
            day: userProfile.programProgress,
            theme: activeProgram.dailyThemes[userProfile.programProgress - 1],
        } : undefined;

        const fullContext = `Mood: ${selectedMood}. ${additionalContext ? `Additional context: ${additionalContext}` : ''}`;

        try {
            const session = await generatePersonalizedSession(fullContext, userProfile, programContext);
            const affirmationStep = session.steps.find(step => step.type === 'affirmation');

            if (affirmationStep && affirmationStep.type === 'affirmation') {
                 onShowAffirmation(affirmationStep.data.text, session, selectedMood);
            } else {
                onShowAffirmation(`${userProfile.name}, you are capable and strong.`, session, selectedMood);
            }
        } catch (error) {
            console.error("Failed to generate session:", error);
            setLoading(false);
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return alert("Sorry, your browser doesn't support speech recognition.");
        if (isListening) {
          recognitionRef.current.stop();
        } else {
          baseTextRef.current = userInput;
          recognitionRef.current.start();
          setIsListening(true);
        }
    };
    
    if (loading) return <Loader />;

    const RecentAchievement: React.FC = () => {
        const mostRecentAchievement = achievements?.[0];
        if (!mostRecentAchievement) return null;
        return (
            <div className="w-full mt-4 p-4 bg-yellow-400/10 border border-yellow-500/20 rounded-xl text-left animate-fade-in">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center">
                            <StarIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">Latest Achievement</p>
                            <p className="font-semibold text-white mt-1">{mostRecentAchievement.title}</p>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('journal')} className="text-sm text-white/70 hover:text-white underline flex-shrink-0">View All</button>
                </div>
            </div>
        );
    };

    if (sessionCompletedToday) {
        return <SessionCompletedView onNavigate={onNavigate} userProfile={userProfile} sessionHistory={sessionHistory} />;
    }
    
    const commonMoods = ['Stressed', 'Anxious', 'Happy', 'Tired', 'Grateful', 'Okay'];
    
    const getFollowUpOptions = (mood: string) => {
        const options: Record<string, string[]> = {
            'Stressed': ['Before a big event', 'Work overload', 'Personal matters', 'General tension'],
            'Anxious': ['About the future', 'Social situations', 'Health concerns', 'General worry'],
            'Happy': ['Celebrating something', 'Feeling grateful', 'Just good vibes', 'Want to amplify it'],
            'Tired': ['Need energy boost', 'Trouble sleeping', 'Mentally drained', 'Physically exhausted'],
            'Grateful': ['Reflect on blessings', 'Share appreciation', 'Deepen gratitude', 'Celebrate wins'],
            'Okay': ['Just checking in', 'Maintain balance', 'Stay grounded', 'Feeling neutral']
        };
        return options[mood] || [];
    };
    
    const getGreeting = () => {
        if (userContext) {
            return contextService.generateContextualGreeting(userContext, userProfile.name);
        }
        return `Hello, ${userProfile.name}. How are you feeling right now?`;
    };

    return (
      <div className="w-full min-h-[80vh] sm:h-[90vh] flex items-center justify-center px-2 sm:px-4">
        <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 flex flex-col" style={{ minHeight: '60vh' }}>
          {/* Active Program Status */}
          {activeProgram && !selectedMood && (
            <div className="mb-4 sm:mb-6 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center animate-fade-in">
              <p className="font-semibold text-white text-sm sm:text-base">{activeProgram.title}</p>
              <p className="text-xs sm:text-sm text-white/70 mt-1">Day {userProfile.programProgress} of {activeProgram.duration}</p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(userProfile.programProgress / activeProgram.duration) * 100}%` }}></div>
              </div>
            </div>
          )}
          
          {/* Main Interface */}
          <div className="flex-grow flex flex-col justify-center">
            {!selectedMood ? (
              <div className="flex flex-col items-center gap-6">
                {/* Kaya's Greeting */}
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <KayaIcon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 p-4 rounded-2xl max-w-md text-center">
                    <p className="text-white text-base">{getGreeting()}</p>
                  </div>
                </div>
                
                {/* Mood Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {commonMoods.map((m) => (
                    <button 
                      key={m} 
                      onClick={() => handleMoodSelection(m)}
                      className="px-6 py-3 bg-white/10 text-white rounded-full font-semibold text-sm transform transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            ) : !showFollowUp ? null : (
              <div className="flex flex-col items-center gap-6 animate-fade-in">
                {/* Follow-up Message */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <KayaIcon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 p-4 rounded-2xl max-w-md text-center">
                    <p className="text-white text-base">I hear you're feeling {selectedMood.toLowerCase()}. What's the context?</p>
                  </div>
                </div>
                
                {/* Context Options */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {getFollowUpOptions(selectedMood).map((option) => (
                    <button 
                      key={option}
                      onClick={() => handleContextSelection(option)}
                      className="px-5 py-2.5 bg-white/10 text-white rounded-full font-medium text-sm transform transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {/* Voice Option */}
                <div className="text-center">
                  <p className="text-white/50 text-xs mb-3">Or share more details with your voice</p>
                  <button 
                    type="button" 
                    onClick={toggleListening} 
                    aria-label={isListening ? 'Stop voice input' : 'Start voice input'} 
                    className={`relative px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto ${isListening ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <MicrophoneIcon className="w-5 h-5" />
                    {isListening ? 'Listening...' : 'Speak Your Mind'}
                    {isListening && <span className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-ping"></span>}
                  </button>
                  {isListening && userInput && (
                    <div className="mt-3 p-3 bg-white/10 border border-white/20 rounded-xl max-w-md mx-auto">
                      <p className="text-white/90 text-sm">{userInput}</p>
                      <button 
                        onClick={handleVoiceSubmit}
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold text-sm hover:opacity-90 transition"
                      >
                        Create My Session
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <RecentAchievement />
        
        <style>{`
            @keyframes pulse-orb {
                0%, 100% { transform: scale(0.95); }
                50% { transform: scale(1.05); }
            }
            .animate-pulse-orb {
                animation: pulse-orb 8s ease-in-out infinite;
            }
        `}</style>
      </div>
    );
};

export default Dashboard;