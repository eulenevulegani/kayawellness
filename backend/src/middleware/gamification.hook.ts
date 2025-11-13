/**
 * Gamification Hook Middleware
 * Automatically awards points and updates challenges when users complete activities
 */

import { PointsService } from '../services/points.service.js';
import { ChallengeService } from '../services/challenge.service.js';
import { logger } from '../utils/logger.js';

export class GamificationHook {
  /**
   * Award points and update challenges after session completion
   */
  static async onSessionComplete(userId: string, sessionData: any) {
    try {
      // Award points
      await PointsService.awardActivityPoints(userId, 'SESSION_COMPLETE', {
        sessionId: sessionData.id,
        duration: sessionData.duration,
        type: sessionData.type,
      });

      // Update relevant challenges
      await ChallengeService.trackActivity(userId, 'SESSION_COMPLETE', {
        sessionType: sessionData.type,
        duration: sessionData.duration,
      });

      logger.info(`Gamification: Session complete rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (session):', error);
      // Don't throw - gamification failures shouldn't break main flow
    }
  }

  /**
   * Award points after journal entry creation
   */
  static async onJournalEntry(userId: string, entryData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'JOURNAL_ENTRY', {
        entryId: entryData.id,
        entryLength: entryData.content?.length || 0,
      });

      await ChallengeService.trackActivity(userId, 'JOURNAL_ENTRY', {
        entryId: entryData.id,
      });

      logger.info(`Gamification: Journal entry rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (journal):', error);
    }
  }

  /**
   * Award points after mood check-in
   */
  static async onMoodCheckIn(userId: string, moodData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'MOOD_CHECKIN', {
        moodId: moodData.id,
        mood: moodData.mood,
      });

      await ChallengeService.trackActivity(userId, 'MOOD_CHECKIN', moodData);

      logger.info(`Gamification: Mood check-in rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (mood):', error);
    }
  }

  /**
   * Award points after gratitude entry
   */
  static async onGratitudeEntry(userId: string, gratitudeData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'GRATITUDE_ENTRY', {
        entryId: gratitudeData.id,
      });

      await ChallengeService.trackActivity(userId, 'GRATITUDE_ENTRY', gratitudeData);

      logger.info(`Gamification: Gratitude entry rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (gratitude):', error);
    }
  }

  /**
   * Award points after community post creation
   */
  static async onCommunityPost(userId: string, postData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'COMMUNITY_POST', {
        postId: postData.id,
        category: postData.category,
      });

      await ChallengeService.trackActivity(userId, 'COMMUNITY_POST', {
        postId: postData.id,
      });

      logger.info(`Gamification: Community post rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (community post):', error);
    }
  }

  /**
   * Award points after commenting
   */
  static async onCommunityComment(userId: string, commentData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'COMMUNITY_COMMENT', {
        commentId: commentData.id,
        postId: commentData.postId,
      });

      await ChallengeService.trackActivity(userId, 'COMMUNITY_COMMENT', commentData);

      logger.info(`Gamification: Community comment rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (comment):', error);
    }
  }

  /**
   * Award points after liking a post
   */
  static async onPostLike(userId: string, likeData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'POST_LIKE', {
        postId: likeData.postId,
      });

      await ChallengeService.trackActivity(userId, 'POST_LIKE', likeData);

      logger.info(`Gamification: Post like rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (like):', error);
    }
  }

  /**
   * Award points after program enrollment
   */
  static async onProgramEnrollment(userId: string, enrollmentData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'PROGRAM_ENROLLMENT', {
        programId: enrollmentData.programId,
        programName: enrollmentData.program?.title,
      });

      logger.info(`Gamification: Program enrollment rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (enrollment):', error);
    }
  }

  /**
   * Award points after achievement unlock
   */
  static async onAchievementUnlock(userId: string, achievementData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'ACHIEVEMENT_UNLOCK', {
        achievementId: achievementData.id,
        achievementName: achievementData.name,
      });

      logger.info(`Gamification: Achievement unlock rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (achievement):', error);
    }
  }

  /**
   * Award points after event registration
   */
  static async onEventRegistration(userId: string, registrationData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'EVENT_REGISTRATION', {
        eventId: registrationData.eventId,
      });

      logger.info(`Gamification: Event registration rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (event registration):', error);
    }
  }

  /**
   * Award points after attending an event
   */
  static async onEventAttendance(userId: string, attendanceData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'EVENT_ATTENDANCE', {
        eventId: attendanceData.eventId,
      });

      logger.info(`Gamification: Event attendance rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (event attendance):', error);
    }
  }

  /**
   * Award points after therapist session
   */
  static async onTherapistSession(userId: string, sessionData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'THERAPIST_SESSION', {
        sessionId: sessionData.id,
        therapistId: sessionData.therapistId,
      });

      logger.info(`Gamification: Therapist session rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (therapist session):', error);
    }
  }

  /**
   * Award points when profile is completed
   */
  static async onProfileComplete(userId: string) {
    try {
      await PointsService.awardActivityPoints(userId, 'PROFILE_COMPLETE', {
        userId,
      });

      logger.info(`Gamification: Profile complete rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (profile complete):', error);
    }
  }

  /**
   * Award points for friend referral
   */
  static async onFriendReferral(userId: string, referralData: any) {
    try {
      await PointsService.awardActivityPoints(userId, 'FRIEND_REFERRAL', {
        referredUserId: referralData.referredUserId,
      });

      logger.info(`Gamification: Friend referral rewards for user ${userId}`);
    } catch (error) {
      logger.error('Gamification hook error (referral):', error);
    }
  }
}
