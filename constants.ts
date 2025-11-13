// KAYA Brand Constants & Display Names

/**
 * Display names for features - Maps technical route names to brand-aligned display names
 * Use these consistently across all UI components
 */
export const FEATURE_DISPLAY_NAMES = {
  // Core Personal Features (Tier 1)
  stellarHome: 'Stellar Home',
  mindspace: 'Mindspace',
  reflectionChamber: 'Reflection Chamber',
  stellarAtlas: 'Stellar Atlas',
  
  // Discovery Features (Tier 2)
  cosmicLibrary: 'Cosmic Library',
  pathways: 'Pathways',
  nebulaSessions: 'Nebula Sessions',
  stellarStories: 'Stellar Stories',
  frequencyWaves: 'Frequency Waves',
  
  // Connection Features (Tier 3)
  constellation: 'Constellation',
  guidingStars: 'Guiding Stars',
  eventHorizon: 'Event Horizon',
  galaxyArchive: 'Galaxy Archive',
  orbitInsights: 'Orbit Insights',
  
  // Progress Features (Tier 4)
  stellarSystem: 'Stellar System',
  cosmicMilestones: 'Cosmic Milestones',
  stardust: 'Stardust',
  luminosity: 'Luminosity',
  celestialStreak: 'Celestial Streak',
} as const;

/**
 * Navigation items with cosmic-themed icons and descriptions
 */
export const NAVIGATION_ITEMS = [
  {
    id: 'stellarHome',
    label: FEATURE_DISPLAY_NAMES.stellarHome,
    icon: '🏠',
    description: 'Your personal space in the cosmos',
  },
  {
    id: 'cosmicLibrary',
    label: FEATURE_DISPLAY_NAMES.cosmicLibrary,
    icon: '🌌',
    description: 'Explore wellness pathways',
  },
  {
    id: 'reflectionChamber',
    label: FEATURE_DISPLAY_NAMES.reflectionChamber,
    icon: '✨',
    description: 'Journal your journey',
  },
  {
    id: 'constellation',
    label: FEATURE_DISPLAY_NAMES.constellation,
    icon: '⭐',
    description: 'Connect with others',
  },
  {
    id: 'stellarAtlas',
    label: FEATURE_DISPLAY_NAMES.stellarAtlas,
    icon: '🪐',
    description: 'Your cosmic profile',
  },
] as const;

/**
 * Wellness goals with cosmic-aligned naming
 */
export const COSMIC_GOALS = [
  { id: 'stress', label: 'Navigate to Serenity', original: 'Manage Stress' },
  { id: 'sleep', label: 'Journey to Restful Realms', original: 'Improve Sleep' },
  { id: 'grounded', label: 'Find Your Center', original: 'Be Grounded' },
  { id: 'gratitude', label: 'Cultivate Cosmic Gratitude', original: 'Practice Gratitude' },
  { id: 'anxiety', label: 'Calm the Cosmic Storm', original: 'Manage Anxiety' },
  { id: 'focus', label: 'Sharpen Your Stellar Focus', original: 'Increase Focus' },
  { id: 'resilience', label: 'Strengthen Your Stellar Core', original: 'Build Resilience' },
  { id: 'balance', label: 'Harmonize Your Orbit', original: 'Work-Life Balance' },
  { id: 'self-love', label: 'Radiate Inner Light', original: 'Self-Love' },
] as const;

/**
 * Session types with cosmic naming
 */
export const SESSION_TYPES = {
  meditation: { label: 'Nebula Meditation', icon: '🌑', color: 'cyan' },
  breathwork: { label: 'Cosmic Breath', icon: '💫', color: 'teal' },
  soundscape: { label: 'Frequency Waves', icon: '🎵', color: 'purple' },
  sleep: { label: 'Stellar Stories', icon: '🌙', color: 'indigo' },
} as const;

/**
 * Microcopy for CTAs - Brand-aligned button text
 */
export const CTA_COPY = {
  getStarted: 'Begin Your Journey',
  startSession: 'Enter Mindspace',
  continue: 'Journey Onward',
  skip: 'Explore Later',
  save: 'Preserve This Moment',
  complete: 'Seal This Chapter',
  share: 'Add to Constellation',
  upgrade: 'Expand Your Universe',
  back: 'Return',
  next: 'Continue Forward',
  finish: 'Complete Journey',
  explore: 'Explore Cosmos',
} as const;

/**
 * Empty state messages - Cosmic voice
 */
export const EMPTY_STATES = {
  noJournal: 'Your Reflection Chamber awaits. Pour your thoughts into the cosmos.',
  noSessions: 'The stars are aligned. Ready to begin?',
  noCommunity: 'Be the first star to shine in this constellation.',
  noAchievements: 'Your first cosmic milestone awaits on the horizon.',
  noHistory: 'Your stellar journey begins with a single breath.',
} as const;

/**
 * Loading messages - Varied and cosmic
 */
export const LOADING_MESSAGES = [
  'Preparing your mindspace...',
  'Aligning the stars...',
  'Gathering cosmic energy...',
  'Tuning into your frequency...',
  'Illuminating your path...',
  'Awakening the universe...',
] as const;

/**
 * Time of day greetings - Cosmic themed
 */
export const TIME_GREETINGS = {
  morning: {
    title: '☀️ Your universe awakens',
    subtitle: 'Begin your day with intention',
  },
  midday: {
    title: '🌤️ The cosmos calls',
    subtitle: 'Find your center in this moment',
  },
  evening: {
    title: '🌙 As stars emerge',
    subtitle: 'Transition into peaceful rest',
  },
  night: {
    title: '✨ The night sky embraces you',
    subtitle: 'Release the day, embrace tranquility',
  },
} as const;

/**
 * Streak milestones - Celestial cycle language
 */
export const STREAK_MILESTONES = {
  3: { message: 'Three celestial cycles. Momentum is building.', bonus: 50 },
  7: { message: 'Seven celestial cycles of dedication. Your constellation grows.', bonus: 100 },
  14: { message: 'A fortnight of practice. The universe takes notice.', bonus: 200 },
  30: { message: 'A full lunar cycle of practice. This is transformation.', bonus: 500 },
  60: { message: 'Two moons of dedication. Your light inspires others.', bonus: 1000 },
  100: { message: 'A hundred stars in your sky. You embody wellness.', bonus: 2000 },
} as const;

/**
 * Achievement categories - Cosmic themed
 */
export const ACHIEVEMENT_CATEGORIES = {
  practice: { label: 'Practice Mastery', icon: '🧘', color: 'cyan' },
  streak: { label: 'Celestial Consistency', icon: '🔥', color: 'orange' },
  community: { label: 'Constellation Builder', icon: '⭐', color: 'yellow' },
  growth: { label: 'Inner Universe Expansion', icon: '🌱', color: 'green' },
  exploration: { label: 'Cosmic Explorer', icon: '🚀', color: 'purple' },
} as const;

/**
 * Notification templates - KAYA voice
 */
export const NOTIFICATION_TEMPLATES = {
  morningReminder: 'Your universe awaits. Begin your day with intention.',
  checkInReminder: 'How does your inner world feel today?',
  streakProtection: 'Your celestial streak needs attention. A few minutes can preserve your momentum.',
  milestone: 'Cosmic Milestone unlocked: {achievement}',
  newPathway: 'A new pathway has opened in your universe: {pathway}',
  weeklyInsight: 'Your weekly cosmic insight is ready to illuminate your journey.',
} as const;
