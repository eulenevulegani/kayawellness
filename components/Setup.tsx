
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { ArrowLeftIcon, KayaIcon } from './Icons';
import KayaLogo from './KayaLogo';

interface SetupProps {
  onComplete: (profile: UserProfile, password: string) => void;
}

const ALL_GOALS = [
  { id: 'stress', label: 'Navigate to Serenity', subtitle: 'Manage daily stress' },
  { id: 'sleep', label: 'Journey to Restful Realms', subtitle: 'Improve sleep quality' },
  { id: 'grounded', label: 'Find Your Center', subtitle: 'Stay grounded & present' },
  { id: 'gratitude', label: 'Cultivate Cosmic Gratitude', subtitle: 'Practice gratitude daily' },
  { id: 'anxiety', label: 'Calm the Cosmic Storm', subtitle: 'Manage anxiety' },
  { id: 'focus', label: 'Sharpen Stellar Focus', subtitle: 'Increase concentration' },
  { id: 'resilience', label: 'Strengthen Stellar Core', subtitle: 'Build inner resilience' },
  { id: 'balance', label: 'Harmonize Your Orbit', subtitle: 'Work-life balance' },
  { id: 'self-love', label: 'Radiate Inner Light', subtitle: 'Cultivate self-love' }
];
const CHECK_IN_OPTIONS: ('morning' | 'midday' | 'night' | 'personalized')[] = ['morning', 'midday', 'night', 'personalized'];
// lifestyle options removed to streamline setup flow
const SUPPORT_PREFERENCES = ['Professional Therapy', 'Self-Guided Practice', 'Community Support', 'Group Sessions', 'Not Sure Yet'];
const EXPERIENCE_LEVELS = [
    { id: 'beginner', label: 'New to the Cosmos', description: "I'm just beginning to explore", icon: '🌱' },
    { id: 'intermediate', label: 'Emerging Star', description: "I've practiced mindfulness before", icon: '⭐' },
    { id: 'advanced', label: 'Cosmic Navigator', description: 'I have an established practice', icon: '✨' }
];

const ProgressBar: React.FC<{ current: number, total: number }> = ({ current, total }) => (
    <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-white/70">Step {current} of {total}</span>
            <span className="text-sm text-white font-medium">{Math.round((current / total) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${(current / total) * 100}%` }}
            />
        </div>
    </div>
);


const Setup: React.FC<SetupProps> = ({ onComplete }) => {
  // Load saved onboarding progress from localStorage
  const loadSavedProgress = () => {
    try {
      const saved = localStorage.getItem('kaya-onboarding-progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
    }
    return null;
  };

  // Clear any old saved progress since we simplified the flow
  useEffect(() => {
    localStorage.removeItem('kaya-onboarding-progress');
  }, []);

  const [step, setStep] = useState(1);
  const totalSteps = 7; // Streamlined setup (removed intro and redundant preferred time)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [ageRange, setAgeRange] = useState<UserProfile['ageRange']>('25-34');
  const [lifeStage, setLifeStage] = useState<UserProfile['lifeStage']>('other');
  const [preferredTime, setPreferredTime] = useState<UserProfile['preferredTime']>('evening');
  const [sessionLengthPreference, setSessionLengthPreference] = useState<UserProfile['sessionLengthPreference']>('10-15');
  const [voicePreference, setVoicePreference] = useState<UserProfile['voicePreference']>('no-preference');
  const [checkInTimes, setCheckInTimes] = useState<UserProfile['checkInTimes']>(['midday']);
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('22:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleGoalToggle = (goalId: string) => {
    const newGoals = goals.includes(goalId)
      ? goals.filter(g => g !== goalId)
      : [...goals, goalId];
    setGoals(newGoals);
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
        handleNext();
        return;
    }
    
    // Complete 9-step journey through the cosmos - you are the sun at the center
    localStorage.removeItem('kaya-onboarding-progress');
    
    onComplete({
      name: name.trim(),
      email: email.trim(),
      goals,
      sessionLength: sessionLengthPreference === '3-5' ? 'short' : sessionLengthPreference === '30+' ? 'long' : 'medium',
      checkInTimes,
      lifestyle: 'balanced',
      activeProgramId: null,
      programProgress: 0,
      subscriptionTier: 'stardust',
      lastSessionDate: null,
      supportPreferences: [],
      experienceLevel,
      completedPrograms: [],
      streak: 0,
      xp: 0,
      level: 1,
      notificationPreferences: {
        enabled: notificationsEnabled,
        checkInReminders: notificationsEnabled,
        streakProtection: notificationsEnabled,
        milestoneAlerts: notificationsEnabled,
        challengeUpdates: false,
        therapistQA: false,
        calendarSync: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00'
      },
      wakeTime,
      sleepTime,
      morningWellnessEnabled: false,
      joinedChallenges: [],
      supportGroups: [],
      ageRange,
      lifeStage,
      preferredTime,
      sessionLengthPreference,
      voicePreference,
      weeklySessionsUsed: 0,
      lastResetDate: new Date().toISOString()
    }, password.trim());
  };
  
  const handleCheckInTimeClick = (time: 'morning' | 'midday' | 'night' | 'personalized') => {
    setCheckInTimes([time]);
  };

  const isContinueDisabled = () => {
      // Step 1: Welcome - can always continue
      if (step === 1) return false;
      // Step 2: Goals - requires at least one goal
      if (step === 2 && goals.length === 0) return true;
      // Step 3: Experience - has default value
      // Step 4: Demographics - has default values  
      // Step 5: Preferences (time & length) - has default values
      // Step 6: Voice preference - optional, always can continue
      // Step 7: Check-in times - has default value
      // Step 8: Schedule - has default values
      // Step 9: Name, Email & Password - THE SUN (center of your universe)
      if (step === 9) {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        const passwordValid = password.trim().length >= 8;
        return name.trim().length < 2 || !emailValid || !passwordValid;
      }
      return false;
  }

  const renderContent = () => {
    switch(step) {
      case 1:
        return (
          <div key={1} className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-center">What Stars Are You Reaching For?</h2>
            <p className="text-white/60 mb-6 text-center max-w-2xl mx-auto text-sm">
                Choose the paths that resonate with you
            </p>
            {goals.length > 0 && (
                <div className="mb-4 text-center">
                    <span className="inline-block px-3 py-1.5 bg-cyan-400/20 text-cyan-300 rounded-full text-xs font-medium">
                        {goals.length} {goals.length === 1 ? 'goal' : 'goals'} selected ✨
                    </span>
                </div>
            )}
            <div className="flex flex-wrap gap-2.5 justify-center max-w-3xl mx-auto">
              {ALL_GOALS.map((goal) => (
                  <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`px-4 py-3 rounded-xl text-sm transition transform hover:scale-105 active:scale-95 text-left ${goals.includes(goal.id) ? 'bg-white text-black font-semibold shadow-lg' : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'}`}
                  >
                      <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                              {goals.includes(goal.id) && '✨ '}
                              {goal.label}
                          </span>
                          <span className={`text-xs mt-0.5 ${goals.includes(goal.id) ? 'text-cyan-800' : 'text-white/60'}`}>
                              {goal.subtitle}
                          </span>
                      </div>
                  </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div key={2} className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-center">Your Cosmic Experience</h2>
            <p className="text-white/60 mb-6 text-center max-w-2xl mx-auto text-sm">
              🪐 Planet 3: Understanding your journey level
            </p>
            <div className="space-y-2.5 max-w-lg mx-auto">
              {EXPERIENCE_LEVELS.map(option => (
                <button key={option.id} type="button" onClick={() => setExperienceLevel(option.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition transform hover:scale-[1.02] ${experienceLevel === option.id ? 'bg-white/15 border-white shadow-lg' : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{option.icon}</div>
                    <div className="flex-grow">
                      <p className="font-semibold text-white text-sm">{option.label}</p>
                      <p className="text-xs text-white/60 mt-0.5">{option.description}</p>
                    </div>
                    {experienceLevel === option.id && (
                      <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-cyan-900 text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div key={3} className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-center">Your Life Constellation</h2>
            <p className="text-white/60 mb-6 text-center max-w-2xl mx-auto text-sm">
              🌍 Planet 4: Your place in the cosmos
            </p>
            <div className="space-y-5 max-w-lg mx-auto">
              <div>
                <label className="block text-white/80 mb-2 text-xs font-medium">Age Range</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['18-24', '25-34', '35-44', '45-54', '55+'] as const).map(range => (
                    <button key={range} type="button" onClick={() => setAgeRange(range)}
                      className={`p-3 rounded-xl border-2 transition ${ageRange === range ? 'bg-white/15 border-white' : 'border-white/20 bg-white/5 hover:border-white/40'}`}>
                      <span className="text-white font-medium text-sm">{range}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-xs font-medium">Life Stage</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {([
                    { id: 'student', label: 'Student', emoji: '📚' },
                    { id: 'professional', label: 'Professional', emoji: '💼' },
                    { id: 'parent', label: 'Parent', emoji: '👨‍👩‍👧‍👦' },
                    { id: 'retired', label: 'Retired', emoji: '🌅' },
                    { id: 'other', label: 'Other', emoji: '✨' }
                  ] as const).map(stage => (
                    <button key={stage.id} type="button" onClick={() => setLifeStage(stage.id)}
                      className={`p-3 rounded-xl border-2 transition text-left flex items-center gap-2.5 ${lifeStage === stage.id ? 'bg-white/15 border-white' : 'border-white/20 bg-white/5 hover:border-white/40'}`}>
                      <span className="text-xl">{stage.emoji}</span>
                      <span className="text-white font-medium text-xs">{stage.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div key={4} className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-center">Your Wellness Rhythm</h2>
            <p className="text-white/60 mb-6 text-center max-w-2xl mx-auto text-sm">
              ☄️ Planet 4: Session length preference
            </p>
            <div className="space-y-5 max-w-lg mx-auto">
              <div>
                <label className="block text-white/80 mb-2 text-xs font-medium">Preferred Session Length</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {([
                    { id: '3-5', label: '3-5 min', desc: 'Quick reset' },
                    { id: '10-15', label: '10-15 min', desc: 'Balanced practice' },
                    { id: '20-30', label: '20-30 min', desc: 'Deep dive' },
                    { id: '30+', label: '30+ min', desc: 'Full immersion' }
                  ] as const).map(length => (
                    <button key={length.id} type="button" onClick={() => setSessionLengthPreference(length.id)}
                      className={`p-3 rounded-xl border-2 transition text-left ${sessionLengthPreference === length.id ? 'bg-white/15 border-white' : 'border-white/20 bg-white/5 hover:border-white/40'}`}>
                      <div className="text-white font-medium text-xs">{length.label}</div>
                      <div className="text-white/60 text-xs mt-0.5">{length.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div key={5} className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-center">Your Voice Guide</h2>
            <p className="text-white/60 mb-6 text-center max-w-2xl mx-auto text-sm">
              🎵 Planet 5: Choose the voice that resonates with you
            </p>
            <div className="max-w-lg mx-auto">
              <label className="block text-white/80 mb-2 text-xs font-medium text-center">Voice Preference (Optional)</label>
              <div className="grid grid-cols-2 gap-2.5">
                {([
                  { id: 'female', label: 'Female', emoji: '🌸' },
                  { id: 'male', label: 'Male', emoji: '🌊' },
                  { id: 'non-binary', label: 'Non-binary', emoji: '✨' },
                  { id: 'no-preference', label: 'Surprise Me', emoji: '🎲' }
                ] as const).map(voice => (
                  <button key={voice.id} type="button" onClick={() => setVoicePreference(voice.id)}
                    className={`p-3.5 rounded-xl border-2 transition transform hover:scale-[1.02] ${voicePreference === voice.id ? 'bg-white/15 border-white shadow-lg' : 'border-white/20 bg-white/5 hover:border-white/40'}`}>
                    <div className="text-2xl mb-1.5">{voice.emoji}</div>
                    <span className="text-white font-medium text-xs">{voice.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div key={6} className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-center">Your Daily Touch Points</h2>
            <p className="text-white/60 mb-6 text-center max-w-2xl mx-auto text-sm">
              🌟 Planet 6: When the universe calls you
            </p>
            <div className="grid grid-cols-1 gap-2.5 max-w-lg mx-auto">
              {CHECK_IN_OPTIONS.map((time) => {
                const isSelected = checkInTimes.length > 0 && checkInTimes[0] === time;
                const isPremiumOption = time === 'personalized';
                const timeEmojis = { morning: '🌅', midday: '☀️', night: '🌙', personalized: '✨' };
                const timeLabels = { morning: 'Morning', midday: 'Midday', night: 'Night', personalized: 'Personalized' };
                const timeDesc = { 
                  morning: 'Start your day with intention', 
                  midday: 'Midday reset and recharge', 
                  night: 'Evening wind-down sessions',
                  personalized: 'AI learns your optimal times'
                };
                
                return (
                  <button key={time} type="button" 
                    onClick={() => handleCheckInTimeClick(time)}
                    disabled={isPremiumOption}
                    className={`p-3.5 rounded-xl transition text-left transform hover:scale-[1.02] ${
                      isSelected
                      ? 'bg-white text-black font-semibold shadow-lg' 
                      : isPremiumOption
                      ? 'bg-white/5 text-white/40 border border-white/10 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{timeEmojis[time]}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm">{timeLabels[time]}</span>
                          {isPremiumOption && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded-full">Premium</span>
                          )}
                        </div>
                        <p className="text-xs opacity-70">{timeDesc[time]}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <span className="text-cyan-900 text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 6:
        return (
          <div key={6} className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-center">Your Cosmic Schedule</h2>
            <p className="text-white/60 mb-6 text-center max-w-2xl mx-auto text-sm">
              🌞 Planet 8: Aligning with your sun and moon
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                <label className="block text-white font-medium mb-2.5 flex items-center gap-2 text-sm">
                  <span className="text-xl">🌅</span>
                  When does your day begin?
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <p className="text-xs text-white/60 mt-2">
                  We'll suggest morning sessions around this time
                </p>
              </div>
              <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                <label className="block text-white font-medium mb-2.5 flex items-center gap-2 text-sm">
                  <span className="text-xl">🌙</span>
                  When do you rest?
                </label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <p className="text-xs text-white/60 mt-2">
                  Perfect for evening wind-down and sleep stories
                </p>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div key={7} className="animate-fade-in">
            <div className="mb-6 text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-pulse shadow-2xl shadow-white/30">
                <div className="w-18 h-18 bg-white/80 rounded-full flex items-center justify-center">
                  <span className="text-3xl">☀️</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-white mb-3">You Are The Sun</h2>
              <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed mb-2">
                ☀️ The Center of Your Universe
              </p>
              <p className="text-cyan-300 text-xs max-w-xl mx-auto">
                You've journeyed through 8 celestial realms. Now place yourself at the center—radiant, powerful, and complete.
              </p>
            </div>
            <div className="space-y-3.5 max-w-md mx-auto">
              <div>
                <label htmlFor="name" className="block text-white/80 mb-1.5 font-medium text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How shall we call you?"
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition text-sm"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-white/80 mb-1.5 font-medium text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition text-sm"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-white/80 mb-1.5 font-medium text-sm">
                  Create Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition text-sm"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <p className="mt-1.5 text-xs text-white/50">Your secure key to your wellness universe</p>
              </div>
              <div className="bg-white/10 border border-white/30 rounded-xl p-5 text-center mt-6">
                <p className="text-yellow-300 font-medium mb-2">
                  ✨ Almost There!
                </p>
                <p className="text-sm text-white/70">
                  We'll send a verification code to your email to complete your journey
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
        {step > 1 && (
            <button type="button" onClick={handleBack} className="fixed top-6 left-6 text-white/60 hover:text-white transition z-50">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
        )}
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="w-full max-w-md mx-auto">
                    <ProgressBar current={step} total={totalSteps} />
                    {renderContent()}
                </div>
            </div>

            <div className="flex-shrink-0 p-4">
                <div className="w-full max-w-md mx-auto">
                    <button
                        type="submit"
                        disabled={isContinueDisabled()}
                        className={`w-full px-12 py-4 rounded-full font-bold text-lg transition duration-300 ${
                          isContinueDisabled()
                            ? 'bg-white/20 text-white/40 cursor-not-allowed'
                            : 'bg-white text-black shadow-2xl hover:opacity-90 transform hover:scale-105'
                        } ${step === 9 ? 'shadow-yellow-400/50' : ''}`}
                    >
                        {step === 9 ? '☀️ Illuminate Your Universe' : 'Journey Onward'}
                    </button>
                    {isContinueDisabled() && step === 9 && (
                        <p className="text-center text-white/50 text-xs mt-3">
                            Fill in all fields to continue (name 2+ chars, valid email, password 8+ chars)
                        </p>
                    )}
                </div>
            </div>
        </form>
    </div>
  );
};

export default Setup;
