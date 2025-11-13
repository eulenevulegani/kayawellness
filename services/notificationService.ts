/**
 * Notification Service for KAYA
 * Handles push notifications, reminders, streak protection, and calendar synchronization
 */

import { UserProfile, SessionHistoryEntry } from '../types';

export interface NotificationPreferences {
  enabled: boolean;
  checkInReminders: boolean;
  streakProtection: boolean;
  milestoneAlerts: boolean;
  challengeUpdates: boolean;
  therapistQA: boolean;
  calendarSync: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string; // "08:00"
}

export interface ScheduledNotification {
  id: string;
  type: 'check-in' | 'streak-protection' | 'milestone' | 'challenge' | 'therapist-qa' | 'personalized';
  title: string;
  body: string;
  scheduledTime: Date;
  data?: any;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'work' | 'personal' | 'commute' | 'free' | 'unknown';
}

class NotificationService {
  private notificationPermission: NotificationPermission = 'default';
  private calendarPermission: boolean = false;
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();
  private calendarEvents: CalendarEvent[] = [];

  /**
   * Request notification permissions from the user
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.notificationPermission = 'granted';
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Request calendar access permission (simulated for web, would integrate with Google Calendar API, etc.)
   */
  async requestCalendarPermission(): Promise<boolean> {
    // In a real implementation, this would use OAuth2 to access Google Calendar, Outlook, etc.
    // For now, we'll simulate calendar permission
    try {
      // Simulate permission request
      const granted = confirm(
        'KAYA would like to access your calendar to provide personalized session recommendations based on your schedule. Allow calendar access?'
      );
      this.calendarPermission = granted;
      
      if (granted) {
        // In production, this would trigger OAuth flow
        await this.syncCalendar();
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting calendar permission:', error);
      return false;
    }
  }

  /**
   * Sync calendar events (simulated - would integrate with real calendar APIs)
   */
  async syncCalendar(): Promise<CalendarEvent[]> {
    if (!this.calendarPermission) {
      console.warn('Calendar permission not granted');
      return [];
    }

    // Simulate fetching calendar events
    // In production, this would call Google Calendar API, Microsoft Graph API, etc.
    const now = new Date();
    const mockEvents: CalendarEvent[] = [
      {
        id: 'cal-1',
        title: 'Team Meeting',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0),
        type: 'work'
      },
      {
        id: 'cal-2',
        title: 'Lunch Break',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0),
        type: 'free'
      },
      {
        id: 'cal-3',
        title: 'Commute Home',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 30),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 30),
        type: 'commute'
      }
    ];

    this.calendarEvents = mockEvents;
    return mockEvents;
  }

  /**
   * Get calendar events for analysis
   */
  getCalendarEvents(): CalendarEvent[] {
    return this.calendarEvents;
  }

  /**
   * Detect free time slots based on calendar
   */
  detectFreeTimeSlots(date: Date = new Date()): { start: Date; end: Date; duration: number }[] {
    const freeSlots: { start: Date; end: Date; duration: number }[] = [];
    const dayStart = new Date(date);
    dayStart.setHours(8, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(22, 0, 0, 0);

    if (this.calendarEvents.length === 0) {
      // No calendar data, return default free slots
      return [
        { start: new Date(date.setHours(12, 0, 0, 0)), end: new Date(date.setHours(13, 0, 0, 0)), duration: 60 },
        { start: new Date(date.setHours(18, 0, 0, 0)), end: new Date(date.setHours(19, 0, 0, 0)), duration: 60 }
      ];
    }

    // Sort events by start time
    const sortedEvents = [...this.calendarEvents].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    let currentTime = dayStart;

    for (const event of sortedEvents) {
      if (event.startTime > currentTime) {
        const duration = (event.startTime.getTime() - currentTime.getTime()) / (1000 * 60);
        if (duration >= 5) { // At least 5 minutes free
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(event.startTime),
            duration
          });
        }
      }
      currentTime = event.endTime > currentTime ? event.endTime : currentTime;
    }

    // Add final slot until end of day
    if (currentTime < dayEnd) {
      const duration = (dayEnd.getTime() - currentTime.getTime()) / (1000 * 60);
      freeSlots.push({
        start: new Date(currentTime),
        end: dayEnd,
        duration
      });
    }

    return freeSlots;
  }

  /**
   * Detect commute times from calendar
   */
  detectCommuteTime(): CalendarEvent | null {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Look for commute events
    const commuteEvents = this.calendarEvents.filter(e => e.type === 'commute');
    
    // Check if we're currently in a commute window
    for (const event of commuteEvents) {
      if (now >= event.startTime && now <= event.endTime) {
        return event;
      }
    }

    // Typical commute times if no calendar data
    if (currentHour >= 7 && currentHour <= 9 || currentHour >= 17 && currentHour <= 19) {
      return {
        id: 'detected-commute',
        title: 'Commute Time',
        startTime: now,
        endTime: new Date(now.getTime() + 30 * 60 * 1000),
        type: 'commute'
      };
    }

    return null;
  }

  /**
   * Schedule check-in notifications based on user preferences
   */
  scheduleCheckInNotifications(profile: UserProfile, preferences: NotificationPreferences): void {
    if (!preferences.enabled || !preferences.checkInReminders) return;

    const now = new Date();
    profile.checkInTimes.forEach(timeOfDay => {
      let hour = 9; // default morning
      if (timeOfDay === 'afternoon') hour = 14;
      if (timeOfDay === 'evening') hour = 19;

      const scheduledTime = new Date(now);
      scheduledTime.setHours(hour, 0, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const notification: ScheduledNotification = {
        id: `check-in-${timeOfDay}`,
        type: 'check-in',
        title: `Time for your ${timeOfDay} check-in`,
        body: 'Take a mindful moment with KAYA. Just 3 minutes can make a difference.',
        scheduledTime,
        data: { timeOfDay }
      };

      this.scheduleNotification(notification);
    });
  }

  /**
   * Schedule streak protection reminders
   */
  scheduleStreakProtection(profile: UserProfile, preferences: NotificationPreferences): void {
    if (!preferences.enabled || !preferences.streakProtection || profile.streak === 0) return;

    const now = new Date();
    const lastSession = profile.lastSessionDate ? new Date(profile.lastSessionDate) : null;

    if (!lastSession) return;

    // Check if user hasn't done a session today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastSession.setHours(0, 0, 0, 0);

    if (lastSession.getTime() < today.getTime()) {
      // Schedule reminder for evening
      const reminderTime = new Date(now);
      reminderTime.setHours(20, 0, 0, 0);

      if (reminderTime > now) {
        const notification: ScheduledNotification = {
          id: 'streak-protection',
          type: 'streak-protection',
          title: `Don't break your ${profile.streak}-day streak! 🔥`,
          body: `Quick 3-min session? You've come so far - let's keep the momentum going!`,
          scheduledTime: reminderTime,
          data: { streak: profile.streak }
        };

        this.scheduleNotification(notification);
      }
    }
  }

  /**
   * Send milestone celebration notification
   */
  sendMilestoneNotification(milestone: number, type: 'session' | 'streak' | 'program'): void {
    if (this.notificationPermission !== 'granted') return;

    let title = '';
    let body = '';

    switch (type) {
      case 'session':
        title = `🎉 ${milestone} Sessions Completed!`;
        body = `You've completed ${milestone} sessions on KAYA. You're building incredible momentum!`;
        break;
      case 'streak':
        title = `🔥 ${milestone}-Day Streak!`;
        body = `${milestone} days of consistent practice! Your dedication is inspiring.`;
        break;
      case 'program':
        title = `✨ ${milestone} Programs Completed!`;
        body = `You've finished ${milestone} wellness programs. Your growth journey continues!`;
        break;
    }

    this.showNotification(title, body, { type: 'milestone', milestone, milestoneType: type });
  }

  /**
   * Send personalized context-aware notification
   */
  sendContextAwareNotification(context: string, suggestion: string): void {
    if (this.notificationPermission !== 'granted') return;

    const notification: ScheduledNotification = {
      id: `context-${Date.now()}`,
      type: 'personalized',
      title: context,
      body: suggestion,
      scheduledTime: new Date(),
      data: { context }
    };

    this.showNotification(notification.title, notification.body, notification.data);
  }

  /**
   * Schedule notification
   */
  private scheduleNotification(notification: ScheduledNotification): void {
    this.scheduledNotifications.set(notification.id, notification);

    const delay = notification.scheduledTime.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        this.showNotification(notification.title, notification.body, notification.data);
      }, delay);
    }
  }

  /**
   * Show notification
   */
  private showNotification(title: string, body: string, data?: any): void {
    if (this.notificationPermission !== 'granted') return;

    const notification = new Notification(title, {
      body,
      icon: '/kaya-icon.png',
      badge: '/kaya-badge.png',
      tag: data?.type || 'kaya-notification',
      data,
      requireInteraction: false,
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  /**
   * Check if notification should be sent (respecting quiet hours)
   */
  shouldSendNotification(preferences: NotificationPreferences): boolean {
    if (!preferences.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (preferences.quietHoursStart && preferences.quietHoursEnd) {
      if (currentTime >= preferences.quietHoursStart || currentTime <= preferences.quietHoursEnd) {
        return false; // In quiet hours
      }
    }

    return true;
  }

  /**
   * Get notification status
   */
  getNotificationPermission(): NotificationPermission {
    return this.notificationPermission;
  }

  /**
   * Get calendar permission status
   */
  getCalendarPermission(): boolean {
    return this.calendarPermission;
  }

  /**
   * Clear all scheduled notifications
   */
  clearAllNotifications(): void {
    this.scheduledNotifications.clear();
  }

  /**
   * Check for milestone achievements
   */
  checkMilestones(sessionHistory: SessionHistoryEntry[], profile: UserProfile): void {
    const milestones = [10, 25, 50, 100, 250, 500];
    const sessionCount = sessionHistory.length;

    if (milestones.includes(sessionCount)) {
      this.sendMilestoneNotification(sessionCount, 'session');
    }

    if (milestones.includes(profile.streak)) {
      this.sendMilestoneNotification(profile.streak, 'streak');
    }

    const completedProgramCount = profile.completedPrograms?.length || 0;
    if (milestones.includes(completedProgramCount)) {
      this.sendMilestoneNotification(completedProgramCount, 'program');
    }
  }

  /**
   * Schedule morning wellness notification
   * Sends notification 10 minutes after user's wake time
   */
  scheduleMorningWellness(wakeTime: string, userName: string): void {
    if (this.notificationPermission !== 'granted') {
      console.warn('Cannot schedule morning wellness - notification permission not granted');
      return;
    }

    // Parse wake time (format: "HH:MM")
    const [hours, minutes] = wakeTime.split(':').map(Number);
    
    // Calculate notification time (10 minutes after wake time)
    const notificationDate = new Date();
    notificationDate.setHours(hours, minutes + 10, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (notificationDate < new Date()) {
      notificationDate.setDate(notificationDate.getDate() + 1);
    }

    const affirmations = [
      "Today is full of possibilities",
      "You are exactly where you need to be",
      "Your presence makes a difference",
      "Embrace this moment with an open heart",
      "You have everything you need within you"
    ];
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    const notification: ScheduledNotification = {
      id: 'morning-wellness',
      type: 'personalized',
      title: `Good morning, ${userName} 🌅`,
      body: `${randomAffirmation}. Ready for your grounding session?`,
      scheduledTime: notificationDate,
      data: { action: 'open-morning-session' }
    };

    this.scheduleNotification(notification);

    console.log(`Morning wellness notification scheduled for ${notificationDate.toLocaleTimeString()}`);
  }

  /**
   * Cancel morning wellness notification
   */
  cancelMorningWellness(): void {
    this.scheduledNotifications.delete('morning-wellness');
    console.log('Morning wellness notification cancelled');
  }

  /**
   * Send morning wellness notification immediately (for testing)
   */
  sendMorningWellnessNow(userName: string): void {
    if (this.notificationPermission !== 'granted') {
      console.warn('Cannot send notification - permission not granted');
      return;
    }

    const affirmations = [
      "Today is full of possibilities",
      "You are exactly where you need to be",
      "Your presence makes a difference",
      "Embrace this moment with an open heart",
      "You have everything you need within you"
    ];
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    this.showNotification(
      `Good morning, ${userName} 🌅`,
      `${randomAffirmation}. Ready for your grounding session?`,
      { action: 'open-morning-session' }
    );
  }
}

export const notificationService = new NotificationService();
export default notificationService;
