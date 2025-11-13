import { AffirmationItem } from '../types';

export const AFFIRMATIONS: AffirmationItem[] = [
  // Self-Esteem & Confidence
  {
    text: 'I am worthy of love, success, and happiness.',
    category: 'self-esteem'
  },
  {
    text: 'I trust myself to make the right decisions.',
    category: 'self-esteem'
  },
  {
    text: 'I am confident in my abilities and talents.',
    category: 'self-esteem'
  },
  {
    text: 'I embrace my uniqueness and celebrate who I am.',
    category: 'self-esteem'
  },
  {
    text: 'My voice matters, and I speak my truth with confidence.',
    category: 'self-esteem'
  },

  // Sleep & Rest
  {
    text: 'My body knows how to rest deeply and peacefully.',
    category: 'sleep'
  },
  {
    text: 'I release the day and welcome restorative sleep.',
    category: 'sleep'
  },
  {
    text: 'Sleep comes easily and naturally to me.',
    category: 'sleep'
  },
  {
    text: 'I wake refreshed and energized each morning.',
    category: 'sleep'
  },
  {
    text: 'My mind is calm, my body is relaxed, and I drift into peaceful dreams.',
    category: 'sleep'
  },

  // Focus & Clarity
  {
    text: 'My mind is clear, focused, and sharp.',
    category: 'focus'
  },
  {
    text: 'I concentrate easily on the task at hand.',
    category: 'focus'
  },
  {
    text: 'Distractions fade as I enter a state of deep focus.',
    category: 'focus'
  },
  {
    text: 'I accomplish my goals with clarity and purpose.',
    category: 'focus'
  },
  {
    text: 'My attention is a powerful tool, and I direct it intentionally.',
    category: 'focus'
  },

  // Gratitude & Appreciation
  {
    text: 'I am grateful for the abundance in my life.',
    category: 'gratitude'
  },
  {
    text: 'Every day brings new blessings and opportunities.',
    category: 'gratitude'
  },
  {
    text: 'I appreciate the small joys and moments of beauty around me.',
    category: 'gratitude'
  },
  {
    text: 'Gratitude flows naturally from my heart.',
    category: 'gratitude'
  },
  {
    text: 'I see the good in myself, others, and the world.',
    category: 'gratitude'
  },

  // Motivation & Energy
  {
    text: 'I am filled with energy and enthusiasm for life.',
    category: 'motivation'
  },
  {
    text: 'Each day is a fresh start and a new opportunity.',
    category: 'motivation'
  },
  {
    text: 'I am motivated to pursue my dreams and passions.',
    category: 'motivation'
  },
  {
    text: 'Challenges inspire me to grow stronger.',
    category: 'motivation'
  },
  {
    text: 'I have the power to create positive change in my life.',
    category: 'motivation'
  },

  // Calm & Peace
  {
    text: 'I am at peace with where I am right now.',
    author: 'Kaya Wellness'
  },
  {
    text: 'Calm is my natural state of being.',
    author: 'Kaya Wellness'
  },
  {
    text: 'I breathe in peace, I breathe out tension.',
    author: 'Kaya Wellness'
  },
  {
    text: 'I release what I cannot control and embrace what I can.',
    author: 'Kaya Wellness'
  },
  {
    text: 'Serenity flows through every cell of my body.',
    author: 'Kaya Wellness'
  },

  // General Wellness
  {
    text: 'I honor my body, mind, and spirit.',
    author: 'Kaya Wellness'
  },
  {
    text: 'I am becoming the best version of myself.',
    author: 'Kaya Wellness'
  },
  {
    text: 'I choose thoughts that uplift and empower me.',
    author: 'Kaya Wellness'
  },
  {
    text: 'I am resilient, strong, and capable.',
    author: 'Kaya Wellness'
  },
  {
    text: 'I radiate love, light, and positive energy.',
    author: 'Kaya Wellness'
  }
];

// Helper functions
export const getAffirmationsByCategory = (category: AffirmationItem['category']): AffirmationItem[] => {
  return AFFIRMATIONS.filter(aff => aff.category === category);
};

export const getRandomAffirmation = (category?: AffirmationItem['category']): AffirmationItem => {
  const pool = category ? getAffirmationsByCategory(category) : AFFIRMATIONS;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getDailyAffirmation = (): AffirmationItem => {
  // Use date as seed for consistent daily affirmation
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % AFFIRMATIONS.length;
  return AFFIRMATIONS[index];
};

export const getAffirmationForMood = (mood: string): AffirmationItem => {
  // Map moods to categories
  const moodMap: Record<string, AffirmationItem['category']> = {
    'stressed': 'sleep',
    'anxious': 'sleep',
    'tired': 'motivation',
    'unmotivated': 'motivation',
    'sad': 'self-esteem',
    'overwhelmed': 'focus',
    'scattered': 'focus',
    'peaceful': 'gratitude',
    'content': 'gratitude',
    'energized': 'motivation'
  };

  const category = moodMap[mood.toLowerCase()];
  return category ? getRandomAffirmation(category) : getRandomAffirmation();
};
