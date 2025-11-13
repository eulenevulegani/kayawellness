import React, { useState } from 'react';
import KayaLogo from './KayaLogo';

interface VerificationScreenProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ email, onResend }) => {
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    setError('');
    
    try {
      await onResend();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-lg">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mx-auto mb-6">
            <KayaLogo size={100} animated={true} />
          </div>
          <h1 className="text-4xl font-light text-white mb-3 tracking-wide">Check Your Email</h1>
          <p className="text-white/80 text-base mb-2">
            We sent a verification link to
          </p>
          <p className="text-white/80 font-medium text-lg">{email}</p>
        </div>

        {/* Instructions Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="text-4xl">📧</div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Next Steps:</h3>
              <ol className="text-white/80 text-sm space-y-2">
                <li>1. Open your email inbox</li>
                <li>2. Look for an email from KAYA</li>
                <li>3. Click the "Confirm your email" button</li>
                <li>4. You'll be automatically redirected back here</li>
              </ol>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4">
            <p className="text-white/70 text-xs">
              💡 <span className="font-medium">Tip:</span> Check your spam/junk folder if you don't see the email within 2-3 minutes.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {resendSuccess && (
          <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <p className="text-green-100 text-sm font-medium">Email sent! Check your inbox.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary CTA - Login */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
            <p className="text-white text-sm mb-3 text-center">
              ✅ Already confirmed your email?
            </p>
            <button
              type="button"
              onClick={() => {
                // Clear pending verification state and go to login
                localStorage.removeItem('kaya-pending-signup');
                window.location.reload();
              }}
              className="w-full px-6 py-3.5 bg-white text-black rounded-full font-bold text-base hover:bg-white/90 hover:scale-105 transform transition shadow-lg"
            >
              Log In Here →
            </button>
          </div>

          {/* Secondary - Resend */}
          <div className="text-center">
            <p className="text-white/60 text-sm mb-3">
              Didn't receive the email?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || resendSuccess}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Sending...' : resendSuccess ? 'Email Sent ✓' : 'Resend Email'}
            </button>
          </div>
        </div>

        {/* Waiting indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-white/50 text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Waiting for email confirmation...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
