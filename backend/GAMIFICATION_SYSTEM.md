# KAYA Gamification System Documentation

## Overview

The KAYA wellness platform now features a comprehensive gamification system that rewards users for their wellness journey. Users earn points for completing activities, maintain streaks for daily engagement, complete challenges, and redeem points for real wellness products and services from partner brands.

## Key Features

### 🎯 Points & Levels
- **Points System**: Users earn points for every wellness activity
- **Level Progression**: Experience-based leveling system with bonus rewards
- **Transaction History**: Complete audit trail of all point earnings and spending
- **Leaderboards**: Global and timeframe-based competitive rankings

### 🔥 Streaks
- **Daily Check-ins**: Maintain engagement with daily check-in rewards
- **Streak Bonuses**: Progressive bonuses at milestones (3, 7, 14, 30, 60, 100, 180, 365 days)
- **Streak Freeze**: Purchase protection to maintain streaks
- **Longest Streak Tracking**: Personal records and achievements

### 🏆 Challenges
- **Multiple Types**: Daily, Weekly, Monthly, and Milestone challenges
- **Categories**: Meditation, Journaling, Social, Wellness, Streaks
- **Auto-Tracking**: Challenges update automatically based on user activities
- **Bonus Rewards**: Early completion bonuses
- **Leaderboards**: See who completed challenges first

### 🎁 Rewards Marketplace
- **Wellness Products**: Meditation cushions, yoga mats, essential oils
- **Self-Care Items**: Bath sets, sleep masks, relaxation products
- **Experiences**: Virtual yoga classes, meditation workshops
- **Discount Coupons**: Partner store discounts
- **Premium Features**: App upgrades, ad-free experience
- **Real Partner Collabs**: Redeem points for actual products with shipping

### 📊 Leaderboards
- **Multiple Timeframes**: Daily, Weekly, Monthly, All-Time
- **Specialized Boards**: Points, Streaks, Levels, Challenge Completions
- **Top Gainers**: See fastest climbers
- **Global Statistics**: Community-wide metrics

---

## Points System

### How to Earn Points

| Activity | Points | Description |
|----------|--------|-------------|
| Session Complete | 50 | Complete a wellness session (meditation, breathwork, etc.) |
| Journal Entry | 20 | Create a journal entry |
| Mood Check-in | 10 | Log daily mood |
| Gratitude Entry | 15 | Share something you're grateful for |
| Community Post | 25 | Create a community post |
| Community Comment | 10 | Comment on a post |
| Post Like | 5 | Like a community post |
| Daily Check-in | 10 + streak bonus | Daily engagement check-in |
| Program Enrollment | 30 | Enroll in a wellness program |
| Achievement Unlock | 100 | Unlock an achievement |
| Event Registration | 20 | Register for an event |
| Event Attendance | 50 | Attend an event |
| Therapist Session | 75 | Complete therapist session |
| Profile Complete | 50 | Complete your profile |
| Friend Referral | 200 | Refer a friend who signs up |

### Level System

- **Level Formula**: `Level = floor(sqrt(XP / 100)) + 1`
- **Level Up Bonus**: 50 points × level number
- **XP Requirement Increases**: Each level requires more XP than the last
- **Example Progression**:
  - Level 1: 0 XP
  - Level 2: 100 XP
  - Level 3: 400 XP
  - Level 4: 900 XP
  - Level 5: 1,600 XP

---

## Streaks System

### Daily Check-ins

Users must check in daily to maintain their streak. Missing a day breaks the streak.

### Streak Milestones & Bonuses

| Days | Bonus Points | Milestone |
|------|--------------|-----------|
| 3 | 20 | First milestone |
| 7 | 50 | 1 week |
| 14 | 100 | 2 weeks |
| 30 | 200 | 1 month |
| 60 | 400 | 2 months |
| 100 | 750 | 100 days! |
| 180 | 1,500 | Half year |
| 365 | 3,000 | Full year! |

### Streak Freeze

- **Cost**: 100 points
- **Effect**: Extends last check-in by 1 day to prevent streak loss
- **Use Case**: Traveling, busy days, or emergencies

---

## Challenges System

### Challenge Types

#### Daily Challenges
- Reset every day
- Quick, achievable goals
- Examples:
  - "5-Minute Meditation Master" (5 sessions) - 100 points
  - "Gratitude Warrior" (3 entries) - 50 points

#### Weekly Challenges
- Reset every Monday
- Moderate commitment
- Examples:
  - "Consistency Champion" (7-day streak) - 300 + 100 bonus
  - "Community Connector" (5 posts) - 200 points
  - "Journal Journey" (10 entries) - 250 points

#### Monthly Challenges
- Reset on the 1st of each month
- Long-term goals
- Examples:
  - "Meditation Marathon" (30 sessions) - 1,000 + 500 bonus
  - "Wellness Warrior" (50 activities) - 1,500 points

#### Milestone Challenges
- One-time achievements
- Permanent progress
- Examples:
  - "First Steps" (1 session) - 50 points
  - "Century Club" (100 sessions) - 2,000 points

### Challenge Categories

- **MEDITATION**: Meditation and mindfulness activities
- **JOURNALING**: Journal entries and reflection
- **SOCIAL**: Community engagement
- **WELLNESS**: General wellness activities
- **STREAKS**: Daily consistency

---

## Rewards Marketplace

### Reward Categories

#### Wellness Products
Physical products shipped to users:
- Meditation Cushion (5,000 points)
- Aromatherapy Essential Oil Set (3,000 points)
- Yoga Mat Premium (4,000 points)

#### Self-Care
Relaxation and personal care items:
- Luxury Bath Set (2,500 points)
- Sleep Mask & Earplugs Set (1,500 points)

#### Experiences
Virtual classes and workshops:
- Virtual Yoga Class Pass (2,000 points)
- Guided Meditation Workshop (1,800 points)

#### Discount Coupons
Partner store discounts:
- 20% Off Wellness Store (500 points)
- $10 Off Next Purchase (800 points)

#### Premium Features
App upgrades:
- 1 Month Premium Upgrade (3,000 points)
- Ad-Free Experience for 6 months (2,000 points)

### Redemption Process

1. Browse rewards marketplace
2. Check available points
3. Select reward and provide shipping info (if physical product)
4. Confirm redemption
5. Points deducted immediately
6. Redemption status: PENDING → APPROVED → SHIPPED → DELIVERED
7. Can cancel pending redemptions for full refund

### Partner Brands (Examples)

- **ZenSpace**: Meditation products
- **PureEssence**: Essential oils
- **FlowYoga**: Yoga equipment
- **Serenity Spa**: Bath and relaxation
- **RestWell**: Sleep products
- **YogaFlow Online**: Virtual classes
- **MindfulPath**: Meditation workshops
- **WellnessHub**: General wellness store
- **HealthyLife**: Healthy living products

---

## API Endpoints

### Points

```
GET    /api/v1/gamification/points/summary          Get user's points summary
GET    /api/v1/gamification/points/transactions     Get transaction history
GET    /api/v1/gamification/points/leaderboard      Get points leaderboard
GET    /api/v1/gamification/points/rank             Get user's rank
```

### Streaks

```
POST   /api/v1/gamification/streaks/checkin         Daily check-in
GET    /api/v1/gamification/streaks/current         Get current streak info
GET    /api/v1/gamification/streaks/history         Get streak history
POST   /api/v1/gamification/streaks/freeze          Use streak freeze
GET    /api/v1/gamification/streaks/needs-checkin   Check if needs check-in
GET    /api/v1/gamification/streaks/leaderboard     Get streak leaderboard
```

### Challenges

```
GET    /api/v1/gamification/challenges              Get active challenges
GET    /api/v1/gamification/challenges/my-challenges Get user's challenges
GET    /api/v1/gamification/challenges/:id          Get challenge details
POST   /api/v1/gamification/challenges/:id/enroll   Enroll in challenge
POST   /api/v1/gamification/challenges/:id/progress Update progress
GET    /api/v1/gamification/challenges/:id/leaderboard Get challenge leaderboard
GET    /api/v1/gamification/challenges/:id/stats    Get challenge statistics
```

### Rewards

```
GET    /api/v1/gamification/rewards                 Get all rewards
GET    /api/v1/gamification/rewards/featured        Get featured rewards
GET    /api/v1/gamification/rewards/affordable      Get affordable rewards
GET    /api/v1/gamification/rewards/popular         Get popular rewards
GET    /api/v1/gamification/rewards/search?q=       Search rewards
GET    /api/v1/gamification/rewards/:id             Get reward details
POST   /api/v1/gamification/rewards/:id/redeem      Redeem a reward
GET    /api/v1/gamification/rewards/redemptions/my  Get user's redemptions
POST   /api/v1/gamification/rewards/redemptions/:id/cancel Cancel redemption
GET    /api/v1/gamification/rewards/:id/stats       Get reward statistics
```

### Leaderboards

```
GET    /api/v1/gamification/leaderboard?timeframe=  Get leaderboard (DAILY, WEEKLY, MONTHLY, ALL_TIME)
GET    /api/v1/gamification/leaderboard/my-position Get user's position
GET    /api/v1/gamification/leaderboard/top-gainers Get top gainers
GET    /api/v1/gamification/leaderboard/streaks     Get streak leaderboard
GET    /api/v1/gamification/leaderboard/levels      Get level leaderboard
GET    /api/v1/gamification/leaderboard/challenges  Get challenge completion leaderboard
GET    /api/v1/gamification/leaderboard/stats/global Get global statistics
GET    /api/v1/gamification/leaderboard/stats/my    Get user achievements summary
```

---

## Database Models

### UserPoints
Tracks user's point balance and statistics.

```typescript
{
  id: string
  userId: string (unique)
  totalPoints: number
  availablePoints: number
  lifetimeEarned: number
  lifetimeSpent: number
  currentStreak: number
  longestStreak: number
  lastCheckIn: DateTime
  level: number
  experiencePoints: number
}
```

### PointTransaction
Records all point earning and spending.

```typescript
{
  id: string
  userId: string
  userPointsId: string
  points: number (positive = earned, negative = spent)
  reason: string
  description: string
  metadata: JSON
  createdAt: DateTime
}
```

### Streak
Tracks streak history.

```typescript
{
  id: string
  userId: string
  streakCount: number
  lastCheckInDate: DateTime
  streakStartDate: DateTime
  isBroken: boolean
  streakBonusPoints: number
  milestones: JSON (array of achieved milestones)
}
```

### Challenge
Challenge definitions.

```typescript
{
  id: string
  title: string
  description: string
  type: ChallengeType (DAILY, WEEKLY, MONTHLY, MILESTONE)
  requiredCount: number
  pointReward: number
  bonusReward: number
  icon: string
  difficulty: string
  category: string
  startDate: DateTime
  endDate: DateTime
  isActive: boolean
}
```

### UserChallenge
User's progress on challenges.

```typescript
{
  id: string
  userId: string
  challengeId: string
  status: ChallengeStatus (ACTIVE, COMPLETED, EXPIRED, LOCKED)
  progress: number
  completedAt: DateTime
  pointsEarned: number
}
```

### Reward
Reward definitions.

```typescript
{
  id: string
  title: string
  description: string
  category: RewardCategory
  brand: string
  pointCost: number
  stockQuantity: number (null = unlimited)
  imageUrl: string
  terms: string
  expiryDate: DateTime
  isActive: boolean
  isFeatured: boolean
  redemptionLimit: number
  metadata: JSON
}
```

### Redemption
User's reward redemptions.

```typescript
{
  id: string
  userId: string
  rewardId: string
  pointsSpent: number
  status: RedemptionStatus (PENDING, APPROVED, SHIPPED, DELIVERED, CANCELLED)
  shippingAddress: JSON
  trackingNumber: string
  couponCode: string
  notes: string
  redeemedAt: DateTime
}
```

### Leaderboard
Cached leaderboard rankings.

```typescript
{
  id: string
  userId: string
  username: string
  totalPoints: number
  currentStreak: number
  level: number
  rank: number
  timeframe: string (DAILY, WEEKLY, MONTHLY, ALL_TIME)
}
```

---

## Integration Guide

### Automatic Point Awarding

Use the `GamificationHook` middleware to automatically award points when users complete activities:

```typescript
import { GamificationHook } from '../middleware/gamification.hook.js';

// After session completion
await GamificationHook.onSessionComplete(userId, sessionData);

// After journal entry
await GamificationHook.onJournalEntry(userId, entryData);

// After mood check-in
await GamificationHook.onMoodCheckIn(userId, moodData);

// And so on for other activities...
```

### Manual Point Awarding

```typescript
import { PointsService } from '../services/points.service.js';

await PointsService.awardActivityPoints(userId, 'CUSTOM_ACTIVITY', {
  customField: 'value'
});
```

---

## Seeding Initial Data

Run these functions to populate initial challenges and rewards:

```typescript
import { ChallengeService } from './services/challenge.service.js';
import { RewardService } from './services/reward.service.js';

// Seed challenges
await ChallengeService.seedChallenges();

// Seed rewards
await RewardService.seedRewards();
```

---

## Maintenance Tasks

### Update Leaderboards

Run periodically (recommended: every hour via cron):

```typescript
import { LeaderboardService } from './services/leaderboard.service.js';

await LeaderboardService.updateLeaderboards();
```

### Expire Old Challenges

Run daily to mark expired challenges:

```typescript
import { ChallengeService } from './services/challenge.service.js';

await ChallengeService.expireOldChallenges();
```

---

## Future Enhancements

- **Teams/Guilds**: Collaborative challenges
- **Seasons**: Seasonal events and limited-time rewards
- **Badges**: Visual achievements
- **Social Features**: Gift points, challenge friends
- **Daily Quests**: Rotating daily objectives
- **Achievement Tiers**: Bronze, Silver, Gold, Platinum
- **Point Multipliers**: Temporary boost events
- **VIP Tiers**: Exclusive rewards for top users

---

## Partner Integration

To add new reward partners:

1. Create reward in database with partner details
2. Set up fulfillment process (shipping, coupon generation, etc.)
3. Mark as featured if desired
4. Monitor redemption stats via admin dashboard

---

## Support

For questions or issues with the gamification system, contact the development team or refer to the main KAYA documentation.
