
export interface WellnessProgram {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  dailyThemes: string[];
}

export interface UserProfile {
  name: string;
  email?: string; // Collected during onboarding
  sessionLength: 'short' | 'medium' | 'long';
  goals: string[];
  checkInTimes: ('morning' | 'afternoon' | 'evening')[];
  lifestyle: 'sedentary' | 'active' | 'balanced';
  activeProgramId: string | null;
  programProgress: number; // current day, 1-indexed
  completedPrograms: string[];
  subscriptionTier: 'stardust' | 'constellation' | 'universe';
  lastSessionDate: string | null;
  streak: number;
  xp: number;
  level: number;
  supportPreferences?: string[];
  experienceLevel?: string;
  location?: {
    city?: string;
    state?: string;
    zipCode?: string;
  };
  notificationPreferences?: {
    enabled: boolean;
    checkInReminders: boolean;
    streakProtection: boolean;
    milestoneAlerts: boolean;
    challengeUpdates: boolean;
    therapistQA: boolean;
    calendarSync: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  };
  wakeTime?: string; // Time user typically wakes up (HH:MM format)
  sleepTime?: string; // Time user typically goes to sleep (HH:MM format)
  morningWellnessEnabled?: boolean; // Whether to send morning wellness notifications
  joinedChallenges?: string[];
  supportGroups?: string[];
  
  // Enhanced Personalization (Aura-inspired)
  ageRange?: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  lifeStage?: 'student' | 'early-career' | 'parent' | 'caregiver' | 'retired' | 'other';
  preferredTime?: 'morning' | 'afternoon' | 'evening' | 'late-night';
  sessionLengthPreference?: '3-5' | '10-15' | '20-30' | '30+';
  voicePreference?: 'male' | 'female' | 'non-binary' | 'no-preference';
  triggers?: string[];
  copingStrategies?: string[];
  avoidTopics?: string[];
  weeklySessionsUsed?: number; // Track free tier usage
  lastResetDate?: string; // For weekly free session reset
}

export interface SessionHistoryEntry {
  date: string;
  mood: string;
  reflection: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
}

export interface GratitudeEntry {
  word: string;
  date: string;
}

export interface SleepStoryData {
  title: string;
  story: string;
}

export interface MeditationItem {
  title: string;
  script: string;
  durationMinutes: number;
}

export interface SoundscapeItem {
  title: string;
  description: string;
}

export interface BreathworkItem {
  title: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    /** Optional duration for holding breath after exhaling, in seconds. Used for patterns like Box Breathing. */
    holdAfterExhale?: number;
  };
}

export type SessionStep = 
  | { type: 'affirmation', data: { text: string } }
  | { type: 'breathwork', data: BreathworkItem }
  | { type: 'meditation', data: MeditationItem };

export interface PersonalizedSessionData {
  soundscape: SoundscapeItem;
  steps: SessionStep[];
}


export type ActivityType = 'breathwork' | 'soundscape' | 'subliminal' | 'affirmation' | 'sleep-story';

export interface SubliminalItem {
  title: string;
  description: string;
  affirmations: string[];
  frequency: string; // e.g., "432 Hz", "528 Hz"
  durationMinutes: number;
  category: 'confidence' | 'abundance' | 'healing' | 'sleep' | 'focus';
}

export interface AffirmationItem {
  text: string;
  author?: string;
  category?: 'self-esteem' | 'sleep' | 'focus' | 'gratitude' | 'motivation';
}

export type SleepStoryItem = SleepStoryData;

export type Activity =
  | { type: 'meditation'; data: MeditationItem }
  | { type: 'breathwork'; data: BreathworkItem }
  | { type: 'soundscape'; data: SoundscapeItem }
  | { type: 'subliminal'; data: SubliminalItem }
  | { type: 'affirmation'; data: AffirmationItem }
  | { type: 'sleep-story'; data: SleepStoryItem };


// AppView types - simplified and consolidated
export type AppView = 'landing' | 'dashboard' | 'explore' | 'community' | 'profile' | 'universe' | 'breathingIntro' | 'setup' | 'completion' | 'affirmation' | 'setupComplete' | 'programComplete' | 'pricing' | 'auth' | 'verification' | 'sleepStories' | 'gamification' | 'therapists' | 'events' | 'resources' | 'insights' | 'session' | 'audioTest' | 'trivia' | 'journal';

export interface ChatMessage {
  author: 'user' | 'kaya';
  text: string;
}

export interface ChatResponse {
  text: string;
  isFinal: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  approach: string[];
  languages: string[];
  availability: 'accepting' | 'waitlist' | 'full';
  acceptsInsurance: boolean;
  virtualSessions: boolean;
  inPersonSessions: boolean;
  location?: {
    city: string;
    state: string;
    distance?: number; // in miles
  };
  bio: string;
  experience: number; // years
  rating: number;
  reviewCount: number;
  matchScore?: number; // 0-100
}

export interface WellnessEvent {
  id: string;
  title: string;
  category: 'workshop' | 'breathwork' | 'yoga' | 'support-group' | 'retreat' | 'webinar' | 'fitness';
  description: string;
  date: string;
  time: string;
  duration: number; // minutes
  location: {
    type: 'virtual' | 'in-person' | 'hybrid';
    venue?: string;
    address?: string;
    city?: string;
    state?: string;
    distance?: number; // in miles
    meetingLink?: string;
  };
  cost: number; // 0 for free
  organizer: string;
  capacity?: number;
  spotsRemaining?: number;
  tags: string[];
  imageUrl?: string;
}

export interface WellnessResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'podcast' | 'tool' | 'crisis-support';
  category: string;
  description: string;
  content?: string;
  url?: string;
  duration?: number; // minutes for videos/podcasts
  isPremium: boolean;
  tags: string[];
}

export interface MoodInsight {
  date: string;
  mood: string;
  triggers?: string[];
  activities: string[];
  reflection?: string;
}

export interface SubscriptionFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface SubscriptionTier {
  id: 'stardust' | 'constellation' | 'universe';
  displayName: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: SubscriptionFeature[];
  popular?: boolean;
  badge?: string;
}