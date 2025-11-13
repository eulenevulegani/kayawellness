import { SubliminalItem } from '../types';

export const SUBLIMINALS: SubliminalItem[] = [
  {
    title: 'Confidence Amplifier',
    description: 'Boost self-confidence and inner strength with 528Hz healing frequency',
    affirmations: [
      'I am confident and capable',
      'I trust in my abilities',
      'I radiate self-assurance',
      'I embrace my authentic self',
      'I am worthy of success',
      'My confidence grows daily',
      'I speak my truth with clarity',
      'I am powerful beyond measure'
    ],
    frequency: '528 Hz',
    durationMinutes: 30,
    category: 'confidence'
  },
  {
    title: 'Abundance Manifestation',
    description: 'Attract prosperity and abundance with 432Hz harmony frequency',
    affirmations: [
      'I am a magnet for abundance',
      'Wealth flows to me effortlessly',
      'I deserve prosperity',
      'Opportunities appear everywhere',
      'I am grateful for my blessings',
      'Money comes to me easily',
      'I create my own success',
      'The universe supports my dreams'
    ],
    frequency: '432 Hz',
    durationMinutes: 45,
    category: 'abundance'
  },
  {
    title: 'Deep Healing Journey',
    description: 'Release emotional wounds and promote inner healing with 396Hz liberation frequency',
    affirmations: [
      'I release what no longer serves me',
      'I am healing and whole',
      'My past does not define me',
      'I forgive myself and others',
      'I am worthy of healing',
      'Peace flows through me',
      'I embrace my journey',
      'Every day I grow stronger'
    ],
    frequency: '396 Hz',
    durationMinutes: 40,
    category: 'healing'
  },
  {
    title: 'Restful Sleep Induction',
    description: 'Drift into deep restorative sleep with Delta wave frequencies',
    affirmations: [
      'I am safe and relaxed',
      'Sleep comes easily to me',
      'My mind is calm and quiet',
      'I release the day with ease',
      'My body knows how to rest',
      'I trust in the night',
      'Tomorrow brings new energy',
      'I surrender to peaceful sleep'
    ],
    frequency: '2.5 Hz (Delta)',
    durationMinutes: 60,
    category: 'sleep'
  },
  {
    title: 'Laser Focus Enhancement',
    description: 'Sharpen concentration and mental clarity with Beta wave frequencies',
    affirmations: [
      'My mind is clear and focused',
      'I concentrate effortlessly',
      'Distractions fade away',
      'I am fully present',
      'My productivity is unstoppable',
      'I achieve my goals with ease',
      'My attention is powerful',
      'I work with purpose and clarity'
    ],
    frequency: '14 Hz (Beta)',
    durationMinutes: 25,
    category: 'focus'
  },
  {
    title: 'Self-Love Awakening',
    description: 'Cultivate deep self-love and acceptance with 639Hz heart frequency',
    affirmations: [
      'I love and accept myself completely',
      'I am enough exactly as I am',
      'My worth is inherent',
      'I treat myself with kindness',
      'I celebrate my uniqueness',
      'I am deserving of love',
      'I honor my needs',
      'I am my own best friend'
    ],
    frequency: '639 Hz',
    durationMinutes: 35,
    category: 'confidence'
  },
  {
    title: 'Anxiety Release',
    description: 'Dissolve anxiety and stress with 417Hz transformation frequency',
    affirmations: [
      'I am calm and centered',
      'Anxiety has no power over me',
      'I breathe in peace, exhale tension',
      'I am safe in this moment',
      'I trust the process of life',
      'Calm flows through my body',
      'I release worry and fear',
      'Serenity is my natural state'
    ],
    frequency: '417 Hz',
    durationMinutes: 30,
    category: 'healing'
  },
  {
    title: 'Morning Energy Boost',
    description: 'Start your day with vitality and motivation using Gamma wave frequencies',
    affirmations: [
      'I wake up energized and ready',
      'Today is full of possibilities',
      'My energy is boundless',
      'I embrace this new day',
      'I am motivated and inspired',
      'Vitality flows through me',
      'I am productive and purposeful',
      'I create an amazing day'
    ],
    frequency: '40 Hz (Gamma)',
    durationMinutes: 15,
    category: 'focus'
  }
];

// Helper function to get subliminals by category
export const getSubliminalsByCategory = (category: SubliminalItem['category']): SubliminalItem[] => {
  return SUBLIMINALS.filter(sub => sub.category === category);
};

// Helper function to get recommended subliminal based on mood or goal
export const getRecommendedSubliminal = (mood?: string, goal?: string): SubliminalItem => {
  const moodMap: Record<string, SubliminalItem['category']> = {
    'anxious': 'healing',
    'stressed': 'healing',
    'tired': 'sleep',
    'unfocused': 'focus',
    'unmotivated': 'confidence',
    'negative': 'confidence'
  };

  const goalMap: Record<string, SubliminalItem['category']> = {
    'sleep': 'sleep',
    'stress': 'healing',
    'focus': 'focus',
    'grounded': 'healing',
    'confidence': 'confidence',
    'abundance': 'abundance'
  };

  let targetCategory: SubliminalItem['category'] | undefined;

  if (mood && moodMap[mood.toLowerCase()]) {
    targetCategory = moodMap[mood.toLowerCase()];
  } else if (goal && goalMap[goal.toLowerCase()]) {
    targetCategory = goalMap[goal.toLowerCase()];
  }

  if (targetCategory) {
    const categoryItems = getSubliminalsByCategory(targetCategory);
    return categoryItems[Math.floor(Math.random() * categoryItems.length)];
  }

  // Default to a random subliminal
  return SUBLIMINALS[Math.floor(Math.random() * SUBLIMINALS.length)];
};
