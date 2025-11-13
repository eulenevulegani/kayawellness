import React, { useState, useEffect } from 'react';
import { StarIcon, FlameIcon, LockClosedIcon } from './Icons';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'MILESTONE';
  requiredCount: number;
  pointReward: number;
  icon: string;
  difficulty: string;
  category: string;
  progress?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'LOCKED';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  pointCost: number;
  imageUrl?: string;
  isFeatured: boolean;
}

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  nextMilestone?: {
    days: number;
    bonus: number;
  };
  needsCheckIn: boolean;
}

interface GamificationDashboardProps {
  onBack: () => void;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'rewards' | 'leaderboard'>('overview');
  const [loading, setLoading] = useState(false);
  
  // Mock data - replace with API calls
  const [pointsData, setPointsData] = useState({
    totalPoints: 1250,
    availablePoints: 850,
    lifetimeEarned: 1650,
    lifetimeSpent: 400,
    rank: 42,
  });

  const [streakData, setStreakData] = useState<StreakInfo>({
    currentStreak: 7,
    longestStreak: 14,
    nextMilestone: { days: 14, bonus: 100 },
    needsCheckIn: false,
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: '5-Minute Meditation Master',
      description: 'Complete 5 meditation sessions today',
      type: 'DAILY',
      requiredCount: 5,
      pointReward: 100,
      icon: '🧘',
      difficulty: 'MEDIUM',
      category: 'MEDITATION',
      progress: 2,
      status: 'ACTIVE',
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day streak',
      type: 'WEEKLY',
      requiredCount: 7,
      pointReward: 300,
      icon: '🔥',
      difficulty: 'MEDIUM',
      category: 'STREAKS',
      progress: 7,
      status: 'COMPLETED',
    },
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Premium Meditation Cushion',
      description: 'Ergonomic zafu cushion for comfortable practice',
      category: 'WELLNESS_PRODUCT',
      brand: 'ZenSpace',
      pointCost: 5000,
      isFeatured: true,
    },
    {
      id: '2',
      title: '1 Month Premium',
      description: 'Unlock all premium features for 30 days',
      category: 'PREMIUM_FEATURE',
      brand: 'KAYA',
      pointCost: 3000,
      isFeatured: true,
    },
  ]);

  const handleCheckIn = async () => {
    // TODO: API call to check in
    setStreakData(prev => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
      needsCheckIn: false,
    }));
  };

  // Next milestone thresholds
  const milestones = [1000, 2500, 5000, 10000, 25000];
  const nextMilestone = milestones.find(m => m > pointsData.totalPoints) || 50000;
  const previousMilestone = milestones.reverse().find(m => m <= pointsData.totalPoints) || 0;
  
  const calculateMilestoneProgress = () => {
    if (nextMilestone === 50000 && pointsData.totalPoints >= 25000) return 100;
    const progress = ((pointsData.totalPoints - previousMilestone) / (nextMilestone - previousMilestone)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-700 text-white p-6 pt-24 overflow-y-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={onBack}
          className="text-white/70 hover:text-white mb-4 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-light mb-2">Your Wellness Journey</h1>
        <p className="text-white/70 text-sm">Track your progress, complete challenges, and earn rewards</p>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex gap-2 bg-white/10 rounded-full p-1">
          {(['overview', 'challenges', 'rewards', 'leaderboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-2 rounded-full transition ${
                activeTab === tab
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/90'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Points Card */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <StarIcon className="w-8 h-8 text-cyan-400" />
                  <div>
                    <div className="text-3xl font-bold">{pointsData.availablePoints.toLocaleString()}</div>
                    <div className="text-sm text-white/60">Available Points</div>
                  </div>
                </div>
                <div className="text-xs text-white/50 mb-2">
                  Total Earned: {pointsData.lifetimeEarned.toLocaleString()} • Spent: {pointsData.lifetimeSpent.toLocaleString()}
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all"
                    style={{ width: `${calculateMilestoneProgress()}%` }}
                  />
                </div>
                <div className="text-xs text-white/60">
                  {nextMilestone > pointsData.totalPoints 
                    ? `${(nextMilestone - pointsData.totalPoints).toLocaleString()} to ${nextMilestone.toLocaleString()} milestone`
                    : '🎉 Max milestone reached!'}
                  {' • '}Rank #{pointsData.rank}
                </div>
              </div>

              {/* Streak Card */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FlameIcon className="w-8 h-8 text-orange-400" />
                  <div>
                    <div className="text-3xl font-bold">{streakData.currentStreak}</div>
                    <div className="text-sm text-white/60">Day Streak</div>
                  </div>
                </div>
                <div className="text-xs text-white/50 mb-3">
                  Best: {streakData.longestStreak} days
                </div>
                {streakData.needsCheckIn ? (
                  <button
                    onClick={handleCheckIn}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 font-semibold transition"
                  >
                    Check In Now
                  </button>
                ) : (
                  <div className="text-xs text-white/60">
                    ✓ Checked in today • Next milestone: {streakData.nextMilestone?.days} days (+{streakData.nextMilestone?.bonus} pts)
                  </div>
                )}
              </div>

              {/* Milestones Card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Milestones</h3>
                <div className="space-y-3">
                  {[1000, 2500, 5000, 10000, 25000].map((milestone) => (
                    <div key={milestone} className="flex justify-between items-center">
                      <span className="text-white/70">{milestone.toLocaleString()} pts</span>
                      <span className={`font-semibold ${
                        pointsData.totalPoints >= milestone 
                          ? 'text-green-400' 
                          : pointsData.totalPoints >= milestone * 0.8 
                          ? 'text-yellow-400' 
                          : 'text-white/50'
                      }`}>
                        {pointsData.totalPoints >= milestone ? '✓ Unlocked' : 'Locked'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Challenges Preview */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Active Challenges</h3>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className="text-sm text-white/70 hover:text-white"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.filter(c => c.status === 'ACTIVE').slice(0, 2).map((challenge) => (
                  <div key={challenge.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{challenge.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{challenge.title}</h4>
                        <p className="text-sm text-white/70 mb-2">{challenge.description}</p>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                            style={{ width: `${((challenge.progress || 0) / challenge.requiredCount) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>{challenge.progress}/{challenge.requiredCount}</span>
                          <span>+{challenge.pointReward} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Rewards */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Featured Rewards</h3>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="text-sm text-white/70 hover:text-white"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.filter(r => r.isFeatured).map((reward) => (
                  <div key={reward.id} className="bg-white/5 rounded-xl p-4">
                    <div className="mb-2">
                      <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full">
                        {reward.brand}
                      </span>
                    </div>
                    <h4 className="font-semibold mb-1">{reward.title}</h4>
                    <p className="text-sm text-white/70 mb-3">{reward.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-yellow-400">{reward.pointCost.toLocaleString()} pts</span>
                      <button
                        className={`px-4 py-1 rounded-lg text-sm font-semibold transition ${
                          pointsData.availablePoints >= reward.pointCost
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-white/10 text-white/50 cursor-not-allowed'
                        }`}
                        disabled={pointsData.availablePoints < reward.pointCost}
                      >
                        {pointsData.availablePoints >= reward.pointCost ? 'Redeem' : <LockClosedIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">All Challenges</h2>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{challenge.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{challenge.title}</h3>
                          <p className="text-sm text-white/70">{challenge.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          challenge.status === 'COMPLETED'
                            ? 'bg-green-500/30 text-green-200'
                            : challenge.status === 'ACTIVE'
                            ? 'bg-blue-500/30 text-blue-200'
                            : 'bg-gray-500/30 text-gray-200'
                        }`}>
                          {challenge.status}
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs text-white/60 mb-3">
                        <span className="bg-white/10 px-2 py-1 rounded">{challenge.type}</span>
                        <span className="bg-white/10 px-2 py-1 rounded">{challenge.difficulty}</span>
                        <span className="bg-white/10 px-2 py-1 rounded">+{challenge.pointReward} pts</span>
                      </div>
                      {challenge.status === 'ACTIVE' && (
                        <>
                          <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                            <div
                              className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full"
                              style={{ width: `${((challenge.progress || 0) / challenge.requiredCount) * 100}%` }}
                            />
                          </div>
                          <div className="text-sm text-white/70">
                            {challenge.progress}/{challenge.requiredCount} completed
                          </div>
                        </>
                      )}
                      {challenge.status === 'COMPLETED' && (
                        <div className="text-sm text-green-400">✓ Completed • {challenge.pointReward} pts earned</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-2">Rewards Marketplace</h2>
              <p className="text-white/70">Redeem your points for real wellness products from our partner brands</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  {reward.isFeatured && (
                    <div className="mb-3">
                      <span className="text-xs bg-yellow-500/30 text-yellow-200 px-2 py-1 rounded-full">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                  <div className="mb-3">
                    <span className="text-sm text-white/70">{reward.brand}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{reward.title}</h3>
                  <p className="text-sm text-white/70 mb-4">{reward.description}</p>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-yellow-400">
                        {reward.pointCost.toLocaleString()}
                      </span>
                      <button
                        className={`px-4 py-1 rounded-lg text-sm font-semibold transition ${
                          pointsData.availablePoints >= reward.pointCost
                            ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 hover:opacity-90'
                            : 'bg-white/10 text-white/50 cursor-not-allowed'
                        }`}
                        disabled={pointsData.availablePoints < reward.pointCost}
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Global Leaderboard</h2>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div
                  key={rank}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    rank === pointsData.rank ? 'bg-purple-500/30 border border-purple-500/50' : 'bg-white/5'
                  }`}
                >
                  <div className="text-2xl font-bold text-white/50 w-8">{rank}</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full" />
                  <div className="flex-1">
                    <div className="font-semibold">User {rank}</div>
                    <div className="text-sm text-white/60">{(15 - rank)} day streak</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-400">{(5000 - rank * 500).toLocaleString()}</div>
                    <div className="text-xs text-white/60">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationDashboard;
