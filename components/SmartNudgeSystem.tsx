import React from 'react';
import { BellIcon, CalendarIcon, ClockIcon } from './Icons';

/**
 * Viral Nudge System: Calm.com-inspired gentle reminders
 * Context-aware notifications that feel helpful, not annoying
 */
interface NudgeCard {
  id: string;
  type: 'pre-meeting' | 'lunch' | 'wind-down' | 'morning' | 'custom';
  title: string;
  message: string;
  suggestedTime: string;
  sessionDuration: number; // in minutes
  icon: string;
}

const SMART_NUDGES: NudgeCard[] = [
  {
    id: '1',
    type: 'pre-meeting',
    title: 'Pre-Meeting Calm',
    message: 'Big meeting in 15 min? Take 3 minutes to center yourself.',
    suggestedTime: '2:45 PM',
    sessionDuration: 3,
    icon: '📅',
  },
  {
    id: '2',
    type: 'lunch',
    title: 'Midday Reset',
    message: 'Lunch break = perfect moment for a 5-minute breath.',
    suggestedTime: '12:30 PM',
    sessionDuration: 5,
    icon: '☀️',
  },
  {
    id: '3',
    type: 'wind-down',
    title: 'Evening Unwind',
    message: 'Wrap your day with calm. 7 minutes before bed.',
    suggestedTime: '9:00 PM',
    sessionDuration: 7,
    icon: '🌙',
  },
  {
    id: '4',
    type: 'morning',
    title: 'Morning Intention',
    message: 'Start fresh: Set your tone with 4 mindful breaths.',
    suggestedTime: '7:30 AM',
    sessionDuration: 4,
    icon: '🌅',
  },
];

interface SmartNudgeSystemProps {
  onScheduleNudge: (nudge: NudgeCard) => void;
  scheduledNudges: string[];
}

const SmartNudgeSystem: React.FC<SmartNudgeSystemProps> = ({
  onScheduleNudge,
  scheduledNudges,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <BellIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Smart Nudges</h3>
            <p className="text-xs text-white/60">Let us remind you to breathe</p>
          </div>
        </div>
      </div>

      {/* Nudge Cards */}
      <div className="space-y-3">
        {SMART_NUDGES.map((nudge) => {
          const isScheduled = scheduledNudges.includes(nudge.id);

          return (
            <div
              key={nudge.id}
              className={`
                p-4 rounded-2xl border transition-all duration-300
                ${isScheduled 
                  ? 'bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-cyan-400/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl mt-1">{nudge.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{nudge.title}</h4>
                    <p className="text-sm text-white/70 mb-2">{nudge.message}</p>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {nudge.suggestedTime}
                      </span>
                      <span>•</span>
                      <span>{nudge.sessionDuration} min</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onScheduleNudge(nudge)}
                  className={`
                    px-4 py-2 rounded-full text-xs font-medium transition-all
                    ${isScheduled
                      ? 'bg-white/10 text-white/70'
                      : 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 hover:opacity-90'
                    }
                  `}
                >
                  {isScheduled ? '✓ Set' : 'Set'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom tip */}
      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
        <p className="text-xs text-white/60 leading-relaxed">
          💡 <span className="text-white/80 font-medium">Pro Tip:</span> 80% of sessions under 3 minutes keep you consistent without feeling overwhelming.
        </p>
      </div>
    </div>
  );
};

export default SmartNudgeSystem;
