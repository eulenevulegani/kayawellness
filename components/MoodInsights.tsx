import React, { useMemo } from 'react';
import { SessionHistoryEntry, GratitudeEntry } from '../types';
import { ArrowLeftIcon } from './Icons';

interface MoodInsightsProps {
  sessionHistory: SessionHistoryEntry[];
  gratitudeEntries: GratitudeEntry[];
  streak: number;
  onBack: () => void;
}

const MOOD_COLORS: Record<string, string> = {
  'stressed': '#ef4444',
  'anxious': '#f97316',
  'sad': '#6366f1',
  'tired': '#8b5cf6',
  'calm': '#14b8a6',
  'happy': '#22c55e',
  'grateful': '#facc15',
  'energized': '#06b6d4',
  'peaceful': '#10b981',
  'hopeful': '#84cc16'
};

const MoodInsights: React.FC<MoodInsightsProps> = ({ sessionHistory, gratitudeEntries, streak, onBack }) => {
  // Check if we have data to show
  const hasData = sessionHistory.length > 0;

  const insights = useMemo(() => {
    const last7Days = sessionHistory.slice(-7);
    const last30Days = sessionHistory.slice(-30);
    
    // Mood frequency
    const moodCount: Record<string, number> = {};
    last30Days.forEach(entry => {
      moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });
    
    const mostCommonMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];
    
    // Activity trends
    const totalSessions = sessionHistory.length;
    const weeklyAverage = last30Days.length >= 7 ? (last30Days.length / 4).toFixed(1) : 'N/A';
    
    // Gratitude insights
    const recentGratitude = gratitudeEntries.slice(-10);
    
    // Progress indicators
    const positiveStates = ['calm', 'happy', 'grateful', 'energized', 'peaceful', 'hopeful'];
    const recentPositive = last7Days.filter(s => positiveStates.includes(s.mood.toLowerCase())).length;
    const positivePercentage = last7Days.length > 0 ? Math.round((recentPositive / last7Days.length) * 100) : 0;
    
    return {
      mostCommonMood,
      totalSessions,
      weeklyAverage,
      recentGratitude,
      positivePercentage,
      last7Days,
      last30Days
    };
  }, [sessionHistory, gratitudeEntries]);

  const getInsightMessage = () => {
    if (insights.positivePercentage >= 70) {
      return "You're doing great! Your recent sessions show strong positive momentum.";
    } else if (insights.positivePercentage >= 40) {
      return "You're making steady progress. Keep showing up for yourself.";
    } else {
      return "Remember, every session is a step forward. Be gentle with yourself.";
    }
  };

  const getMoodEmoji = (mood: string): string => {
    const moodLower = mood.toLowerCase();
    if (['happy', 'energized', 'hopeful'].includes(moodLower)) return '😊';
    if (['calm', 'peaceful', 'grateful'].includes(moodLower)) return '😌';
    if (['stressed', 'anxious'].includes(moodLower)) return '😰';
    if (['sad', 'tired'].includes(moodLower)) return '😔';
    return '🙂';
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-light text-white">Orbit</h1>
          <p className="text-white/70 text-sm">Track your wellness progress and patterns</p>
        </div>

        {/* Empty State */}
        {!hasData && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-full flex items-center justify-center mb-6 animate-gentle-pulse">
              <span className="text-5xl">📈</span>
            </div>
            <h2 className="text-2xl font-light text-white mb-3">Your Journey Begins Here</h2>
            <p className="text-white/70 max-w-md mb-6">
              Complete your first session to start tracking your wellness journey. Insights will appear here as you build your practice.
            </p>
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transition"
            >
              Start Your First Session
            </button>
          </div>
        )}

        {/* Key Metrics */}
        {hasData && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Current Streak</div>
            <div className="text-3xl font-bold text-white mb-1">🔥 {streak}</div>
            <div className="text-white/60 text-xs">consecutive days</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Total Sessions</div>
            <div className="text-3xl font-bold text-white mb-1">{insights.totalSessions}</div>
            <div className="text-white/60 text-xs">all time</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Weekly Average</div>
            <div className="text-3xl font-bold text-white mb-1">{insights.weeklyAverage}</div>
            <div className="text-white/60 text-xs">sessions/week</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Positive Mood</div>
            <div className="text-3xl font-bold text-white mb-1">{insights.positivePercentage}%</div>
            <div className="text-white/60 text-xs">last 7 days</div>
          </div>
        </div>}

        {/* Insight Message */}
        {hasData && <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-white font-semibold mb-1">Your Progress</h3>
              <p className="text-white/90 text-sm">{getInsightMessage()}</p>
            </div>
          </div>
        </div>}

        {/* Mood Trends */}
        {hasData && insights.mostCommonMood && (
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Mood Trends (Last 30 Days)</h2>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Most Common Feeling</span>
                <span className="text-white font-semibold capitalize flex items-center gap-2">
                  {getMoodEmoji(insights.mostCommonMood[0])} {insights.mostCommonMood[0]}
                </span>
              </div>
              <div className="text-white/60 text-sm">
                Appeared in {insights.mostCommonMood[1]} of {insights.last30Days.length} sessions
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="space-y-2">
              {Object.entries(
                insights.last30Days.reduce((acc, entry) => {
                  acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort((a, b) => (b[1] as number) - (a[1] as number))
                .slice(0, 5)
                .map(([mood, count]) => {
                  const percentage = Math.round(((count as number) / insights.last30Days.length) * 100);
                  return (
                    <div key={mood} className="flex items-center gap-3">
                      <span className="text-white/70 capitalize w-24 text-sm">{mood}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: MOOD_COLORS[mood.toLowerCase()] || '#64748b'
                          }}
                        />
                      </div>
                      <span className="text-white/60 text-sm w-12 text-right">{percentage}%</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Recent Sessions Timeline */}
        {hasData && insights.last7Days.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Last 7 Days</h2>
            <div className="space-y-3">
              {insights.last7Days.reverse().map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-semibold capitalize">{entry.mood}</span>
                      <span className="text-white/60 text-sm">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {entry.reflection && (
                      <p className="text-white/70 text-sm line-clamp-2">{entry.reflection}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gratitude Highlights */}
        {hasData && insights.recentGratitude.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Gratitude ✨</h2>
            <div className="flex flex-wrap gap-2">
              {insights.recentGratitude.map((entry, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-100 rounded-full text-sm border border-yellow-400/30"
                >
                  {entry.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        {hasData && <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-3">Keep Growing 🌱</h2>
          <div className="space-y-2 text-white/70 text-sm">
            <p>• Consistency matters more than perfection. You're building lasting habits.</p>
            <p>• Notice patterns without judgment. Every feeling provides valuable information.</p>
            <p>• Celebrate small wins. Each session is an act of self-care.</p>
            <p>• Your wellness journey is uniquely yours. Trust your process.</p>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default MoodInsights;
