import React, { useState, useEffect } from 'react';
import { AppView, UserProfile, SessionHistoryEntry, Achievement, WellnessProgram, GratitudeEntry, Activity, PersonalizedSessionData } from './types';
import Profile from './components/Profile';
import SleepStories from './components/SleepStory';
import Setup from './components/Setup';
import Explore from './components/Programs';
import Community from './components/Community';
import Dashboard from './components/Journey';
import ActivityPlayer from './components/Session';
import Navigation from './components/CompletionScreen';
import PersonalizedSession from './components/PersonalizedSession';
import PostSessionScreen from './components/PostSessionScreen';
import LandingPage from './components/LandingPage';
import Affirmation from './components/Affirmation';
import SetupComplete from './components/SetupComplete';
import ProgramComplete from './components/ProgramComplete';
import TherapistMatcher from './components/TherapistMatcher';
import ConstellationStreak from './components/ConstellationStreak';
import QuickWinTrivia from './components/QuickWinTrivia';
import GratitudeSkyFeed from './components/GratitudeSkyFeed';
import AchievementUnlock from './components/AchievementUnlock';
import TriviaGame from './components/TriviaGame';
import WellnessEvents from './components/WellnessEvents';
import WellnessResources from './components/WellnessResources';
import MoodInsights from './components/MoodInsights';
import Universe from './components/Universe';
import VoiceOrb from './components/VoiceOrb';
import GamificationDashboard from './components/GamificationDashboard';
import GlobalHeader from './components/GlobalHeader';
import AuthScreen from './components/AuthScreen';
import VerificationScreen from './components/VerificationScreen';
import Loader from './components/Loader';
import SplashScreen from './components/SplashScreen';
import Pricing from './components/Pricing';
import BreathingIntro from './components/BreathingIntro';
import AudioTest from './components/AudioTest';
import { supabase, getCurrentUser } from './services/supabase.client';
import { StarIcon } from './components/Icons';
import { generateAchievement } from './services/geminiService';
import notificationService from './services/notificationService';
import personalizationService from './services/personalizationService';
import authService from './services/auth.service';
import userService from './services/user.service';


export const WELLNESS_PROGRAMS: WellnessProgram[] = [
  {
    id: 'anxiety-relief-7d',
    title: '7-Day Anxiety Relief',
    description: 'A week-long journey to find calm, build resilience, and develop healthy coping mechanisms for anxiety.',
    duration: 7,
    dailyThemes: [
      'Acknowledging Your Feelings',
      'Grounding in the Present',
      'Releasing Physical Tension',
      'Cultivating Self-Compassion',
      'Challenging Anxious Thoughts',
      'Finding Your Inner Strength',
      'Integrating Calm into Daily Life'
    ],
  },
  {
    id: 'better-sleep-5d',
    title: '5-Day Guide to Better Sleep',
    description: 'Prepare your mind and body for deep, restorative sleep with this five-day series of relaxing sessions.',
    duration: 5,
    dailyThemes: [
      'Letting Go of the Day',
      'Quieting the Mind',
      'Relaxing the Body',
      'Visualizing Restful Dreams',
      'Creating a Sleep Sanctuary'
    ],
  },
];

const XP_CONFIG = {
  session: 50,
  gratitude: 10,
};
const calculateXpForLevel = (level: number) => 100 * Math.pow(level, 1.5);

const App: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>('');
  const [pendingSetupProfile, setPendingSetupProfile] = useState<UserProfile | null>(null);
  
  // User data state (now from API instead of localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<AppView>('landing');
  const [showSplash, setShowSplash] = useState(false); // No longer using splash screen
  const [hasCompletedInitialSplash, setHasCompletedInitialSplash] = useState(true);
  
  // Debug view changes
  useEffect(() => {
    console.log('🔄 View changed to:', view);
  }, [view]);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  
  // Session state
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [personalizedSession, setPersonalizedSession] = useState<PersonalizedSessionData | null>(null);
  const [lastMood, setLastMood] = useState<string>('');
  const [currentAffirmation, setCurrentAffirmation] = useState<string>('');
  const [completedProgram, setCompletedProgram] = useState<WellnessProgram | null>(null);
  const [breathingIntroFeeling, setBreathingIntroFeeling] = useState<string>('');

  // UI state
  const [levelUpInfo, setLevelUpInfo] = useState<{ newLevel: number } | null>(null);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  
  // Handle hash routing for special pages (like audio test)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash === 'audioTest') {
        setView('audioTest');
      }
    };
    
    // Check on mount
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Check authentication on mount and listen for auth changes (email link clicks)
  // Only run after initial splash is completed
  useEffect(() => {
    // Don't check auth until initial splash is done
    if (!hasCompletedInitialSplash) {
      return;
    }

    const checkAuth = async () => {
      // Check if user is authenticated with Supabase
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        try {
          // Fetch user profile from Supabase (bypassing backend API)
          const profile = await userService.getProfileFromSupabase();
          
          if (profile) {
            setUserProfile(profile);
            setIsAuthenticated(true);
            
            // Clear pending verification if user is now authenticated
            setPendingVerificationEmail('');
            setPendingSetupProfile(null);
            localStorage.removeItem('kaya-pending-signup');
            
            // Check if profile is complete (has essential onboarding data)
            // Existing users should have name and goals, new users need to complete setup
            const isProfileComplete = profile.name && profile.name.trim().length > 0 && profile.goals && profile.goals.length > 0;
            setView(isProfileComplete ? 'dashboard' : 'setup');
            
            console.log('✅ User authenticated and profile loaded from Supabase');
            console.log('📊 Profile data - Name:', profile.name, 'Goals:', profile.goals?.length || 0);
            console.log('🏠 Navigating to:', isProfileComplete ? 'dashboard' : 'setup');
          } else {
            // Profile doesn't exist yet
            console.log('⚠️ No profile found in Supabase');
            
            // Check if there's a pending setup profile from localStorage
            const pendingSignup = localStorage.getItem('kaya-pending-signup');
            if (pendingSignup) {
              try {
                const pendingData = JSON.parse(pendingSignup);
                console.log('� Pending signup data:', pendingData);
                console.log('�📝 Found pending profile, creating it now:', pendingData.email);
                
                if (pendingData.profile) {
                  setPendingSetupProfile(pendingData.profile);
                  // Automatically create the profile
                  await handleEmailVerified(pendingData.profile);
                } else {
                  console.error('❌ Pending profile data is missing profile object');
                  setIsAuthenticated(true);
                  setView('setup');
                }
              } catch (error) {
                console.error('❌ Failed to create profile from pending data:', error);
                setIsAuthenticated(true);
                setView('setup');
              }
            } else {
              // No pending profile - user needs to complete setup
              console.log('⚠️ No pending profile - user needs to complete setup');
              setIsAuthenticated(true);
              setView('setup');
            }
          }
        } catch (error) {
          console.error('❌ Auth check failed:', error);
          await authService.logout();
          setIsAuthenticated(false);
        }
      } else {
        // Not authenticated - clear pending state and show landing
        setPendingVerificationEmail('');
        setPendingSetupProfile(null);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();

    // Listen for auth state changes (e.g., email link confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.email);
      
      // Only handle SIGNED_IN event if it's a fresh sign-in (not on page load)
      if (event === 'SIGNED_IN' && session && !isLoading) {
        // Check if we just reloaded (prevent infinite loop)
        const justReloaded = sessionStorage.getItem('kaya-just-reloaded');
        if (justReloaded) {
          sessionStorage.removeItem('kaya-just-reloaded');
          return;
        }
        
        console.log('✅ User signed in - reloading page to load profile');
        sessionStorage.setItem('kaya-just-reloaded', 'true');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [hasCompletedInitialSplash, pendingSetupProfile]);

  // Load user data when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !userProfile) return;
      
      console.log('📊 Loading user data...');
      setIsLoadingData(true);
      
      // Set a timeout to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        console.warn('⚠️ Data loading timeout - proceeding anyway');
        setIsLoadingData(false);
      }, 3000); // 3 second timeout
      
      try {
        // Try to load data but don't fail if backend is down
        const results = await Promise.allSettled([
          userService.getSessionHistory(),
          userService.getAchievements(),
          userService.getGratitudeEntries()
        ]);
        
        clearTimeout(loadingTimeout);
        
        // Extract data from settled promises
        const history = results[0].status === 'fulfilled' ? results[0].value : [];
        const achievementList = results[1].status === 'fulfilled' ? results[1].value : [];
        const gratitude = results[2].status === 'fulfilled' ? results[2].value : [];
        
        setSessionHistory(Array.isArray(history) ? history : []);
        setAchievements(Array.isArray(achievementList) ? achievementList : []);
        setGratitudeEntries(Array.isArray(gratitude) ? gratitude : []);
        
        console.log('✅ User data loaded (backend may be offline, using defaults)');
      } catch (error) {
        clearTimeout(loadingTimeout);
        console.error('❌ Failed to load user data:', error);
        // Ensure arrays remain initialized on error
        setSessionHistory([]);
        setAchievements([]);
        setGratitudeEntries([]);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadUserData();
  }, [isAuthenticated, userProfile]);

  // Initialize notification service when user completes setup
  useEffect(() => {
    if (userProfile?.name && userProfile?.notificationPreferences?.enabled) {
      const initNotifications = async () => {
        await notificationService.requestNotificationPermission();
        
        if (userProfile.notificationPreferences?.calendarSync) {
          await notificationService.requestCalendarPermission();
          await notificationService.syncCalendar();
        }

        // Schedule check-in notifications
        notificationService.scheduleCheckInNotifications(
          userProfile,
          userProfile.notificationPreferences
        );

        // Schedule streak protection
        notificationService.scheduleStreakProtection(
          userProfile,
          userProfile.notificationPreferences
        );
      };

      initNotifications();
    }
  }, [userProfile?.name, userProfile?.notificationPreferences?.enabled]);

  // Check for context-aware suggestions
  useEffect(() => {
    if (userProfile?.name && view === 'dashboard') {
      const checkContext = async () => {
        const contextSuggestion = await personalizationService.detectContext(userProfile);
        
        if (contextSuggestion && userProfile.notificationPreferences?.enabled) {
          notificationService.sendContextAwareNotification(
            contextSuggestion.context,
            contextSuggestion.suggestion
          );
        }

        // Check for proactive suggestions
        const proactiveSuggestion = personalizationService.getProactiveSuggestion(
          userProfile,
          sessionHistory
        );

        if (proactiveSuggestion && userProfile.notificationPreferences?.enabled) {
          notificationService.sendContextAwareNotification(
            'Personalized Insight',
            proactiveSuggestion
          );
        }
      };

      checkContext();
    }
  }, [view, userProfile?.name]);

  const handleAddXp = async (amount: number, source: string = 'general') => {
    try {
      const updatedProfile = await userService.addXP(amount, source);
      
      // Check for level up
      if (updatedProfile.level > (userProfile?.level || 1)) {
        setLevelUpInfo({ newLevel: updatedProfile.level });
      }
      
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to add XP:', error);
    }
  };

  const handleSetupComplete = async (newProfile: UserProfile, password: string) => {
    try {
      console.log('🌌 Creating account for:', newProfile.email);
      
      // Sign up - this sends verification email
      const result = await authService.signup({
        email: newProfile.email || '',
        password: password,
        name: newProfile.name || ''
      });
      
      console.log('📬 Signup result:', result);
      
      if (result.needsVerification) {
        // Store the profile to complete setup after verification
        console.log('💾 Setting pending profile and email:', result.email);
        setPendingSetupProfile(newProfile);
        setPendingVerificationEmail(result.email);
        
        // Save to localStorage so it persists across page reloads
        localStorage.setItem('kaya-pending-signup', JSON.stringify({
          email: result.email,
          profile: newProfile
        }));
        
        console.log('📧 Verification email sent to:', result.email);
        console.log('🔄 Navigating to verification view');
        
        // Use 'verification' view instead of 'auth'
        setView('verification');
      }
    } catch (error) {
      console.error('❌ Failed to complete setup:', error);
      alert(error instanceof Error ? error.message : 'Failed to create your account. Please try again.');
    }
  };

  const handleEmailVerified = async (profile: UserProfile) => {
    try {
      console.log('📝 handleEmailVerified called with profile:', profile);
      
      if (!profile) {
        throw new Error('Profile data is undefined');
      }
      
      // Get current user to ensure we have the email
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Complete the profile setup in the database
      const completeProfile = {
        ...profile,
        email: currentUser.email || profile.email || '',
        subscriptionTier: 'stardust' as const,
        lastSessionDate: null,
        streak: 0,
        xp: 0,
        level: 1,
        completedPrograms: [],
        supportPreferences: profile.supportPreferences || [],
        experienceLevel: profile.experienceLevel || 'beginner',
        weeklySessionsUsed: 0,
        lastResetDate: new Date().toISOString()
      };
      
      console.log('🔄 Creating profile in Supabase with data:', completeProfile);
      const updatedProfile = await userService.completeSetup(completeProfile);
      console.log('✅ Profile created successfully:', updatedProfile);
      
      setUserProfile(updatedProfile);
      setIsAuthenticated(true);
      setPendingVerificationEmail('');
      setPendingSetupProfile(null);
      localStorage.removeItem('kaya-pending-signup');
      
      console.log('✅ Account verified and profile setup complete');
      console.log('🏠 Navigating to dashboard...');
      
      // Navigate to dashboard
      setView('dashboard');
      setShowSplash(false);
    } catch (error) {
      console.error('❌ Failed to complete profile setup:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Account verified but failed to complete setup: ${errorMessage}\n\nPlease try logging in again.`);
    }
  };

  const handleSplashComplete = () => {
    // No longer needed - landing page handles its own animation
    setHasCompletedInitialSplash(true);
    setShowSplash(false);
    
    // If this was the initial splash, authentication check will happen automatically
    // For subsequent splashes (after setup), navigate appropriately
    if (userProfile?.name && isAuthenticated) {
      setView('dashboard');
    }
  };

  const handleSetupConfirmed = () => {
      setView('dashboard');
  }
  
  const handleStartActivity = (activity: Activity) => {
    setActiveActivity(activity);
  };

  const handleCloseActivity = () => {
    setActiveActivity(null);
  };
  
  const handleStartProgram = async (programId: string) => {
    try {
      const updatedProfile = await userService.startProgram(programId);
      setUserProfile(updatedProfile);
      setView('dashboard');
    } catch (error) {
      console.error('Failed to start program:', error);
    }
  };
  
  const handleShowAffirmation = (affirmation: string, sessionData: PersonalizedSessionData, mood: string) => {
    setCurrentAffirmation(affirmation);
    setPersonalizedSession(sessionData);
    setLastMood(mood);
    setView('affirmation');
  };
  
  const handleProceedToSession = () => {
    setView('session');
  };

  const handleSessionComplete = () => {
    setPersonalizedSession(null);
    setView('completion');
  };

  const handleCompletionDone = async () => {
    if (!userProfile) return;
    
    let programJustCompleted = false;

    try {
      // Refresh user profile (streak, XP, and session history are updated by session completion on backend)
      const updatedProfile = await userService.getProfile();
      setUserProfile(updatedProfile);
      
      // Refresh session history
      const newHistory = await userService.getSessionHistory();
      setSessionHistory(newHistory);

      // Check for milestones after session completion
      if (updatedProfile.notificationPreferences?.milestoneAlerts) {
        setTimeout(() => {
          notificationService.checkMilestones(newHistory, updatedProfile);
        }, 1000);
      }

      // Handle program progress
      if (updatedProfile.activeProgramId) {
        const program = WELLNESS_PROGRAMS.find(p => p.id === updatedProfile.activeProgramId);
        if (program) {
          const newProgress = updatedProfile.programProgress + 1;
          if (newProgress > program.duration) {
            programJustCompleted = true;
            setCompletedProgram(program);
            
            // Mark program as completed
            const finalProfile = await userService.updateProfile({
              activeProgramId: null,
              programProgress: 0,
              completedPrograms: [...(updatedProfile.completedPrograms || []), program.id]
            });
            setUserProfile(finalProfile);
            setView('programComplete');
          } else {
            // Just increment progress
            await userService.completeProgramDay();
            setUserProfile(updatedProfile);
          }
        }
      } else {
        setUserProfile(updatedProfile);
      }
      
      setLastMood('');
      if (!programJustCompleted) {
        setView('dashboard');
      }
    } catch (error) {
      console.error('Failed to complete session:', error);
      // Still navigate away even if save failed
      setView('dashboard');
    }
  }

  const handleProgramCompletionContinue = () => {
    setCompletedProgram(null);
    setView('dashboard');
  };
  
  const handleAddGratitude = async (word: string) => {
    try {
      const newEntry = await userService.addGratitudeEntry({
        word,
        date: new Date().toISOString(),
      });
      setGratitudeEntries(prev => [newEntry, ...prev]);
      await handleAddXp(XP_CONFIG.gratitude, 'gratitude_entry');
    } catch (error) {
      console.error('Failed to save gratitude entry:', error);
    }
  };

  const handleResetProgram = async () => {
    try {
      const updatedProfile = await userService.updateProfile({
        activeProgramId: null,
        programProgress: 0,
      });
      setUserProfile(updatedProfile);
      setView('dashboard');
    } catch (error) {
      console.error('Failed to reset program:', error);
    }
  };

  const handleResetAccount = async () => {
    if (confirm('Are you sure you want to reset your account? This cannot be undone.')) {
      try {
        await authService.logout();
        window.location.reload();
      } catch (error) {
        console.error('Failed to reset account:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUserProfile(null);
      setView('landing');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSaveProfile = async (newProfile: UserProfile) => {
    try {
      const updatedProfile = await userService.updateProfile(newProfile);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  };

  const handleAuthSuccess = (user: UserProfile) => {
    console.log('✅ Login successful, user profile:', user);
    setUserProfile(user);
    setIsAuthenticated(true);
    // Existing users should always have name, goals, etc. Only redirect to setup if profile is incomplete
    const isProfileComplete = user.name && user.name.trim().length > 0 && user.goals && user.goals.length > 0;
    setView(isProfileComplete ? 'dashboard' : 'setup');
    console.log('🏠 Navigating to:', isProfileComplete ? 'dashboard' : 'setup', 'Profile complete:', isProfileComplete);
  };

  const handleSelectPlan = async (tierId: 'stardust' | 'constellation' | 'universe') => {
    // If user is not authenticated, redirect to onboarding
    if (!isAuthenticated) {
      setView('setup');
      return;
    }
    
    try {
      const updatedProfile = await userService.updateProfile({
        subscriptionTier: tierId,
      });
      setUserProfile(updatedProfile);
      setView('dashboard');
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };
  
  const renderContent = () => {
    console.log('📍 Current view:', view, 'isAuthenticated:', isAuthenticated);
    
    // Special pages that don't need authentication or user profile
    if (view === 'audioTest') {
      return <AudioTest />;
    }
    
    // Landing page and auth don't need user profile
    if (view === 'landing') {
      return <LandingPage setView={setView} userProfile={userProfile} />;
    }
    
    if (view === 'breathingIntro') {
      return <BreathingIntro onComplete={(feeling) => {
        setBreathingIntroFeeling(feeling);
        setView('setup');
      }} />;
    }
    
    if (view === 'verification') {
      console.log('✉️ Rendering VerificationScreen for:', pendingVerificationEmail);
      return (
        <VerificationScreen 
          email={pendingVerificationEmail}
          onVerify={async (code) => {
            console.log('🔐 Verifying code:', code);
            const profile = await authService.verifyEmail(pendingVerificationEmail, code);
            if (pendingSetupProfile) {
              console.log('✅ Email verified, completing profile setup');
              await handleEmailVerified(pendingSetupProfile);
            } else {
              console.log('✅ Email verified, logging in');
              setUserProfile(profile);
              setIsAuthenticated(true);
              setView('dashboard');
            }
          }}
          onResend={async () => {
            console.log('🔄 Resending verification email');
            await authService.resendVerificationEmail(pendingVerificationEmail);
          }}
        />
      );
    }
    
    if (view === 'auth') {
      console.log('🔑 Rendering AuthScreen');
      return <AuthScreen onAuthSuccess={handleAuthSuccess} onSignupRedirect={() => setView('setup')} />;
    }
    
    if (view === 'setup') {
      return <Setup onComplete={handleSetupComplete} />;
    }

    // All other views need user profile
    if (!userProfile) return null;

    const sessionCompletedToday = userProfile.subscriptionTier === 'free' &&
        userProfile.lastSessionDate &&
        new Date().toDateString() === new Date(userProfile.lastSessionDate).toDateString();
    
    // Filter out the affirmation step since it's shown on a dedicated screen
    const sessionStepsForPlayer = personalizedSession
      ? {
          ...personalizedSession,
          steps: personalizedSession.steps.filter(step => step.type !== 'affirmation'),
        }
      : null;

    return (
      <>
        {view === 'setupComplete' && <SetupComplete userName={userProfile.name} onContinue={handleSetupConfirmed} />}
        {view === 'dashboard' && <Dashboard userProfile={userProfile} achievements={achievements} sessionHistory={sessionHistory} onShowAffirmation={handleShowAffirmation} programs={WELLNESS_PROGRAMS} sessionCompletedToday={sessionCompletedToday} onNavigate={setView} />}
        {view === 'affirmation' && <Affirmation affirmation={currentAffirmation} userName={userProfile.name} onContinue={handleProceedToSession} />}
        {view === 'session' && sessionStepsForPlayer && <PersonalizedSession session={sessionStepsForPlayer} onComplete={handleSessionComplete} userProfile={userProfile} mood={lastMood} />}
        {view === 'completion' && <PostSessionScreen onAddGratitude={handleAddGratitude} onDone={handleCompletionDone} gratitudeEntries={gratitudeEntries} onSaveReflection={() => {}} />}
        {view === 'programComplete' && completedProgram && <ProgramComplete program={completedProgram} onContinue={handleProgramCompletionContinue} />}
        {view === 'explore' && <Explore programs={WELLNESS_PROGRAMS} onStartProgram={handleStartProgram} onStartActivity={handleStartActivity} onNavigate={setView} userProfile={userProfile} />}
        {view === 'sleepStories' && <SleepStories onClose={() => setView('dashboard')} />}
        {view === 'community' && <Community entries={gratitudeEntries} onClose={() => setView('dashboard')} />}
        {view === 'profile' && <Profile profile={userProfile} onSave={handleSaveProfile} onClose={() => setView('dashboard')} onResetProgram={handleResetProgram} onResetAccount={handleResetAccount} onLogout={handleLogout} />}
        {view === 'universe' && <Universe onNavigate={setView} />}
        {view === 'gamification' && <GamificationDashboard onBack={() => setView('dashboard')} />}
        {view === 'therapists' && <TherapistMatcher userProfile={userProfile} onBack={() => setView('universe')} />}
        {view === 'events' && <WellnessEvents onBack={() => setView('universe')} />}
        {view === 'resources' && <WellnessResources subscriptionTier={userProfile.subscriptionTier} onBack={() => setView('universe')} />}
        {view === 'insights' && <MoodInsights sessionHistory={sessionHistory} gratitudeEntries={gratitudeEntries} streak={userProfile.streak} onBack={() => setView('universe')} />}
        {view === 'trivia' && <TriviaGame onBack={() => setView('universe')} onPointsEarned={(points) => console.log(`Earned ${points} points!`)} subscriptionTier={userProfile.subscriptionTier} />}
        {view === 'pricing' && <Pricing onSelectPlan={handleSelectPlan} currentTier={userProfile.subscriptionTier} />}
      </>
    );
  };

  const showAppChrome = isAuthenticated && !['landing', 'auth', 'verification', 'setup', 'session', 'completion', 'affirmation', 'setupComplete', 'programComplete', 'gamification'].includes(view);
  const showVoiceOrb = ['dashboard'].includes(view);
  const backgroundGradient = 'from-black via-black to-black';

  const handleVoiceStart = () => {
    setIsVoiceListening(true);
    // Voice recognition logic would go here
  };

  const handleVoiceEnd = () => {
    setIsVoiceListening(false);
  };

  const showGlobalHeader = isAuthenticated && !['landing', 'auth', 'verification', 'setup', 'setupComplete', 'session', 'completion', 'affirmation', 'programComplete'].includes(view);

  // Show splash screen during initial load - it stays visible during transition to landing
  const showSplashLayer = !hasCompletedInitialSplash || showSplash;

  // After splash, show loader for authentication/data loading (but not on landing page or breathing intro)
  if ((isLoading || isLoadingData) && view !== 'landing' && view !== 'breathingIntro') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading your experience...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated and not on landing/auth/verification/setup/breathingIntro view
  if (!isAuthenticated && view !== 'landing' && view !== 'auth' && view !== 'verification' && view !== 'setup' && view !== 'breathingIntro') {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={`text-white min-h-screen w-full flex items-center justify-center selection:bg-white selection:text-black bg-gradient-to-br ${backgroundGradient} transition-colors duration-1000`}>
      {!['landing', 'auth', 'verification'].includes(view) && <div className="fixed inset-0 w-full h-full bg-black/10"></div>}
      
      <main className="relative z-10 w-full h-screen flex flex-col">
        {showGlobalHeader && userProfile && <GlobalHeader userProfile={userProfile} onNavigate={setView} />}
        <div className={`flex-grow w-full ${['explore', 'profile', 'universe', 'community', 'insights', 'events', 'resources', 'therapists', 'trivia'].includes(view) ? 'overflow-auto' : 'flex items-center justify-center overflow-hidden'} ${!['landing', 'auth', 'verification'].includes(view) ? 'p-2 sm:p-4' : ''}`}>
          {renderContent()}
        </div>
        {showAppChrome && <Navigation currentView={view} setView={setView} />}
      </main>

      {activeActivity && <ActivityPlayer activity={activeActivity} onClose={handleCloseActivity} />}
      
      {levelUpInfo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm mx-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-pulse">
              <StarIcon className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Level Up!</h3>
            <p className="text-white/70 mt-2 mb-6 text-base sm:text-lg">You've reached Level {levelUpInfo.newLevel}.</p>
            <button
              onClick={() => setLevelUpInfo(null)}
              className="w-full px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {newlyUnlockedAchievement && (
         <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm mx-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4">
               <StarIcon className="w-7 h-7 sm:w-9 sm:h-9" />
             </div>
             <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/80">Achievement Unlocked</p>
             <h3 className="text-lg sm:text-xl font-semibold text-white mt-2">{newlyUnlockedAchievement.title}</h3>
             <p className="text-sm sm:text-base text-white/70 mt-2 mb-6">{newlyUnlockedAchievement.description}</p>
             <button
               onClick={() => setNewlyUnlockedAchievement(null)}
               className="w-full px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition"
             >
               Continue
             </button>
           </div>
         </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
        }
        @keyframes gentle-pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        .animate-gentle-pulse {
          animation: gentle-pulse 4s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.15); }
        }
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-orb-breathe {
          animation: orb-breathe 3s ease-in-out infinite;
        }
        @keyframes particle-float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .animate-particle-float {
          animation: particle-float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
