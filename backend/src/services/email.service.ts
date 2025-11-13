import { Resend } from 'resend';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const resend = new Resend(config.email.resendApiKey);

export const emailService = {
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${config.frontendUrl}/verify-email/${token}`;
    
    try {
      await resend.emails.send({
        from: config.email.from,
        to: email,
        subject: 'Verify your KAYA account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to KAYA!</h2>
            <p>Thank you for joining us on your wellness journey.</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" style="display: inline-block; background: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Verify Email
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `
      });
      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send verification email:', error);
      throw error;
    }
  },

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${config.frontendUrl}/reset-password/${token}`;
    
    try {
      await resend.emails.send({
        from: config.email.from,
        to: email,
        subject: 'Reset your KAYA password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; background: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Reset Password
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
        `
      });
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      throw error;
    }
  },

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await resend.emails.send({
        from: config.email.from,
        to: email,
        subject: 'Welcome to KAYA - Your Wellness Journey Begins',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to KAYA, ${name}!</h2>
            <p>We're thrilled to have you join our community.</p>
            <p>KAYA is here to support your mental wellness journey with:</p>
            <ul>
              <li>Personalized meditation sessions</li>
              <li>Guided breathwork exercises</li>
              <li>Sleep stories and soundscapes</li>
              <li>A supportive community</li>
              <li>Progress tracking and achievements</li>
            </ul>
            <p>Ready to start? Log in and begin your first session today!</p>
            <a href="${config.frontendUrl}/dashboard" style="display: inline-block; background: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Get Started
            </a>
          </div>
        `
      });
      logger.info(`Welcome email sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
    }
  }
};
