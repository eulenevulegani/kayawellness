# KAYA Quick Implementation Guide

## 🚀 How to Apply Brand Refinements

This is a practical guide for developers implementing KAYA's refined brand voice and design system.

---

## 1. Import Brand Constants

Always import from the constants file for consistency:

```tsx
import { 
  FEATURE_DISPLAY_NAMES,
  CTA_COPY,
  EMPTY_STATES,
  LOADING_MESSAGES,
  COSMIC_GOALS,
  SESSION_TYPES,
  TIME_GREETINGS,
  STREAK_MILESTONES
} from './constants';
```

---

## 2. Using Feature Names

### In Navigation & Headers

```tsx
// ❌ DON'T hardcode display names
<h1>Dashboard</h1>
<button>Go to Profile</button>

// ✅ DO use constants
<h1>{FEATURE_DISPLAY_NAMES.stellarHome}</h1>
<button onClick={() => navigate('stellarAtlas')}>
  {FEATURE_DISPLAY_NAMES.stellarAtlas}
</button>
```

### In Routing

```tsx
// AppView types are technical (for routing)
type AppView = 'stellarHome' | 'cosmicLibrary' | 'reflectionChamber' ...

// But display them using constants
const getDisplayName = (view: AppView) => {
  return FEATURE_DISPLAY_NAMES[view] || view;
}
```

---

## 3. Button Text Patterns

### Primary CTAs

```tsx
// ❌ Generic
<button>Get Started</button>
<button>Continue</button>
<button>Submit</button>

// ✅ Cosmic Voice
<button>{CTA_COPY.getStarted}</button> // "Begin Your Journey"
<button>{CTA_COPY.continue}</button>    // "Journey Onward"
<button>{CTA_COPY.complete}</button>    // "Seal This Chapter"
```

### Context-Specific

```tsx
// Starting a session
<button>{CTA_COPY.startSession}</button> // "Enter Mindspace"

// Saving journal entry
<button>{CTA_COPY.save}</button> // "Preserve This Moment"

// Sharing to community
<button>{CTA_COPY.share}</button> // "Add to Constellation"
```

---

## 4. Empty State Messages

```tsx
// ❌ Boring/Negative
{journalEntries.length === 0 && (
  <p>No journal entries yet. Start writing!</p>
)}

// ✅ Hopeful/Cosmic
{journalEntries.length === 0 && (
  <div className="text-center text-white/70 py-8">
    <p>{EMPTY_STATES.noJournal}</p>
  </div>
)}
```

### Full Empty State Pattern

```tsx
{items.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
      <StarIcon className="w-8 h-8 text-white/60" />
    </div>
    <p className="text-white/70 max-w-sm leading-relaxed">
      {EMPTY_STATES.noSessions}
    </p>
    <button 
      onClick={onStartSession}
      className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transition"
    >
      {CTA_COPY.getStarted}
    </button>
  </div>
) : (
  // Show items...
)}
```

---

## 5. Loading States

```tsx
// ❌ Static
{loading && <p>Loading...</p>}

// ✅ Dynamic & Varied
{loading && (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="w-12 h-12 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
    <p className="text-white/70 text-sm">
      {LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]}
    </p>
  </div>
)}
```

---

## 6. Time-Based Greetings

```tsx
import { TIME_GREETINGS } from './constants';

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'midday';
  if (hour < 21) return 'evening';
  return 'night';
};

// In component
const timeOfDay = getTimeOfDay();
const greeting = TIME_GREETINGS[timeOfDay];

return (
  <div>
    <h2 className="text-3xl font-light text-white">{greeting.title}</h2>
    <p className="text-white/70">{greeting.subtitle}</p>
  </div>
);
```

---

## 7. Streak Milestones

```tsx
import { STREAK_MILESTONES } from './constants';

// When user reaches streak milestone
useEffect(() => {
  const milestone = STREAK_MILESTONES[userProfile.streak];
  if (milestone) {
    showNotification({
      title: '✨ Celestial Milestone',
      message: milestone.message,
      bonus: milestone.bonus
    });
  }
}, [userProfile.streak]);
```

---

## 8. Design System Classes

### Button Styles

```tsx
// Primary CTA
className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transform hover:scale-105 active:scale-95 transition shadow-lg shadow-cyan-500/30"

// Secondary Button
className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium hover:bg-white/20 hover:border-white/30 transform hover:scale-105 transition"

// Ghost/Tertiary
className="px-4 py-2 text-white/80 hover:text-white transition"
```

### Card Styles

```tsx
// Standard Card
className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"

// Interactive Card (clickable)
className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"

// Selected/Active Card
className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400 rounded-2xl p-6 shadow-lg shadow-cyan-500/20"

// Accent Card (for important info)
className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 rounded-2xl p-6"
```

### Typography

```tsx
// Page Title
className="text-3xl md:text-5xl font-light text-white tracking-wide mb-4"

// Section Heading
className="text-2xl md:text-3xl font-light text-white mb-3"

// Card Title
className="text-xl font-semibold text-white mb-2"

// Body Text
className="text-base text-white/90 leading-relaxed"

// Small Text / Metadata
className="text-sm text-white/70"

// Caption / Hint
className="text-xs text-white/60"
```

---

## 9. Animation Classes

Add these to your component or global styles:

```tsx
<style>{`
  @keyframes gentle-pulse {
    0%, 100% { opacity: 0.85; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
  }
  .animate-gentle-pulse {
    animation: gentle-pulse 4s ease-in-out infinite;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.7s ease-out forwards;
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
```

Usage:
```tsx
// Pulsing orb
<div className="w-16 h-16 bg-cyan-400/20 rounded-full animate-gentle-pulse" />

// Fading in content
<div className="animate-fade-in">
  {/* content */}
</div>

// Floating particles
<div className="absolute w-2 h-2 bg-white/40 rounded-full animate-particle-float" />
```

---

## 10. Notification Templates

```tsx
import { NOTIFICATION_TEMPLATES } from './constants';

// Morning reminder
const morningNotif = {
  title: '☀️ Good Morning',
  body: NOTIFICATION_TEMPLATES.morningReminder,
  // "Your universe awaits. Begin your day with intention."
};

// Streak protection
const streakNotif = {
  title: '🔥 Protect Your Celestial Streak',
  body: NOTIFICATION_TEMPLATES.streakProtection,
  // "Your celestial streak needs attention..."
};

// Achievement
const achievementNotif = {
  title: '✨ Cosmic Milestone',
  body: NOTIFICATION_TEMPLATES.milestone.replace('{achievement}', achievement.title),
};
```

---

## 11. Goal Selection (Setup Flow)

```tsx
import { COSMIC_GOALS } from './constants';

// In your setup component
<div className="flex flex-wrap gap-3">
  {COSMIC_GOALS.map((goal) => (
    <button
      key={goal.id}
      onClick={() => toggleGoal(goal.id)}
      className={`px-5 py-3 rounded-2xl transition transform hover:scale-105 ${
        selectedGoals.includes(goal.id)
          ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 shadow-lg'
          : 'bg-white/10 text-white border border-white/20'
      }`}
    >
      <div className="flex flex-col">
        <span className="font-semibold">{goal.label}</span>
        <span className="text-xs opacity-80">{goal.subtitle}</span>
      </div>
    </button>
  ))}
</div>
```

---

## 12. Session Type Badges

```tsx
import { SESSION_TYPES } from './constants';

// Display session type with icon and color
const SessionBadge = ({ type }) => {
  const session = SESSION_TYPES[type];
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 bg-${session.color}-500/20 text-${session.color}-300 rounded-full text-sm`}>
      <span>{session.icon}</span>
      <span>{session.label}</span>
    </span>
  );
};

// Usage
<SessionBadge type="meditation" />
// Renders: 🌑 Nebula Meditation
```

---

## 13. Error Messages (Cosmic Voice)

```tsx
// ❌ Generic
"An error occurred. Please try again."
"Connection failed"
"Invalid input"

// ✅ Cosmic Voice
"The cosmic connection wavered. Let's try again."
"Your universe paused briefly—reconnecting now..."
"That path isn't quite aligned. Try another way."
```

---

## 14. Success Messages

```tsx
// ❌ Generic  
"Saved successfully"
"Profile updated"
"Session completed"

// ✅ Cosmic Voice
"Preserved in your cosmic archive ✨"
"Your stellar atlas has been updated"
"Another star added to your universe 🌟"
```

---

## 15. Full Component Example

Here's a complete example applying all principles:

```tsx
import React from 'react';
import { FEATURE_DISPLAY_NAMES, CTA_COPY, EMPTY_STATES } from './constants';
import { StarIcon } from './Icons';

const StellarHome: React.FC<{ sessions, onStartSession }> = ({ 
  sessions, 
  onStartSession 
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-light text-white tracking-wide mb-2">
          {FEATURE_DISPLAY_NAMES.stellarHome}
        </h1>
        <p className="text-white/70 leading-relaxed">
          Your personal space in the cosmos
        </p>
      </header>

      {/* Content */}
      {sessions.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full flex items-center justify-center mb-6 animate-gentle-pulse">
            <StarIcon className="w-10 h-10 text-cyan-400" />
          </div>
          <p className="text-white/70 max-w-md leading-relaxed mb-6">
            {EMPTY_STATES.noSessions}
          </p>
          <button 
            onClick={onStartSession}
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transform hover:scale-105 active:scale-95 transition shadow-lg shadow-cyan-500/30"
          >
            {CTA_COPY.startSession}
          </button>
        </div>
      ) : (
        // Sessions Grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <div 
              key={session.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.02] cursor-pointer"
              onClick={() => onStartSession(session)}
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {session.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {session.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StellarHome;
```

---

## 16. Testing Your Implementation

### Brand Voice Checklist

When you write any user-facing text, ask:
- [ ] Does it connect cosmic wonder with personal wellness?
- [ ] Is it warm and inviting without being pushy?
- [ ] Would it feel meaningful at 3am?
- [ ] Does it make users feel capable, not inadequate?
- [ ] Is every word necessary?
- [ ] Does it avoid medical claims or guilt-inducing language?

### Visual Checklist

For any new component:
- [ ] Uses brand colors (cyan/teal gradient for primary actions)
- [ ] Has appropriate rounded corners (2xl for cards, full for buttons)
- [ ] Includes hover states with scale transform
- [ ] Has proper backdrop-blur on cards
- [ ] Uses consistent spacing (gap-6, p-6, mb-6)
- [ ] Typography follows light/thin weight pattern
- [ ] Animations are smooth (300ms transitions)

---

## 17. Common Patterns Reference

### Modal/Dialog
```tsx
<div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
  <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
    <h3 className="text-2xl font-light text-white mb-4">Modal Title</h3>
    <p className="text-white/80 leading-relaxed mb-6">Content here</p>
    <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold">
      {CTA_COPY.continue}
    </button>
  </div>
</div>
```

### Achievement Unlock
```tsx
<div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 rounded-2xl p-6 text-center">
  <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-pulse">
    <StarIcon className="w-8 h-8 text-cyan-400" />
  </div>
  <p className="text-sm uppercase tracking-wider text-cyan-300 mb-2">
    Cosmic Milestone
  </p>
  <h3 className="text-xl font-semibold text-white mb-2">
    {achievement.title}
  </h3>
  <p className="text-white/70 text-sm">
    {achievement.description}
  </p>
</div>
```

---

## Need Help?

1. Check `BRAND_STRATEGY.md` for comprehensive guidelines
2. Review `constants.ts` for approved copy
3. Reference `DESIGN_SYSTEM.md` for visual patterns
4. Look at `Setup.tsx` for implementation examples

**Remember:** When in doubt, ask "Does this belong in someone's personal universe?"

