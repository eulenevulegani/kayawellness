import React, { useState } from 'react';
import { WellnessResource } from '../types';
import { ArrowLeftIcon } from './Icons';

interface WellnessResourcesProps {
  subscriptionTier: 'free' | 'premium';
  onBack: () => void;
}

// Sample resources data
const SAMPLE_RESOURCES: WellnessResource[] = [
  {
    id: '1',
    title: '24/7 Crisis Support',
    type: 'crisis-support',
    category: 'Emergency',
    description: 'Immediate help for mental health emergencies. You are not alone.',
    content: `
**National Suicide Prevention Lifeline:** 988 (call or text)
**Crisis Text Line:** Text HOME to 741741
**SAMHSA National Helpline:** 1-800-662-4357 (Free, confidential, 24/7)
**Veterans Crisis Line:** 988 then press 1

**If you are in immediate danger, call 911**

These services provide free, confidential support 24/7/365.
    `,
    isPremium: false,
    tags: ['crisis', 'emergency', 'urgent']
  },
  {
    id: '2',
    title: 'Understanding Anxiety: A Complete Guide',
    type: 'article',
    category: 'Mental Health',
    description: 'Learn about anxiety disorders, symptoms, and evidence-based coping strategies.',
    content: `Anxiety is a natural response to stress, but when it becomes overwhelming...`,
    duration: 8,
    isPremium: false,
    tags: ['anxiety', 'education', 'coping-skills']
  },
  {
    id: '3',
    title: 'The Science of Sleep',
    type: 'video',
    category: 'Sleep',
    description: 'Expert explains how sleep affects mental health and practical tips for better rest.',
    url: 'https://example.com/video',
    duration: 15,
    isPremium: false,
    tags: ['sleep', 'science', 'video']
  },
  {
    id: '4',
    title: 'Mindfulness in Daily Life',
    type: 'podcast',
    category: 'Mindfulness',
    description: 'Learn practical ways to incorporate mindfulness into your everyday routine.',
    url: 'https://example.com/podcast',
    duration: 25,
    isPremium: true,
    tags: ['mindfulness', 'daily-practice', 'audio']
  },
  {
    id: '5',
    title: 'Thought Record Worksheet',
    type: 'tool',
    category: 'Self-Help',
    description: 'Worksheet to identify and challenge unhelpful thought patterns and reframe them.',
    content: `Use this worksheet to track and reframe unhelpful thoughts...`,
    isPremium: false,
    tags: ['worksheet', 'self-help']
  },
  {
    id: '6',
    title: 'Building Emotional Resilience',
    type: 'article',
    category: 'Personal Growth',
    description: 'Develop the skills to bounce back from life\'s challenges stronger than before.',
    content: `Resilience is not about avoiding difficulties...`,
    duration: 12,
    isPremium: true,
    tags: ['resilience', 'growth', 'strength']
  },
  {
    id: '7',
    title: 'Guided Body Scan for Stress Relief',
    type: 'video',
    category: 'Relaxation',
    description: '20-minute guided practice to release physical tension and calm your mind.',
    url: 'https://example.com/body-scan',
    duration: 20,
    isPremium: false,
    tags: ['relaxation', 'body-scan', 'stress-relief']
  },
  {
    id: '8',
    title: 'Navigating Difficult Conversations',
    type: 'article',
    category: 'Relationships',
    description: 'Communication strategies for healthy, productive discussions about challenging topics.',
    content: `Difficult conversations are inevitable...`,
    duration: 10,
    isPremium: true,
    tags: ['communication', 'relationships', 'conflict']
  },
  {
    id: '9',
    title: 'Gratitude Journal Template',
    type: 'tool',
    category: 'Positive Psychology',
    description: 'Structured template to cultivate gratitude and positive thinking daily.',
    content: `Research shows gratitude practices improve mental health...`,
    isPremium: false,
    tags: ['gratitude', 'journal', 'positive']
  },
  {
    id: '10',
    title: 'Depression: When to Seek Help',
    type: 'article',
    category: 'Mental Health',
    description: 'Recognize the signs of clinical depression and understand your treatment options.',
    content: `Depression is more than just feeling sad...`,
    duration: 6,
    isPremium: false,
    tags: ['depression', 'awareness', 'treatment']
  }
];

const TYPE_ICONS: Record<WellnessResource['type'], string> = {
  'article': '📄',
  'video': '🎥',
  'podcast': '🎧',
  'tool': '🛠️',
  'crisis-support': '🆘'
};

const WellnessResources: React.FC<WellnessResourcesProps> = ({ subscriptionTier, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = Array.from(new Set(SAMPLE_RESOURCES.map(r => r.category)));
  
  const filteredResources = SAMPLE_RESOURCES.filter(resource => {
    if (selectedCategory !== 'all' && resource.category !== selectedCategory) return false;
    if (selectedType !== 'all' && resource.type !== selectedType) return false;
    return true;
  });

  // Prioritize crisis support at the top
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (a.type === 'crisis-support') return -1;
    if (b.type === 'crisis-support') return 1;
    return 0;
  });

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-light text-white">Galaxy</h1>
          <p className="text-white/70 text-sm">Your universe of wellness tools and resources</p>
        </div>

        {/* Crisis Banner - Always Visible */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-400/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🆘</span>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Need Immediate Help?</h3>
              <p className="text-white/90 text-sm mb-2">If you're in crisis, help is available right now.</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <a href="tel:988" className="px-3 py-1.5 bg-white text-red-600 rounded-lg font-semibold hover:bg-white/90 transition">
                  Call/Text 988
                </a>
                <button 
                  onClick={() => setExpandedId('1')}
                  className="px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                >
                  More Crisis Resources
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10">
          <div className="mb-3">
            <label className="text-white/70 text-sm mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  selectedCategory === 'all' ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    selectedCategory === category ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Type</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  selectedType === 'all' ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                All Types
              </button>
              {Object.entries(TYPE_ICONS).map(([type, icon]) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    selectedType === type ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {icon} {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {sortedResources.map((resource) => {
            const isLocked = resource.isPremium && subscriptionTier !== 'premium';
            
            return (
              <div
                key={resource.id}
                className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/30 transition overflow-hidden ${
                  resource.type === 'crisis-support' ? 'ring-2 ring-red-400/50' : ''
                }`}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2 flex-1">
                      <span className="text-2xl">{TYPE_ICONS[resource.type]}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{resource.title}</h3>
                        <span className="inline-block px-2 py-1 bg-white/10 text-white/80 rounded text-xs">
                          {resource.category}
                        </span>
                      </div>
                    </div>
                    {isLocked && (
                      <span className="px-2 py-1 bg-white/10 text-white rounded text-xs font-semibold">
                        🔒 Premium
                      </span>
                    )}
                  </div>

                  {/* Duration */}
                  {resource.duration && (
                    <p className="text-white/60 text-sm mb-2">
                      ⏱️ {resource.duration} min read
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-white/70 text-sm mb-3">{resource.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {resource.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/5 text-white/60 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Content (if expanded) */}
                  {expandedId === resource.id && resource.content && (
                    <div className="mb-3 p-3 bg-white/5 rounded-lg text-white/80 text-sm whitespace-pre-line border border-white/10">
                      {resource.content}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-white/10">
                    {resource.content && (
                      <button
                        onClick={() => setExpandedId(expandedId === resource.id ? null : resource.id)}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition flex-1"
                      >
                        {expandedId === resource.id ? 'Hide' : 'View'}
                      </button>
                    )}
                    {resource.url && (
                      <button
                        disabled={isLocked}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 ${
                          isLocked 
                            ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 hover:opacity-90'
                        }`}
                      >
                        {isLocked ? '🔒 Upgrade' : 'Access'}
                      </button>
                    )}
                    {!resource.url && !resource.content && (
                      <button
                        disabled={isLocked}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 ${
                          isLocked 
                            ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 hover:opacity-90'
                        }`}
                      >
                        {isLocked ? '🔒 Upgrade' : 'Download'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg mb-2">No resources found</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessResources;
