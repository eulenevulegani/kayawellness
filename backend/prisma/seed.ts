import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create wellness programs
  const anxietyProgram = await prisma.wellnessProgram.create({
    data: {
      title: '7-Day Anxiety Relief',
      description: 'A week-long journey to find calm, build resilience, and develop healthy coping mechanisms for anxiety.',
      duration: 7,
      dailyThemes: [
        'Acknowledging Your Feelings',
        'Grounding in the Present',
        'Releasing Physical Tension',
        'Cultivating Self-Compassion',
        'Challenging Anxious Thoughts',
        'Finding Your Inner Strength',
        'Integrating Calm into Daily Life'
      ],
      category: 'Mental Health',
      difficulty: 'beginner',
      subscriptionTier: 'FREE'
    }
  });

  const sleepProgram = await prisma.wellnessProgram.create({
    data: {
      title: '5-Day Guide to Better Sleep',
      description: 'Prepare your mind and body for deep, restorative sleep with this five-day series of relaxing sessions.',
      duration: 5,
      dailyThemes: [
        'Letting Go of the Day',
        'Quieting the Mind',
        'Relaxing the Body',
        'Visualizing Restful Dreams',
        'Creating a Sleep Sanctuary'
      ],
      category: 'Sleep',
      difficulty: 'beginner',
      subscriptionTier: 'FREE'
    }
  });

  const mindfulnessProgram = await prisma.wellnessProgram.create({
    data: {
      title: '14-Day Mindfulness Journey',
      description: 'Build a sustainable mindfulness practice with daily guided meditations.',
      duration: 14,
      dailyThemes: [
        'Introduction to Mindfulness',
        'Breath Awareness',
        'Body Scan',
        'Present Moment Awareness',
        'Mindful Listening',
        'Observing Thoughts',
        'Loving-Kindness',
        'Gratitude Practice',
        'Walking Meditation',
        'Mindful Eating',
        'Acceptance',
        'Compassion',
        'Integration',
        'Commitment to Practice'
      ],
      category: 'Mindfulness',
      difficulty: 'intermediate',
      subscriptionTier: 'PREMIUM'
    }
  });

  console.log('✓ Created wellness programs');

  // Create achievements
  const achievements = await prisma.achievement.createMany({
    data: [
      {
        title: 'First Steps',
        description: 'Complete your first session',
        category: 'Getting Started',
        tier: 'bronze',
        xpReward: 50,
        requiredSessions: 1
      },
      {
        title: 'Committed',
        description: 'Complete 7 sessions',
        category: 'Progress',
        tier: 'bronze',
        xpReward: 100,
        requiredSessions: 7
      },
      {
        title: 'Dedicated',
        description: 'Complete 30 sessions',
        category: 'Progress',
        tier: 'silver',
        xpReward: 250,
        requiredSessions: 30
      },
      {
        title: 'Wellness Warrior',
        description: 'Complete 100 sessions',
        category: 'Progress',
        tier: 'gold',
        xpReward: 500,
        requiredSessions: 100
      },
      {
        title: 'Streak Master',
        description: 'Maintain a 7-day streak',
        category: 'Consistency',
        tier: 'silver',
        xpReward: 200,
        requiredStreak: 7
      },
      {
        title: 'Unstoppable',
        description: 'Maintain a 30-day streak',
        category: 'Consistency',
        tier: 'gold',
        xpReward: 500,
        requiredStreak: 30
      },
      {
        title: 'Rising Star',
        description: 'Reach level 5',
        category: 'Level',
        tier: 'silver',
        xpReward: 150,
        requiredLevel: 5
      },
      {
        title: 'Mindfulness Master',
        description: 'Reach level 10',
        category: 'Level',
        tier: 'gold',
        xpReward: 300,
        requiredLevel: 10
      }
    ]
  });

  console.log('✓ Created achievements');

  // Create sample wellness events
  const events = await prisma.wellnessEvent.createMany({
    data: [
      {
        title: 'Morning Meditation Group',
        description: 'Join us for a guided meditation session to start your day with clarity and calm.',
        category: 'MEDITATION',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '08:00 AM',
        durationMinutes: 30,
        isVirtual: true,
        meetingLink: 'https://meet.kaya.app/morning-meditation',
        hostName: 'Sarah Chen',
        hostBio: 'Certified meditation instructor with 10 years experience'
      },
      {
        title: 'Yoga for Stress Relief',
        description: 'Gentle yoga flow designed to release tension and promote relaxation.',
        category: 'YOGA',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '06:00 PM',
        durationMinutes: 60,
        isVirtual: true,
        meetingLink: 'https://meet.kaya.app/yoga-stress',
        hostName: 'Mike Rodriguez',
        hostBio: 'RYT-500 certified yoga instructor specializing in stress management'
      },
      {
        title: 'Managing Anxiety Workshop',
        description: 'Learn practical techniques to manage anxiety in daily life.',
        category: 'WORKSHOP',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '07:00 PM',
        durationMinutes: 90,
        isVirtual: true,
        maxAttendees: 50,
        meetingLink: 'https://meet.kaya.app/anxiety-workshop',
        hostName: 'Dr. Emily Watson',
        hostBio: 'Licensed psychologist specializing in anxiety disorders'
      }
    ]
  });

  console.log('✓ Created wellness events');

  // Create support groups
  const supportGroups = await prisma.supportGroup.createMany({
    data: [
      {
        name: 'Anxiety Support Circle',
        description: 'A safe space to share experiences and coping strategies for managing anxiety.',
        category: 'Mental Health',
        isPrivate: false
      },
      {
        name: 'Better Sleep Community',
        description: 'Connect with others working to improve their sleep quality.',
        category: 'Sleep',
        isPrivate: false
      },
      {
        name: 'Mindfulness Practitioners',
        description: 'For those committed to developing a regular mindfulness practice.',
        category: 'Mindfulness',
        isPrivate: false
      }
    ]
  });

  console.log('✓ Created support groups');

  // Create challenges
  const challenges = await prisma.challenge.createMany({
    data: [
      {
        title: '30-Day Meditation Challenge',
        description: 'Meditate every day for 30 days and build a lasting habit.',
        category: 'Meditation',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        goal: 30,
        goalType: 'sessions',
        rewardXP: 1000
      },
      {
        title: 'Mindful Minutes Marathon',
        description: 'Accumulate 500 minutes of mindfulness practice this month.',
        category: 'Mindfulness',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        goal: 500,
        goalType: 'minutes',
        rewardXP: 750
      }
    ]
  });

  console.log('✓ Created challenges');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
