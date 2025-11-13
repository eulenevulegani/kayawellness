/**
 * Personalization 2.0 Service
 * Advanced AI-driven personalization with time-of-day optimization, context awareness,
 * mood prediction, and adaptive duration learning
 */

import { UserProfile, SessionHistoryEntry, Activity } from '../types';
import { CalendarEvent, notificationService } from './notificationService';

export interface PersonalizationInsights {
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  preferredSessionLength: number; // in minutes
  stressPrediction: {
    dayOfWeek: string[];
    likelyMood: string;
    confidence: number;
  };
  recommendedActivities: Activity[];
  contextAwareSuggestion?: {
    context: string;
    activity: string;
    reason: string;
  };
}

export interface MoodPattern {
  dayOfWeek: string;
  timeOfDay: string;
  mood: string;
  count: number;
}

export interface UsagePattern {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionCount: number;
  averageDuration: number;
  completionRate: number;
}

class PersonalizationService {
  private readonly MORNING_HOURS = [6, 7, 8, 9, 10, 11];
  private readonly AFTERNOON_HOURS = [12, 13, 14, 15, 16, 17];
  private readonly EVENING_HOURS = [18, 19, 20, 21];
  private readonly NIGHT_HOURS = [22, 23, 0, 1, 2, 3, 4, 5];

  /**
   * Get current time of day
   */
  getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (this.MORNING_HOURS.includes(hour)) return 'morning';
    if (this.AFTERNOON_HOURS.includes(hour)) return 'afternoon';
    if (this.EVENING_HOURS.includes(hour)) return 'evening';
    return 'night';
  }

  /**
   * Analyze usage patterns from session history
   */
  analyzeUsagePatterns(sessionHistory: SessionHistoryEntry[]): UsagePattern[] {
    const patterns: Map<string, { count: number; totalDuration: number; completed: number }> = new Map();

    sessionHistory.forEach((session) => {
      const date = new Date(session.date);
      const hour = date.getHours();
      let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';

      if (this.MORNING_HOURS.includes(hour)) timeOfDay = 'morning';
      else if (this.AFTERNOON_HOURS.includes(hour)) timeOfDay = 'afternoon';
      else if (this.EVENING_HOURS.includes(hour)) timeOfDay = 'evening';
      else timeOfDay = 'night';

      const key = timeOfDay;
      const existing = patterns.get(key) || { count: 0, totalDuration: 0, completed: 0 };

      patterns.set(key, {
        count: existing.count + 1,
        totalDuration: existing.totalDuration + 15, // Assume average 15 min
        completed: existing.completed + 1
      });
    });

    return Array.from(patterns.entries()).map(([timeOfDay, data]) => ({
      timeOfDay: timeOfDay as 'morning' | 'afternoon' | 'evening' | 'night',
      sessionCount: data.count,
      averageDuration: data.count > 0 ? data.totalDuration / data.count : 0,
      completionRate: data.count > 0 ? data.completed / data.count : 0
    }));
  }

  /**
   * Analyze mood patterns by day of week
   */
  analyzeMoodPatterns(sessionHistory: SessionHistoryEntry[]): MoodPattern[] {
    const patterns: Map<string, Map<string, number>> = new Map();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Ensure sessionHistory is an array
    if (!Array.isArray(sessionHistory)) {
      return [];
    }

    sessionHistory.forEach((session) => {
      const date = new Date(session.date);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const mood = session.mood.toLowerCase();

      if (!patterns.has(dayOfWeek)) {
        patterns.set(dayOfWeek, new Map());
      }

      const dayPatterns = patterns.get(dayOfWeek)!;
      dayPatterns.set(mood, (dayPatterns.get(mood) || 0) + 1);
    });

    const result: MoodPattern[] = [];
    patterns.forEach((moodCounts, dayOfWeek) => {
      moodCounts.forEach((count, mood) => {
        result.push({
          dayOfWeek,
          timeOfDay: 'any',
          mood,
          count
        });
      });
    });

    return result.sort((a, b) => b.count - a.count);
  }

  /**
   * Predict mood based on current day and historical patterns
   */
  predictMood(sessionHistory: SessionHistoryEntry[]): { mood: string; confidence: number; dayOfWeek: string } {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = daysOfWeek[new Date().getDay()];
    
    // Ensure sessionHistory is an array
    if (!Array.isArray(sessionHistory)) {
      return { mood: 'neutral', confidence: 0.3, dayOfWeek: today };
    }
    
    const moodPatterns = this.analyzeMoodPatterns(sessionHistory);
    const todayPatterns = moodPatterns.filter((p) => p.dayOfWeek === today);

    if (todayPatterns.length === 0) {
      return { mood: 'neutral', confidence: 0.3, dayOfWeek: today };
    }

    // Find most common mood for today
    const topMood = todayPatterns.reduce((prev, current) =>
      current.count > prev.count ? current : prev
    );

    const totalCount = todayPatterns.reduce((sum, p) => sum + p.count, 0);
    const confidence = topMood.count / totalCount;

    return {
      mood: topMood.mood,
      confidence,
      dayOfWeek: today
    };
  }

  /**
   * Get preferred session length based on usage history
   */
  getPreferredSessionLength(sessionHistory: SessionHistoryEntry[]): number {
    if (sessionHistory.length === 0) return 10; // Default 10 minutes

    const usagePatterns = this.analyzeUsagePatterns(sessionHistory);
    const currentTimeOfDay = this.getCurrentTimeOfDay();

    const currentPattern = usagePatterns.find((p) => p.timeOfDay === currentTimeOfDay);
    
    if (currentPattern && currentPattern.averageDuration > 0) {
      return Math.round(currentPattern.averageDuration);
    }

    // Calculate overall average
    const totalDuration = usagePatterns.reduce((sum, p) => sum + p.averageDuration * p.sessionCount, 0);
    const totalSessions = usagePatterns.reduce((sum, p) => sum + p.sessionCount, 0);

    return totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 10;
  }

  /**
   * Get time-of-day optimized content recommendations
   */
  getTimeOptimizedRecommendations(timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'): {
    activities: string[];
    focus: string;
  } {
    switch (timeOfDay) {
      case 'morning':
        return {
          activities: ['energizing-meditation', 'morning-affirmations', 'breathwork-energize'],
          focus: 'Start your day with energy and intention'
        };
      case 'afternoon':
        return {
          activities: ['stress-relief', 'walking-meditation', 'focus-boost'],
          focus: 'Refresh and refocus for the rest of your day'
        };
      case 'evening':
        return {
          activities: ['wind-down', 'gratitude-practice', 'evening-reflection'],
          focus: 'Release the day and prepare for rest'
        };
      case 'night':
        return {
          activities: ['sleep-stories', 'deep-relaxation', 'body-scan'],
          focus: 'Prepare your mind and body for deep sleep'
        };
    }
  }

  /**
   * Detect context and provide aware suggestions
   */
  async detectContext(profile: UserProfile): Promise<{
    context: string;
    suggestion: string;
    reason: string;
  } | null> {
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();

    // Check for commute time
    const commuteEvent = notificationService.detectCommuteTime();
    if (commuteEvent) {
      return {
        context: 'Commute Detected',
        suggestion: 'Try Walking Meditation or a Mindful Commute session',
        reason: 'Perfect for staying present during travel'
      };
    }

    // Check for typical lunch break
    if (currentHour >= 12 && currentHour <= 13) {
      return {
        context: 'Lunch Break',
        suggestion: 'Quick 5-minute Breathing Exercise',
        reason: 'Recharge during your break'
      };
    }

    // Check for Monday morning (common stress time)
    if (currentDay === 1 && currentHour >= 8 && currentHour <= 10) {
      return {
        context: 'Monday Morning',
        suggestion: 'Start Week Strong - Stress Management',
        reason: 'Begin your week with calm and clarity'
      };
    }

    // Check for late evening (wind-down time)
    if (currentHour >= 21 && currentHour <= 23) {
      return {
        context: 'Evening Wind-Down',
        suggestion: 'Sleep Preparation Routine',
        reason: 'Prepare for restful sleep'
      };
    }

    // Check for weekend morning
    if ((currentDay === 0 || currentDay === 6) && currentHour >= 8 && currentHour <= 11) {
      return {
        context: 'Weekend Morning',
        suggestion: 'Extended Mindfulness Session',
        reason: 'You have more time to deepen your practice'
      };
    }

    // Check free time from calendar
    const freeSlots = notificationService.detectFreeTimeSlots();
    const now = new Date();
    const currentFreeSlot = freeSlots.find(
      (slot) => now >= slot.start && now <= slot.end && slot.duration >= 10
    );

    if (currentFreeSlot) {
      return {
        context: 'Free Time Detected',
        suggestion: `${Math.floor(currentFreeSlot.duration)}-minute Personalized Session`,
        reason: 'Make the most of this open time in your schedule'
      };
    }

    return null;
  }

  /**
   * Generate comprehensive personalization insights
   */
  async generateInsights(
    profile: UserProfile,
    sessionHistory: SessionHistoryEntry[]
  ): Promise<PersonalizationInsights> {
    const usagePatterns = this.analyzeUsagePatterns(sessionHistory);
    const moodPrediction = this.predictMood(sessionHistory);
    const preferredLength = this.getPreferredSessionLength(sessionHistory);
    const currentTimeOfDay = this.getCurrentTimeOfDay();
    const timeOptimized = this.getTimeOptimizedRecommendations(currentTimeOfDay);
    const contextSuggestion = await this.detectContext(profile);

    // Find preferred time of day (most sessions)
    const preferredTime = usagePatterns.reduce(
      (prev, current) => (current.sessionCount > prev.sessionCount ? current : prev),
      usagePatterns[0] || { timeOfDay: 'evening' as const, sessionCount: 0, averageDuration: 0, completionRate: 0 }
    );

    // Mock recommended activities (in production, this would use more sophisticated matching)
    const recommendedActivities: Activity[] = [
      {
        type: 'meditation',
        data: {
          title: timeOptimized.activities[0].replace(/-/g, ' '),
          script: 'Personalized meditation script...',
          durationMinutes: preferredLength
        }
      }
    ];

    return {
      preferredTimeOfDay: preferredTime.timeOfDay,
      preferredSessionLength: preferredLength,
      stressPrediction: {
        dayOfWeek: [moodPrediction.dayOfWeek],
        likelyMood: moodPrediction.mood,
        confidence: moodPrediction.confidence
      },
      recommendedActivities,
      contextAwareSuggestion: contextSuggestion ? {
        context: contextSuggestion.context,
        activity: contextSuggestion.suggestion,
        reason: contextSuggestion.reason
      } : undefined
    };
  }

  /**
   * Get proactive suggestion based on patterns
   */
  getProactiveSuggestion(
    profile: UserProfile,
    sessionHistory: SessionHistoryEntry[]
  ): string | null {
    const moodPrediction = this.predictMood(sessionHistory);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = daysOfWeek[new Date().getDay()];

    // High-confidence mood prediction
    if (moodPrediction.confidence > 0.6 && moodPrediction.mood.includes('stress')) {
      return `You've felt stressed on ${today}s - want to prep today with a calming session?`;
    }

    if (moodPrediction.confidence > 0.6 && moodPrediction.mood.includes('anxious')) {
      return `${today}s have been challenging. Let's start with some grounding techniques?`;
    }

    // Check streak
    if (profile.streak >= 7 && profile.lastSessionDate) {
      const lastSession = new Date(profile.lastSessionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastSession.setHours(0, 0, 0, 0);

      if (lastSession.getTime() < today.getTime()) {
        return `Don't break your ${profile.streak}-day streak! Quick 3-min session?`;
      }
    }

    return null;
  }

  /**
   * Adaptive duration recommendations based on time available and user patterns
   */
  recommendSessionDuration(
    profile: UserProfile,
    sessionHistory: SessionHistoryEntry[],
    availableMinutes?: number
  ): { duration: number; reason: string } {
    const preferredLength = this.getPreferredSessionLength(sessionHistory);

    if (availableMinutes) {
      if (availableMinutes < 5) {
        return {
          duration: 3,
          reason: 'Quick breathing exercise perfect for limited time'
        };
      }
      if (availableMinutes < preferredLength) {
        return {
          duration: Math.min(availableMinutes, 10),
          reason: 'Optimized for your available time'
        };
      }
    }

    const timeOfDay = this.getCurrentTimeOfDay();
    
    // Morning sessions tend to be shorter (people rushing)
    if (timeOfDay === 'morning' && preferredLength > 10) {
      return {
        duration: Math.min(preferredLength, 10),
        reason: 'Morning sessions work best when concise'
      };
    }

    // Evening sessions can be longer
    if (timeOfDay === 'evening' || timeOfDay === 'night') {
      return {
        duration: Math.max(preferredLength, 15),
        reason: 'Evening is perfect for deeper practice'
      };
    }

    return {
      duration: preferredLength,
      reason: 'Based on your typical session length'
    };
  }

  /**
   * Smart reminder timing based on calendar and patterns
   */
  async getOptimalReminderTimes(profile: UserProfile): Promise<Date[]> {
    const optimalTimes: Date[] = [];
    const freeSlots = notificationService.detectFreeTimeSlots();

    // Find free slots that are at least 10 minutes
    const viableSlots = freeSlots.filter((slot) => slot.duration >= 10);

    viableSlots.forEach((slot) => {
      // Schedule reminder 5 minutes into the free slot
      const reminderTime = new Date(slot.start.getTime() + 5 * 60 * 1000);
      optimalTimes.push(reminderTime);
    });

    // If no calendar data, use user preferences
    if (optimalTimes.length === 0) {
      const today = new Date();
      profile.checkInTimes.forEach((time) => {
        const reminderTime = new Date(today);
        if (time === 'morning') reminderTime.setHours(9, 0, 0, 0);
        else if (time === 'afternoon') reminderTime.setHours(14, 0, 0, 0);
        else if (time === 'evening') reminderTime.setHours(19, 0, 0, 0);
        
        if (reminderTime > today) {
          optimalTimes.push(reminderTime);
        }
      });
    }

    return optimalTimes;
  }
}

export const personalizationService = new PersonalizationService();
export default personalizationService;
