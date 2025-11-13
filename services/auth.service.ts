import { UserProfile } from '../types';
import { supabase } from './supabase.client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Get stored user
  getStoredUser(): UserProfile | null {
    const userStr = localStorage.getItem('kaya-user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  // Login with Supabase
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        // Profile doesn't exist yet - user needs to complete setup
        const basicProfile: UserProfile = {
          name: '',
          sessionLength: 'medium',
          goals: [],
          checkInTimes: [],
          lifestyle: 'balanced',
          activeProgramId: null,
          programProgress: 0,
          completedPrograms: [],
          subscriptionTier: 'stardust',
          lastSessionDate: null,
          streak: 0,
          xp: 0,
          level: 1,
          supportPreferences: [],
          experienceLevel: 'beginner',
          notificationPreferences: {
            enabled: false,
            checkInReminders: false,
            streakProtection: false,
            milestoneAlerts: false,
            challengeUpdates: false,
            therapistQA: false,
            calendarSync: false,
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00'
          },
          joinedChallenges: [],
          supportGroups: []
        };
        localStorage.setItem('kaya-user', JSON.stringify(basicProfile));
        return basicProfile;
      }

      // Convert from snake_case to camelCase
      const userProfile: UserProfile = {
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

      localStorage.setItem('kaya-user', JSON.stringify(userProfile));
      return userProfile;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Signup with Supabase - requires email verification
  async signup(data: SignupData): Promise<{ needsVerification: boolean; email: string; message?: string }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
          data: {
            name: data.name
          }
        }
      });

      if (error) throw error;
      if (!authData.user) throw new Error('Signup failed');

      // Check if user needs email confirmation
      const needsVerification = !authData.session;
      
      console.log('📧 Signup complete. Needs verification:', needsVerification);
      console.log('🔑 Session:', authData.session ? 'Created' : 'Pending verification');

      if (needsVerification) {
        // Store signup data temporarily for after verification
        localStorage.setItem('kaya-pending-signup', JSON.stringify({
          email: data.email,
          name: data.name,
          timestamp: Date.now()
        }));

        // Return flag indicating verification is needed
        return {
          needsVerification: true,
          email: data.email,
          message: 'Please check your email for a verification link or code'
        };
      } else {
        // Email confirmation disabled or auto-confirmed
        return {
          needsVerification: false,
          email: data.email
        };
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  }

  // Verify email with OTP code
  async verifyEmail(email: string, token: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });

      if (error) throw error;
      if (!data.user) throw new Error('Verification failed');

      // Get the stored signup data
      const pendingSignup = localStorage.getItem('kaya-pending-signup');
      const signupData = pendingSignup ? JSON.parse(pendingSignup) : null;

      // Create basic profile - user will complete onboarding next
      const basicProfile: UserProfile = {
        name: signupData?.name || '',
        email: email,
        sessionLength: 'medium',
        goals: [],
        checkInTimes: [],
        lifestyle: 'balanced',
        activeProgramId: null,
        programProgress: 0,
        completedPrograms: [],
        subscriptionTier: 'stardust',
        lastSessionDate: null,
        streak: 0,
        xp: 0,
        level: 1,
        supportPreferences: [],
        experienceLevel: 'beginner',
        notificationPreferences: {
          enabled: false,
          checkInReminders: false,
          streakProtection: false,
          milestoneAlerts: false,
          challengeUpdates: false,
          therapistQA: false,
          calendarSync: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00'
        },
        joinedChallenges: [],
        supportGroups: []
      };

      // Clear pending signup data
      localStorage.removeItem('kaya-pending-signup');
      
      // Store user profile
      localStorage.setItem('kaya-user', JSON.stringify(basicProfile));
      return basicProfile;
    } catch (error: any) {
      throw new Error(error.message || 'Verification failed');
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend verification email');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('kaya-user');
      localStorage.removeItem('kaya-setup-complete');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  }

  // Reset password
  async resetPassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to reset password');
    }
  }
}

export const authService = AuthService.getInstance();
export default authService;
