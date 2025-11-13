import React, { useState } from 'react';
import authService from '../services/auth.service';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
  onSignupRedirect?: () => void; // Redirect to onboarding flow
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onSignupRedirect }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login({ email, password });
      onAuthSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-y-auto" style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #14b8a6 50%, #3b82f6 100%)' }}>
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extralight text-white mb-3 tracking-[0.2em]">KAYA</h1>
        <p className="text-white/70 text-base">Your AI Wellness Companion</p>
      </div>

      {/* Login/Sign Up Toggle Buttons */}
      <div className="flex gap-3 mb-8 w-full max-w-md">
        <button
          type="button"
          className="flex-1 py-3 px-6 bg-white text-black rounded-full font-semibold shadow-lg hover:bg-white/90 transition"
        >
          Login
        </button>
        <button
          type="button"
          onClick={onSignupRedirect}
          className="flex-1 py-3 px-6 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition"
        >
          Sign Up
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white text-black rounded-full font-bold text-base hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

      <div className="mt-5 text-center w-full max-w-md">
        <button
          type="button"
          onClick={() => {
            // TODO: Implement forgot password flow
            alert('Password reset feature coming soon!');
          }}
          className="text-sm text-white/70 hover:text-white/90 transition"
        >
          Forgot password?
        </button>
      </div>

      <p className="text-center text-white/50 text-xs mt-8 w-full max-w-md">
        By continuing, you agree to KAYA's Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default AuthScreen;
