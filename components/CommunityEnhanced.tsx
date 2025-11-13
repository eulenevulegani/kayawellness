/**
 * Enhanced Community Component with Social Features
 * Includes support groups, challenges, progress sharing, and therapist Q&A
 */

import React, { useState } from 'react';
import { GratitudeEntry, UserProfile } from '../types';
import { ArrowLeftIcon } from './Icons';

interface CommunityProps {
  entries: GratitudeEntry[];
  onClose: () => void;
  userProfile: UserProfile;
}

type CommunityView = 'constellation' | 'groups' | 'challenges' | 'share' | 'therapist-qa';

interface SupportGroup {
  id: string;
  name: string;
  topic: string;
  memberCount: number;
  description: string;
  isAnonymous: boolean;
  nextSession?: Date;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  startDate: Date;
  participants: number;
  yourProgress?: number;
  isActive: boolean;
}

interface TherapistQASession {
  id: string;
  therapistName: string;
  specialty: string;
  topic: string;
  scheduledTime: Date;
  isLive: boolean;
  viewerCount?: number;
}

// Mock data - in production, this would come from a backend
const SUPPORT_GROUPS: SupportGroup[] = [
  {
    id: 'sg-1',
    name: 'Anxiety Warriors',
    topic: 'Anxiety Management',
    memberCount: 1247,
    description: 'A safe space to share experiences and coping strategies for anxiety.',
    isAnonymous: true,
    nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'sg-2',
    name: 'Sleep Better Together',
    topic: 'Sleep & Insomnia',
    memberCount: 892,
    description: 'Connect with others working on improving sleep quality and establishing healthy sleep routines.',
    isAnonymous: true,
    nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'sg-3',
    name: 'Stress-Free Zone',
    topic: 'Stress Management',
    memberCount: 2103,
    description: 'Learn and share stress management techniques in a supportive community.',
    isAnonymous: true
  },
  {
    id: 'sg-4',
    name: 'Mindful Parents',
    topic: 'Parenting & Balance',
    memberCount: 567,
    description: 'For parents seeking balance and mindfulness in the beautiful chaos of parenting.',
    isAnonymous: false
  }
];

const CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: '7-Day Morning Meditation',
    description: 'Start each day with a 5-minute meditation for 7 consecutive days.',
    duration: 7,
    startDate: new Date(),
    participants: 3421,
    yourProgress: 3,
    isActive: true
  },
  {
    id: 'ch-2',
    title: '30-Day Gratitude Journey',
    description: 'Practice gratitude daily for 30 days and watch your perspective shift.',
    duration: 30,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    participants: 1876,
    yourProgress: 10,
    isActive: true
  },
  {
    id: 'ch-3',
    title: 'Weekend Wellness Sprint',
    description: 'Complete 3 sessions over the weekend - perfect for beginners!',
    duration: 3,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    participants: 892,
    isActive: false
  },
  {
    id: 'ch-4',
    title: '14-Day Sleep Reset',
    description: 'Establish a consistent bedtime routine with guided sleep stories.',
    duration: 14,
    startDate: new Date(),
    participants: 1234,
    yourProgress: 0,
    isActive: true
  }
];

const THERAPIST_QA: TherapistQASession[] = [
  {
    id: 'qa-1',
    therapistName: 'Dr. Sarah Chen',
    specialty: 'Anxiety & Stress',
    topic: 'Managing Work-Related Stress',
    scheduledTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    isLive: false
  },
  {
    id: 'qa-2',
    therapistName: 'Dr. Michael Torres',
    specialty: 'Sleep Psychology',
    topic: 'Breaking the Insomnia Cycle',
    scheduledTime: new Date(Date.now() - 30 * 60 * 1000),
    isLive: true,
    viewerCount: 234
  },
  {
    id: 'qa-3',
    therapistName: 'Dr. Emily Watson',
    specialty: 'Mindfulness & CBT',
    topic: 'Building Emotional Resilience',
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isLive: false
  }
];

const simpleHash = (s: string): number => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const Leaf: React.FC<{ entry: GratitudeEntry; index: number }> = ({ entry, index }) => {
  const hash = simpleHash(entry.word + entry.date);
  const top = 20 + (hash % 70);
  const left = 10 + (hash % 80);
  const rotation = (hash % 60) - 30;
  const delay = (index % 20) * 100;
  const scale = 0.8 + ((hash % 5) / 10);

  return (
    <div
      className="absolute px-3 py-1.5 bg-cyan-400/20 backdrop-blur-sm border border-cyan-300/40 text-cyan-100 text-sm rounded-full animate-shimmer shadow-lg shadow-cyan-500/20"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        animationDelay: `${delay}ms`,
        boxShadow: `0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 10px rgba(165, 243, 252, 0.2)`
      }}
    >
      ⭐ {entry.word}
    </div>
  );
};

const EnhancedCommunity: React.FC<CommunityProps> = ({ entries, onClose, userProfile }) => {
  const [view, setView] = useState<CommunityView>('constellation');

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Starting soon';
    if (hours < 24) return `In ${hours} hours`;
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  const renderNavigation = () => (
    <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
      <button
        onClick={() => setView('constellation')}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
          view === 'constellation'
            ? 'bg-white text-blue-900 font-semibold'
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
      >
        ✨ Constellation
      </button>
      <button
        onClick={() => setView('groups')}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
          view === 'groups'
            ? 'bg-white text-blue-900 font-semibold'
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
      >
        🌌 Support Groups
      </button>
      <button
        onClick={() => setView('challenges')}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
          view === 'challenges'
            ? 'bg-white text-blue-900 font-semibold'
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
      >
        🏆 Challenges
      </button>
      <button
        onClick={() => setView('share')}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
          view === 'share'
            ? 'bg-white text-blue-900 font-semibold'
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
      >
        🌠 Share Progress
      </button>
      <button
        onClick={() => setView('therapist-qa')}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
          view === 'therapist-qa'
            ? 'bg-white text-blue-900 font-semibold'
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
      >
        ⭐ Therapist Q&A
      </button>
    </div>
  );

  const renderConstellation = () => (
    <div className="flex-grow relative overflow-hidden rounded-lg bg-gradient-to-b from-cyan-950/30 to-black/50 border border-white/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
      {Array.isArray(entries) && entries.length > 0 ? (
        entries.map((entry, index) => <Leaf key={`${entry.date}-${index}`} entry={entry} index={index} />)
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-center text-white/70 max-w-xs">
            The constellation awaits. <br /> Add a star of gratitude after your next session to illuminate the cosmos.
          </p>
        </div>
      )}
      <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/50 px-4">
        Anonymous words of gratitude from the KAYA community
      </p>
    </div>
  );

  const renderGroups = () => (
    <div className="flex-grow overflow-y-auto space-y-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">Anonymous Support Groups</h3>
        <p className="text-white/70 text-sm mb-4">
          Connect with others on similar journeys. All groups maintain anonymity and confidentiality.
        </p>
      </div>

      {SUPPORT_GROUPS.map((group) => (
        <div
          key={group.id}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-semibold">{group.name}</h4>
              <p className="text-sm text-cyan-300">{group.topic}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">{group.memberCount.toLocaleString()} members</p>
              {group.isAnonymous && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                  Anonymous
                </span>
              )}
            </div>
          </div>
          <p className="text-white/70 text-sm mb-3">{group.description}</p>
          {group.nextSession && (
            <p className="text-xs text-white/50 mb-3">Next session: {formatDate(group.nextSession)}</p>
          )}
          <button className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 text-cyan-100 rounded-lg hover:bg-cyan-500/30 transition">
            Join Group
          </button>
        </div>
      ))}
    </div>
  );

  const renderChallenges = () => (
    <div className="flex-grow overflow-y-auto space-y-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">Community Challenges</h3>
        <p className="text-white/70 text-sm mb-4">
          Join others in building consistent wellness habits. Track your progress and stay motivated together!
        </p>
      </div>

      {CHALLENGES.map((challenge) => (
        <div
          key={challenge.id}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="text-lg font-semibold">{challenge.title}</h4>
              <p className="text-sm text-white/60">{challenge.duration} days</p>
            </div>
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-white/70 text-sm mb-3">{challenge.description}</p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-white/60">{challenge.participants.toLocaleString()} participants</p>
            {challenge.isActive && challenge.yourProgress !== undefined && (
              <p className="text-sm text-cyan-300">
                Your progress: {challenge.yourProgress}/{challenge.duration} days
              </p>
            )}
          </div>
          {challenge.yourProgress !== undefined && challenge.yourProgress > 0 && (
            <div className="mb-3">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(challenge.yourProgress / challenge.duration) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          <button
            className={`w-full px-4 py-2 rounded-lg transition ${
              challenge.isActive && challenge.yourProgress !== undefined && challenge.yourProgress > 0
                ? 'bg-green-500/20 border border-green-400/30 text-green-100 hover:bg-green-500/30'
                : 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-500/30'
            }`}
          >
            {challenge.isActive && challenge.yourProgress !== undefined && challenge.yourProgress > 0
              ? 'Continue Challenge'
              : challenge.isActive
              ? 'Join Challenge'
              : `Starts ${formatDate(challenge.startDate)}`}
          </button>
        </div>
      ))}
    </div>
  );

  const renderShare = () => (
    <div className="flex-grow overflow-y-auto space-y-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">Share Your Progress</h3>
        <p className="text-white/70 text-sm mb-4">
          Inspire others by sharing your wellness journey. Your story matters!
        </p>
      </div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-2">
            {userProfile.streak}
          </div>
          <p className="text-white/80 text-lg">Day Streak 🔥</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-cyan-300">{userProfile.level}</p>
            <p className="text-white/60 text-sm">Level</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-cyan-300">{userProfile.completedPrograms?.length || 0}</p>
            <p className="text-white/60 text-sm">Programs Completed</p>
          </div>
        </div>

        <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition mb-3">
          Share on Social Media
        </button>

        <button className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition">
          Copy Shareable Link
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5">
        <h4 className="font-semibold mb-3">Recent Community Shares</h4>
        <div className="space-y-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-sm text-white/90 mb-1">
              <span className="font-semibold">Maya S.</span> completed a 14-day streak! 🎉
            </p>
            <p className="text-xs text-white/50">2 hours ago</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-sm text-white/90 mb-1">
              <span className="font-semibold">James R.</span> reached Level 10! ⭐
            </p>
            <p className="text-xs text-white/50">5 hours ago</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-sm text-white/90 mb-1">
              <span className="font-semibold">Anonymous</span> completed their 3rd program! 💪
            </p>
            <p className="text-xs text-white/50">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTherapistQA = () => (
    <div className="flex-grow overflow-y-auto space-y-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">Therapist Q&A Sessions</h3>
        <p className="text-white/70 text-sm mb-4">
          Join live sessions with licensed therapists. Ask questions and learn from experts!
        </p>
      </div>

      {THERAPIST_QA.map((session) => (
        <div
          key={session.id}
          className={`backdrop-blur-sm border rounded-lg p-5 hover:bg-white/10 transition ${
            session.isLive
              ? 'bg-red-500/10 border-red-400/30'
              : 'bg-white/5 border-white/10'
          }`}
        >
          {session.isLive && (
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-300 text-sm font-semibold">LIVE NOW</span>
              {session.viewerCount && (
                <span className="text-white/60 text-sm">• {session.viewerCount} watching</span>
              )}
            </div>
          )}

          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-semibold">{session.therapistName}</h4>
              <p className="text-sm text-cyan-300">{session.specialty}</p>
            </div>
            <span className="text-2xl">⭐</span>
          </div>

          <p className="text-white/90 font-medium mb-2">{session.topic}</p>

          {!session.isLive && (
            <p className="text-sm text-white/60 mb-3">{formatDate(session.scheduledTime)}</p>
          )}

          <button
            className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
              session.isLive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-500/30'
            }`}
          >
            {session.isLive ? 'Join Live Session' : 'Set Reminder'}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-4 animate-fade-in text-white h-[90vh] flex flex-col">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-light text-white flex items-center gap-3">
            {view === 'constellation' && '✨ Constellation of Gratitude'}
            {view === 'groups' && '🌌 Support Groups'}
            {view === 'challenges' && '🏆 Community Challenges'}
            {view === 'share' && '🌠 Share Progress'}
            {view === 'therapist-qa' && '⭐ Therapist Q&A'}
          </h2>
          <button onClick={onClose} className="p-2 -m-2 text-white/60 hover:text-white transition">
            <ArrowLeftIcon className="w-6 h-6" />
            <span className="sr-only">Back</span>
          </button>
        </header>

        {renderNavigation()}

        {view === 'constellation' && renderConstellation()}
        {view === 'groups' && renderGroups()}
        {view === 'challenges' && renderChallenges()}
        {view === 'share' && renderShare()}
        {view === 'therapist-qa' && renderTherapistQA()}
      </div>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.7; transform: scale(1) rotate(var(--rotation, 0deg)); }
          50% { opacity: 1; transform: scale(1.05) rotate(var(--rotation, 0deg)); }
        }
        .animate-shimmer {
          animation: shimmer 5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default EnhancedCommunity;
