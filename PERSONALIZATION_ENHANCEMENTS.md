# Personalization Enhancements

## Overview
Enhanced the session generation system to create truly personalized wellness experiences based on user profile data, experience level, goals, and current mood.

## Key Improvements

### 1. AI Prompt Enhancement (`services/geminiService.ts`)

#### User Profile Integration
The `generatePersonalizedSession` function now incorporates comprehensive user data:

- **Demographics**: Age range and life stage for contextually relevant content
- **Experience Level**: Adjusts guidance depth (beginner, intermediate, advanced)
- **Goals**: Primary wellness objectives influence all session components
- **Session Length Preference**: Respects user's time availability
- **Preferred Practice Time**: Morning, afternoon, evening, or late-night context

#### Breathing Exercise Personalization
Breathing patterns now adapt to user experience and goals:

**Beginners:**
- Gentle equal breathing (4-4) or simple box breathing (4-4-4-4)
- Clear, reassuring instructions
- No breath holding to avoid stress

**Intermediate:**
- 4-7-8 breathing for anxiety/sleep goals (activates parasympathetic response)
- Box breathing (4-4-4-4) for focus/productivity
- Resonant breathing (5-5 or 6-6) for balanced regulation

**Advanced:**
- Alternate nostril breathing
- Extended exhale patterns (4-2-6-2)
- Self-directed practice with minimal guidance

#### Soundscape Personalization
AI receives guidance to suggest soundscapes based on:

- **Sleep Goals/Tired Mood**: Gentle rain, soft ocean waves, distant thunder
- **Focus Goals**: Forest ambience, flowing stream, white noise
- **Anxiety/Stress**: Soft rain, crackling fireplace, cosmic drones
- **General Wellbeing**: Uplifting sounds like morning birds, wind chimes, cosmic harmony

### 2. Enhanced Fallback Sessions

When AI generation fails, the system now provides intelligent fallback sessions:

#### Personalized Fallback Affirmations
Tailored to user's primary goal:
- **Stress**: "You might notice that with each breath, you're allowing stress to soften. You're doing beautifully."
- **Sleep**: "Rest is a gift you give yourself. You deserve peaceful, restorative sleep."
- **Anxiety**: "You might notice that this moment is safe. You're exactly where you need to be."
- **Focus**: "Your mind is capable and clear. You can gently return to this moment whenever you choose."

#### Adaptive Breathing Patterns
- Beginners: 4-4 equal breathing (no hold)
- Intermediate: 4-4-4-4 box breathing
- Advanced: 4-7-8 calming breath

#### Goal-Based Soundscapes
- Sleep goals → Ocean waves
- Focus goals → Forest stream
- Default → Gentle rain

### 3. Intelligent Soundscape Selection (`components/PersonalizedSession.tsx`)

Enhanced `getSoundscapeUrl` function with three-tier priority system:

#### Priority 1: AI Title Keywords
AI already chose soundscape based on context, respect that choice:
- Rain, Forest, Cosmic, Ocean keywords

#### Priority 2: User Profile + Mood Analysis
When title doesn't specify, use intelligent fallback:

```typescript
// Sleep-related → Ocean waves
if (goals.includes('sleep') || mood.includes('tired'))

// Anxiety/stress → Rain
if (goals.includes('anxiety') || mood.includes('anxious'))

// Focus/productivity → Forest
if (goals.includes('focus') || mood.includes('distracted'))

// Happy/peaceful → Cosmic
if (mood.includes('happy') || mood.includes('calm'))
```

#### Priority 3: Ambient Fallback
Gentle ambient sounds as last resort

### 4. Props Enhancement

Added `mood` prop to `PersonalizedSession` component:
- Passed from `App.tsx` using `lastMood` state
- Available to soundscape selection algorithm
- Enables real-time mood-based personalization

## Technical Implementation

### Files Modified

1. **services/geminiService.ts** (Lines 121-250)
   - Added profile context extraction (age, life stage, time preference)
   - Implemented breathing exercise guidance logic
   - Created soundscape guidance based on goals/mood
   - Enhanced prompt with comprehensive user context
   - Personalized fallback sessions

2. **components/PersonalizedSession.tsx**
   - Added `mood` to interface props
   - Enhanced `getSoundscapeUrl` with profile/mood parameters
   - Implemented three-tier soundscape selection algorithm
   - Updated `IntegratedSoundscapePlayer` to receive profile/mood
   - Connected all components with personalization data

3. **App.tsx**
   - Updated `PersonalizedSession` component call to pass `mood={lastMood}`

## User Experience Impact

### Before
- Generic sessions with basic mood consideration
- One-size-fits-all breathing exercises (mostly 4-7-8)
- Soundscape selection based only on title keywords
- Limited use of profile data

### After
- Deeply personalized sessions using goals, experience, demographics
- Varied breathing exercises matched to user capability and needs
- Intelligent soundscape selection with mood + goal awareness
- Affirmations directly address user's stated objectives
- Experience level determines guidance depth and pacing

## Example Personalization Scenarios

### Scenario 1: Beginner with Sleep Goals
**Profile**: Beginner, Age 25-34, Goals: Better sleep
**Mood**: Tired

**Session Generated**:
- Affirmation: "Rest is a gift you give yourself. You deserve peaceful, restorative sleep."
- Breathing: Gentle 4-4 equal breathing (no hold)
- Soundscape: Ocean waves (soothing for sleep)
- Meditation: Detailed, gentle guidance with sleep-focused script

### Scenario 2: Advanced Practitioner with Focus Goals
**Profile**: Advanced, Age 35-44, Goals: Focus, productivity
**Mood**: Distracted

**Session Generated**:
- Affirmation: "Your mind is capable and clear. You can gently return to this moment whenever you choose."
- Breathing: Box breathing 4-4-4-4 (mental clarity)
- Soundscape: Forest stream (focus enhancement)
- Meditation: Minimal guidance, self-directed practice

### Scenario 3: Intermediate with Anxiety Goals
**Profile**: Intermediate, Age 45-54, Goals: Reduce anxiety
**Mood**: Anxious

**Session Generated**:
- Affirmation: "You might notice that this moment is safe. You're exactly where you need to be."
- Breathing: 4-7-8 breath (activates parasympathetic response)
- Soundscape: Soft rain (calming for anxiety)
- Meditation: Moderate guidance with anxiety-focused techniques

## Testing Recommendations

1. **Profile Variation Testing**
   - Test with different experience levels
   - Verify breathing patterns adapt correctly
   - Confirm affirmations match stated goals

2. **Mood Integration Testing**
   - Test same profile with different moods
   - Verify soundscape selection changes appropriately
   - Ensure mood context influences meditation script

3. **Fallback Testing**
   - Simulate AI generation failure
   - Verify fallback sessions are personalized
   - Confirm no generic content appears

4. **Edge Cases**
   - User with no goals specified
   - Multiple overlapping goals
   - Mood keywords not in mapping

## Future Enhancement Opportunities

1. **Voice Preference Integration**
   - Currently collected but not used
   - Implement different voice options for text-to-speech

2. **Time of Day Awareness**
   - Use wakeTime/sleepTime for contextual sessions
   - Morning sessions: Energizing affirmations
   - Evening sessions: Calming, sleep-prep content

3. **Progressive Difficulty**
   - Track user progress and gradually increase technique complexity
   - Suggest leveling up from beginner to intermediate

4. **Session Length Enforcement**
   - Strictly honor sessionLengthPreference in meditation duration
   - Adjust script length dynamically

5. **Learning from Feedback**
   - Track which sessions users complete vs abandon
   - Adjust personalization based on completion patterns

## Conclusion

The personalization system now leverages the full user profile to create meaningful, tailored wellness experiences. Each component (affirmation, breathing, soundscape, meditation) adapts to user goals, experience level, and current emotional state. This transformation moves KAYA from generic guided sessions to truly personalized wellness coaching.
