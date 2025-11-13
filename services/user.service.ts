import apiClient, { handleApiError } from './api.client';
import { UserProfile, SessionHistoryEntry, Achievement, GratitudeEntry } from '../types';
import { supabase, getCurrentUser } from './supabase.client';

class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Get current user profile from Supabase (bypasses backend API)
  async getProfileFromSupabase(): Promise<UserProfile | null> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist
          return null;
        }
        throw error;
      }

      // Convert from snake_case to camelCase
      return {
        name: profile.name,
        sessionLength: profile.session_length,
        goals: profile.goals,
        checkInTimes: profile.check_in_times,
        lifestyle: profile.lifestyle,
        activeProgramId: profile.active_program_id,
        programProgress: profile.program_progress,
        completedPrograms: profile.completed_programs,
        subscriptionTier: profile.subscription_tier,
        lastSessionDate: profile.last_session_date,
        streak: profile.streak,
        xp: profile.xp,
        level: profile.level,
        supportPreferences: profile.support_preferences,
        experienceLevel: profile.experience_level,
        notificationPreferences: {
          enabled: profile.notifications_enabled,
          checkInReminders: profile.check_in_reminders,
          streakProtection: profile.streak_protection,
          milestoneAlerts: profile.milestone_alerts,
          challengeUpdates: profile.challenge_updates,
          therapistQA: profile.therapist_qa,
          calendarSync: profile.calendar_sync,
          quietHoursStart: profile.quiet_hours_start,
          quietHoursEnd: profile.quiet_hours_end
        },
        joinedChallenges: profile.joined_challenges,
        supportGroups: profile.support_groups
      };
    } catch (error: any) {
      console.error('Failed to get profile from Supabase:', error);
      throw new Error(error.message || 'Failed to get profile');
    }
  }

  // Get current user profile (from backend API)
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/users/profile');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>('/users/profile', updates);
      // Update stored user
      localStorage.setItem('kaya-user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Complete setup
  async completeSetup(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // Get current authenticated user
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare data for Supabase (convert to snake_case)
      const supabaseData = {
        id: user.id,
        name: profileData.name || '',
        email: user.email || '',
        goals: profileData.goals || [],
        session_length: profileData.sessionLength || 'medium',
        check_in_times: profileData.checkInTimes || [],
        lifestyle: profileData.lifestyle || 'balanced',
        support_preferences: profileData.supportPreferences || [],
        experience_level: profileData.experienceLevel || 'beginner',
        active_program_id: profileData.activeProgramId || null,
        program_progress: profileData.programProgress || 0,
        completed_programs: profileData.completedPrograms || [],
        subscription_tier: profileData.subscriptionTier || 'free',
        xp: profileData.xp || 0,
        level: profileData.level || 1,
        streak: profileData.streak || 0,
        last_session_date: profileData.lastSessionDate || null,
        notifications_enabled: profileData.notificationPreferences?.enabled || false,
        check_in_reminders: profileData.notificationPreferences?.checkInReminders || false,
        streak_protection: profileData.notificationPreferences?.streakProtection || false,
        milestone_alerts: profileData.notificationPreferences?.milestoneAlerts || false,
        challenge_updates: profileData.notificationPreferences?.challengeUpdates || false,
        therapist_qa: profileData.notificationPreferences?.therapistQA || false,
        calendar_sync: profileData.notificationPreferences?.calendarSync || false,
        quiet_hours_start: profileData.notificationPreferences?.quietHoursStart || '22:00',
        quiet_hours_end: profileData.notificationPreferences?.quietHoursEnd || '07:00',
        joined_challenges: profileData.joinedChallenges || [],
        support_groups: profileData.supportGroups || []
      };

      // Insert or update user profile in Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(supabaseData, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      // Convert back to camelCase for frontend
      const fullProfile: UserProfile = {
        name: data.name,
        sessionLength: data.session_length,
        goals: data.goals,
        checkInTimes: data.check_in_times,
        lifestyle: data.lifestyle,
        activeProgramId: data.active_program_id,
        programProgress: data.program_progress,
        completedPrograms: data.completed_programs,
        subscriptionTier: data.subscription_tier,
        lastSessionDate: data.last_session_date,
        streak: data.streak,
        xp: data.xp,
        level: data.level,
        supportPreferences: data.support_preferences,
        experienceLevel: data.experience_level,
        notificationPreferences: {
          enabled: data.notifications_enabled,
          checkInReminders: data.check_in_reminders,
          streakProtection: data.streak_protection,
          milestoneAlerts: data.milestone_alerts,
          challengeUpdates: data.challenge_updates,
          therapistQA: data.therapist_qa,
          calendarSync: data.calendar_sync,
          quietHoursStart: data.quiet_hours_start,
          quietHoursEnd: data.quiet_hours_end
        },
        joinedChallenges: data.joined_challenges,
        supportGroups: data.support_groups
      };
      
      // Also store in localStorage for quick access
      localStorage.setItem('kaya-user', JSON.stringify(fullProfile));
      localStorage.setItem('kaya-setup-complete', 'true');
      // Clean up temporary signup name
      localStorage.removeItem('kaya-signup-name');
      
      return fullProfile;
    } catch (error: any) {
      console.error('Setup error:', error);
      throw new Error(error.message || 'Failed to complete setup');
    }
  }

  // Get session history
  async getSessionHistory(): Promise<SessionHistoryEntry[]> {
    try {
      const response = await apiClient.get<SessionHistoryEntry[]>('/users/sessions');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Add session to history
  async addSession(session: Omit<SessionHistoryEntry, 'id'>): Promise<SessionHistoryEntry> {
    try {
      const response = await apiClient.post<SessionHistoryEntry>('/users/sessions', session);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiClient.get<Achievement[]>('/users/achievements');
      // Ensure we return an array
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to get achievements:', error);
      return []; // Return empty array on error instead of throwing
    }
  }

  // Add achievement
  async addAchievement(achievement: Omit<Achievement, 'id'>): Promise<Achievement> {
    try {
      const response = await apiClient.post<Achievement>('/users/achievements', achievement);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get gratitude entries
  async getGratitudeEntries(): Promise<GratitudeEntry[]> {
    try {
      const response = await apiClient.get<GratitudeEntry[]>('/users/gratitude');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Add gratitude entry
  async addGratitudeEntry(entry: Omit<GratitudeEntry, 'id'>): Promise<GratitudeEntry> {
    try {
      const response = await apiClient.post<GratitudeEntry>('/users/gratitude', entry);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Add XP
  async addXP(amount: number, source: string): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>('/users/xp', { amount, source });
      localStorage.setItem('kaya-user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update streak - DEPRECATED: Streak is now updated by session completion
  // async updateStreak(): Promise<UserProfile> {
  //   try {
  //     const response = await apiClient.post<UserProfile>('/users/streak');
  //     localStorage.setItem('kaya-user', JSON.stringify(response.data));
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(handleApiError(error));
  //   }
  // }

  // Start program
  async startProgram(programId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>('/users/programs/start', { programId });
      localStorage.setItem('kaya-user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Complete program day
  async completeProgramDay(): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>('/users/programs/complete-day');
      localStorage.setItem('kaya-user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Join challenge
  async joinChallenge(challengeId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>('/users/challenges/join', { challengeId });
      localStorage.setItem('kaya-user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Join support group
  async joinSupportGroup(groupId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>('/users/groups/join', { groupId });
      localStorage.setItem('kaya-user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const userService = UserService.getInstance();
export default userService;
