// Context Service - Provides rich context about user's current state and environment
// This enables Kaya to deliver personalized, contextually-aware experiences

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
}

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
}

interface UserContext {
  // Time-based context
  timeOfDay: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night' | 'late-night';
  dayOfWeek: string;
  isWeekend: boolean;
  
  // Calendar context
  upcomingEvents: CalendarEvent[];
  nextEvent?: CalendarEvent;
  recentEvents: CalendarEvent[];
  
  // Alarm context
  nextAlarm?: Alarm;
  
  // Activity patterns
  typicalWakeTime?: string;
  typicalBedTime?: string;
  mostActiveTime?: string;
  
  // Environmental context
  weather?: {
    condition: string;
    temperature: number;
    description: string;
  };
  
  // Usage patterns
  lastSessionTime?: Date;
  sessionFrequency: 'first-time' | 'irregular' | 'regular' | 'daily';
  preferredSessionTime?: string;
  
  // Emotional patterns
  recentMoods: string[];
  moodTrend: 'improving' | 'stable' | 'declining' | 'unknown';
  
  // Goals and progress
  currentGoals: string[];
  completedToday: boolean;
  streakDays: number;
}

class ContextService {
  private static instance: ContextService;

  private constructor() {}

  static getInstance(): ContextService {
    if (!ContextService.instance) {
      ContextService.instance = new ContextService();
    }
    return ContextService.instance;
  }

  // Get current time of day
  getTimeOfDay(): UserContext['timeOfDay'] {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 7) return 'early-morning';
    if (hour >= 7 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    if (hour >= 21 && hour < 24) return 'night';
    return 'late-night';
  }

  // Get day context
  getDayContext() {
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    return { dayOfWeek, isWeekend };
  }

  // Request calendar access (browser API)
  async requestCalendarAccess(): Promise<boolean> {
    try {
      // Note: This would use browser calendar API or integration
      // For now, we'll check if permission is granted
      if ('calendar' in navigator) {
        // Future implementation for browser calendar API
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Calendar access not available:', error);
      return false;
    }
  }

  // Get upcoming calendar events (mock - would integrate with real calendar)
  async getUpcomingEvents(hoursAhead: number = 24): Promise<CalendarEvent[]> {
    try {
      // This would integrate with Google Calendar, Outlook, or device calendar
      // For now, return mock data or check localStorage
      const storedEvents = localStorage.getItem('kaya-calendar-events');
      if (storedEvents) {
        const events: CalendarEvent[] = JSON.parse(storedEvents);
        const now = new Date();
        const futureLimit = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
        
        return events.filter(event => {
          const eventStart = new Date(event.start);
          return eventStart > now && eventStart < futureLimit;
        }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      }
      return [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  // Get recent past events
  async getRecentEvents(hoursBack: number = 24): Promise<CalendarEvent[]> {
    try {
      const storedEvents = localStorage.getItem('kaya-calendar-events');
      if (storedEvents) {
        const events: CalendarEvent[] = JSON.parse(storedEvents);
        const now = new Date();
        const pastLimit = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
        
        return events.filter(event => {
          const eventEnd = new Date(event.end);
          return eventEnd < now && eventEnd > pastLimit;
        }).sort((a, b) => new Date(b.end).getTime() - new Date(a.end).getTime());
      }
      return [];
    } catch (error) {
      console.error('Error fetching recent events:', error);
      return [];
    }
  }

  // Get next alarm
  async getNextAlarm(): Promise<Alarm | undefined> {
    try {
      const storedAlarms = localStorage.getItem('kaya-alarms');
      if (storedAlarms) {
        const alarms: Alarm[] = JSON.parse(storedAlarms);
        const enabledAlarms = alarms.filter(a => a.enabled);
        
        if (enabledAlarms.length === 0) return undefined;
        
        // Find next alarm
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        return enabledAlarms.sort((a, b) => {
          const [aHour, aMin] = a.time.split(':').map(Number);
          const [bHour, bMin] = b.time.split(':').map(Number);
          const aTime = aHour * 60 + aMin;
          const bTime = bHour * 60 + bMin;
          
          // Handle next day alarms
          const aNext = aTime < currentTime ? aTime + 1440 : aTime;
          const bNext = bTime < currentTime ? bTime + 1440 : bTime;
          
          return aNext - bNext;
        })[0];
      }
      return undefined;
    } catch (error) {
      console.error('Error fetching alarms:', error);
      return undefined;
    }
  }

  // Analyze session patterns
  analyzeSessionPattern(sessionHistory: any[]): Pick<UserContext, 'sessionFrequency' | 'preferredSessionTime'> {
    // Ensure sessionHistory is an array
    if (!Array.isArray(sessionHistory) || sessionHistory.length === 0) {
      return { sessionFrequency: 'first-time' };
    }
    
    const last7Days = sessionHistory.filter(s => {
      const sessionDate = new Date(s.date);
      const daysAgo = (Date.now() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    });
    
    let sessionFrequency: UserContext['sessionFrequency'] = 'irregular';
    if (last7Days.length >= 6) sessionFrequency = 'daily';
    else if (last7Days.length >= 3) sessionFrequency = 'regular';
    
    // Find preferred session time
    const hourCounts = new Map<number, number>();
    sessionHistory.forEach(s => {
      const hour = new Date(s.date).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    
    const preferredHour = Array.from(hourCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    
    const preferredSessionTime = preferredHour !== undefined 
      ? `${preferredHour.toString().padStart(2, '0')}:00`
      : undefined;
    
    return { sessionFrequency, preferredSessionTime };
  }

  // Analyze mood trends
  analyzeMoodTrend(recentMoods: string[]): UserContext['moodTrend'] {
    if (recentMoods.length < 3) return 'unknown';
    
    const moodScores: Record<string, number> = {
      'Happy': 5,
      'Grateful': 5,
      'Okay': 3,
      'Tired': 2,
      'Stressed': 1,
      'Anxious': 1
    };
    
    const scores = recentMoods.slice(0, 6).map(m => moodScores[m] || 3);
    const recentAvg = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg = scores.slice(3).reduce((a, b) => a + b, 0) / Math.max(scores.length - 3, 1);
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  }

  // Get comprehensive user context
  async getUserContext(userProfile: any, sessionHistory: any[]): Promise<UserContext> {
    const timeOfDay = this.getTimeOfDay();
    const { dayOfWeek, isWeekend } = this.getDayContext();
    
    const upcomingEvents = await this.getUpcomingEvents(24);
    const nextEvent = upcomingEvents[0];
    const recentEvents = await this.getRecentEvents(12);
    const nextAlarm = await this.getNextAlarm();
    
    // Ensure sessionHistory is an array
    const sessions = Array.isArray(sessionHistory) ? sessionHistory : [];
    
    const { sessionFrequency, preferredSessionTime } = this.analyzeSessionPattern(sessions);
    
    const recentMoods = sessions
      .slice(0, 10)
      .map(s => s.mood)
      .filter(Boolean);
    
    const moodTrend = this.analyzeMoodTrend(recentMoods);
    
    return {
      timeOfDay,
      dayOfWeek,
      isWeekend,
      upcomingEvents,
      nextEvent,
      recentEvents,
      nextAlarm,
      sessionFrequency,
      preferredSessionTime,
      recentMoods,
      moodTrend,
      currentGoals: userProfile.goals || [],
      completedToday: userProfile.sessionCompletedToday || false,
      streakDays: userProfile.streak || 0
    };
  }

  // Generate contextual greeting
  generateContextualGreeting(userContext: UserContext, userName: string): string {
    const { timeOfDay, isWeekend, dayOfWeek, nextEvent, nextAlarm, moodTrend, streakDays } = userContext;
    
    let greeting = '';
    
    // Time-based greeting
    if (timeOfDay === 'early-morning') greeting = `Good early morning, ${userName}`;
    else if (timeOfDay === 'morning') greeting = `Good morning, ${userName}`;
    else if (timeOfDay === 'afternoon') greeting = `Good afternoon, ${userName}`;
    else if (timeOfDay === 'evening') greeting = `Good evening, ${userName}`;
    else if (timeOfDay === 'night') greeting = `Good night, ${userName}`;
    else greeting = `Hello, ${userName}`;
    
    // Add contextual elements
    const contextParts = [];
    
    // Weekend/weekday acknowledgment
    if (isWeekend && timeOfDay === 'morning') {
      contextParts.push(`Hope you're enjoying your ${dayOfWeek}`);
    }
    
    // Upcoming event
    if (nextEvent) {
      const timeUntil = Math.floor((new Date(nextEvent.start).getTime() - Date.now()) / (1000 * 60));
      if (timeUntil < 60) {
        contextParts.push(`I see you have "${nextEvent.title}" coming up soon`);
      } else if (timeUntil < 180) {
        contextParts.push(`I notice you have "${nextEvent.title}" in a few hours`);
      }
    }
    
    // Alarm context
    if (nextAlarm && timeOfDay === 'night') {
      contextParts.push(`I see your alarm is set for ${nextAlarm.label || nextAlarm.time}`);
    }
    
    // Mood trend
    if (moodTrend === 'improving') {
      contextParts.push(`I've noticed you've been feeling better lately`);
    } else if (moodTrend === 'declining') {
      contextParts.push(`I've noticed things have been challenging recently`);
    }
    
    // Streak acknowledgment
    if (streakDays > 0 && streakDays % 7 === 0) {
      contextParts.push(`Impressive ${streakDays}-day streak!`);
    }
    
    if (contextParts.length > 0) {
      greeting += `. ${contextParts[0]}.`;
    }
    
    greeting += ' How are you feeling right now?';
    
    return greeting;
  }

  // Get contextual suggestions
  getContextualSuggestions(userContext: UserContext): string[] {
    const { timeOfDay, nextEvent, recentEvents, moodTrend, completedToday } = userContext;
    const suggestions: string[] = [];
    
    // Time-based suggestions
    if (timeOfDay === 'morning' && !completedToday) {
      suggestions.push('Start your day with a morning meditation');
    }
    
    if (timeOfDay === 'evening' && !completedToday) {
      suggestions.push('Wind down with an evening reflection');
    }
    
    if (timeOfDay === 'night' || timeOfDay === 'late-night') {
      suggestions.push('Try a sleep story to help you rest');
    }
    
    // Event-based suggestions
    if (nextEvent) {
      const timeUntil = Math.floor((new Date(nextEvent.start).getTime() - Date.now()) / (1000 * 60));
      if (timeUntil < 60) {
        suggestions.push('Quick breathing exercise before your meeting');
      }
    }
    
    if (recentEvents.length > 0) {
      suggestions.push('Take a moment to decompress after your busy schedule');
    }
    
    // Mood-based suggestions
    if (moodTrend === 'declining') {
      suggestions.push('Let\'s explore what might help you feel better');
    }
    
    return suggestions.slice(0, 3);
  }
}

export default ContextService.getInstance();
export type { UserContext, CalendarEvent, Alarm };
