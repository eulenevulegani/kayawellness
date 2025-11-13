

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CloseIcon, StarIcon, ExclamationTriangleIcon, LogoutIcon } from './Icons';

interface ProfileProps {
  profile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
  onClose: () => void;
  onResetProgram: () => void;
  onResetAccount: () => void;
  onLogout: () => void;
}

const ALL_GOALS = ['Manage Stress', 'Improve Sleep', 'Increase Focus', 'Practice Gratitude', 'Build Self-Esteem'];
const CHECK_IN_TIMES: ('morning' | 'afternoon' | 'evening')[] = ['morning', 'afternoon', 'evening'];
const calculateXpForLevel = (level: number) => 100 * Math.pow(level, 1.5);

const ConfirmationModal: React.FC<{
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="w-full max-w-sm bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 text-center">
      <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <ExclamationTriangleIcon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-white/70 mt-2 mb-6">{message}</p>
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="w-full px-6 py-2 bg-white/10 text-white/80 rounded-full font-semibold hover:bg-white/20 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="w-full px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const Profile: React.FC<ProfileProps> = ({ profile, onSave, onClose, onResetProgram, onResetAccount, onLogout }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [modalConfig, setModalConfig] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleGoalToggle = (goal: string) => {
    const newGoals = formData.goals.includes(goal)
      ? formData.goals.filter(g => g !== goal)
      : [...formData.goals, goal];
    setFormData({ ...formData, goals: newGoals });
  };

  const handleCheckInTimeToggle = (time: 'morning' | 'afternoon' | 'evening') => {
    const currentTimes = formData.checkInTimes;
    const isSelected = currentTimes.includes(time);

    if (profile.subscriptionTier === 'premium') {
        const newTimes = isSelected
            ? currentTimes.filter(t => t !== time)
            : [...currentTimes, time];
        setFormData({ ...formData, checkInTimes: newTimes.sort() });
    } else {
        // For free users, it's single-select or none
        const newTimes = isSelected ? [] : [time];
        setFormData({ ...formData, checkInTimes: newTimes });
    }
  };

  const handleResetProgramClick = () => {
    setModalConfig({
      title: "Reset Journey?",
      message: "This will reset your progress on your current multi-day journey, but will not affect your journal or achievements. Are you sure?",
      onConfirm: () => {
        onResetProgram();
        setModalConfig(null);
      },
    });
  };

  const handleResetAccountClick = () => {
    setModalConfig({
      title: "Erase All Data?",
      message: "This will permanently delete your profile, journal, and all progress, returning you to the setup screen. This action cannot be undone.",
      onConfirm: onResetAccount,
    });
  };
  
  const xpForCurrentLevel = profile.level > 1 ? calculateXpForLevel(profile.level - 1) : 0;
  const xpForNextLevel = calculateXpForLevel(profile.level);
  const progressPercent = Math.max(0, Math.min(100, ((profile.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100));


  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4 pt-24 animate-fade-in text-white h-[90vh] flex flex-col">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-light text-white">Settings</h2>
          <button onClick={onClose} className="p-2 -m-2 text-white/50 hover:text-white transition">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto space-y-6 scrollbar-thin">

        {/* Progress */}
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg text-white">Level {profile.level}</p>
                <p className="text-sm text-white/70">{Math.floor(profile.xp)} / {Math.ceil(xpForNextLevel)} XP</p>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-cyan-400 to-teal-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>


        {/* Subscription */}
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
          <p className="text-sm text-white/70">Current Plan</p>
          <p className="text-xl font-semibold text-white capitalize flex items-center justify-center gap-2">
              {profile.subscriptionTier === 'premium' && <StarIcon className="w-5 h-5 text-yellow-300" />}
              KAYA {profile.subscriptionTier === 'premium' ? '+' : 'Free'}
          </p>
          {profile.subscriptionTier === 'free' && (
              <button className="mt-3 w-full px-6 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transform hover:scale-105 transition text-sm">
                  ✨ Upgrade to KAYA+
              </button>
          )}
        </div>

        {/* Preferences Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <h3 className="text-xl font-medium text-white/90 border-b border-white/20 pb-2">Preferences</h3>
          <div>
            <label htmlFor="name" className="block text-white/80 mb-2">Your Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="How should KAYA call you?"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-3">Preferred Session Length</label>
            <div className="grid grid-cols-3 gap-3">
              {(['short', 'medium', 'long'] as const).map((length) => (
                <button key={length} type="button" onClick={() => setFormData({ ...formData, sessionLength: length })}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition ${formData.sessionLength === length ? 'bg-white text-blue-900 font-semibold ring-2 ring-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  {length}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-white/80 mb-3">Experience Level</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'beginner', label: 'New to Wellness', description: "I'm just starting" },
                { id: 'intermediate', label: 'Some Experience', description: "I've practiced before" },
                { id: 'advanced', label: 'Regular Practice', description: 'Established routine' }
              ].map((option) => (
                <button key={option.id} type="button" 
                  onClick={() => setFormData({ ...formData, experienceLevel: option.id })}
                  className={`w-full text-left p-3 rounded-lg border transition ${formData.experienceLevel === option.id ? 'bg-cyan-400/20 border-cyan-400 text-white' : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'}`}>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs opacity-70">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-white/80 mb-3">Mindful Check-in Time</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {CHECK_IN_TIMES.map((time) => (
                <button key={time} type="button" onClick={() => handleCheckInTimeToggle(time)}
                  className={`px-3 py-2 rounded-lg text-sm capitalize transition ${formData.checkInTimes.includes(time) ? 'bg-white text-blue-900 font-semibold' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  {time}
                </button>
              ))}
              <button type="button" onClick={() => setFormData({ ...formData, checkInTimes: [] })}
                  className={`px-3 py-2 rounded-lg text-sm capitalize transition ${formData.checkInTimes.length === 0 ? 'bg-white text-blue-900 font-semibold' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  None
                </button>
            </div>
            {profile.subscriptionTier === 'free' && (
                <p className="text-xs text-white/50 mt-3">
                    ✨ Upgrade to KAYA+ to set multiple daily check-in reminders.
                </p>
            )}
          </div>
          <div>
            <label className="block text-white/80 mb-3">Your Wellness Goals</label>
            <div className="flex flex-wrap gap-2">
              {ALL_GOALS.map((goal) => (
                <button key={goal} type="button" onClick={() => handleGoalToggle(goal)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${formData.goals.includes(goal) ? 'bg-white text-blue-900 font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
                  {goal}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full px-10 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-opacity-90 transform hover:scale-105 transition">
              Save Preferences
            </button>
          </div>
        </form>
        
        {/* Account Actions */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-xl font-medium text-white/90 mb-4">Account</h3>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-10 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition">
            <LogoutIcon className="w-5 h-5" />
            Log Out
          </button>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 pt-6 border-t border-red-500/30">
            <h3 className="text-xl font-medium text-red-400/90 mb-4">Danger Zone</h3>
            <div className="space-y-4">
                <button
                    onClick={handleResetProgramClick}
                    disabled={!profile.activeProgramId}
                    className="w-full text-left p-3 bg-red-900/30 text-red-300 rounded-lg text-sm border border-red-500/40 hover:bg-red-900/50 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-900/30"
                >
                    <p className="font-semibold">Reset Current Journey</p>
                    <p className="text-red-300/70">Restart your active multi-day program from Day 1.</p>
                </button>
                <button
                    onClick={handleResetAccountClick}
                    className="w-full text-left p-3 bg-red-900/30 text-red-300 rounded-lg text-sm border border-red-500/40 hover:bg-red-900/50 transition"
                >
                    <p className="font-semibold">Erase All Data & Reset</p>
                    <p className="text-red-300/70">Permanently delete your account and start over.</p>
                </button>
            </div>
        </div>
        </div>
      </div>
      {modalConfig && (
        <ConfirmationModal
          title={modalConfig.title}
          message={modalConfig.message}
          onConfirm={modalConfig.onConfirm}
          onCancel={() => setModalConfig(null)}
        />
      )}
    </>
  );
};

export default Profile;