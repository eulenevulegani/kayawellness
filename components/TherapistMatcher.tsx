import React, { useState, useMemo } from 'react';
import { Therapist, UserProfile } from '../types';
import { ArrowLeftIcon, StarIcon } from './Icons';

interface TherapistMatcherProps {
  userProfile: UserProfile;
  onBack: () => void;
}

// Sample therapist data - in production, this would come from an API
const SAMPLE_THERAPISTS: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    title: 'Licensed Clinical Psychologist',
    specializations: ['Anxiety', 'Depression', 'Stress Management', 'Cognitive Behavioral Therapy'],
    approach: ['CBT', 'Mindfulness-Based', 'Solution-Focused'],
    languages: ['English', 'Spanish'],
    availability: 'accepting',
    acceptsInsurance: true,
    virtualSessions: true,
    inPersonSessions: true,
    location: { city: 'Seattle', state: 'WA', distance: 2.5 },
    bio: 'Specializing in anxiety and depression with over 12 years of experience. I use evidence-based approaches tailored to your unique needs.',
    experience: 12,
    rating: 4.9,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Michael Chen, LMFT',
    title: 'Licensed Marriage & Family Therapist',
    specializations: ['Relationships', 'Work-Life Balance', 'Stress Management', 'Self-Esteem'],
    approach: ['Emotionally Focused Therapy', 'Systemic Therapy', 'Narrative Therapy'],
    languages: ['English', 'Mandarin'],
    availability: 'waitlist',
    acceptsInsurance: true,
    virtualSessions: true,
    inPersonSessions: false,
    bio: 'Helping individuals and couples navigate life transitions and build stronger relationships through compassionate, evidence-based care.',
    experience: 8,
    rating: 4.8,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Dr. Amara Patel',
    title: 'Clinical Psychologist',
    specializations: ['Anxiety', 'Trauma', 'Mindfulness', 'Cultural Identity'],
    approach: ['EMDR', 'Somatic Therapy', 'Integrative'],
    languages: ['English', 'Hindi', 'Gujarati'],
    availability: 'accepting',
    acceptsInsurance: false,
    virtualSessions: true,
    inPersonSessions: true,
    location: { city: 'Portland', state: 'OR', distance: 5.1 },
    bio: 'Integrative approach combining traditional therapy with mindfulness and somatic practices. Culturally sensitive care for diverse backgrounds.',
    experience: 10,
    rating: 5.0,
    reviewCount: 67
  },
  {
    id: '4',
    name: 'James Rodriguez, LCSW',
    title: 'Licensed Clinical Social Worker',
    specializations: ['Depression', 'Life Transitions', 'Self-Esteem', 'Resilience Building'],
    approach: ['Person-Centered', 'Strengths-Based', 'Motivational Interviewing'],
    languages: ['English', 'Spanish'],
    availability: 'accepting',
    acceptsInsurance: true,
    virtualSessions: true,
    inPersonSessions: true,
    location: { city: 'San Francisco', state: 'CA', distance: 1.2 },
    bio: 'Compassionate support through life\'s challenges. I believe in your inherent strength and ability to grow.',
    experience: 6,
    rating: 4.7,
    reviewCount: 52
  },
  {
    id: '5',
    name: 'Dr. Emily Thompson',
    title: 'Psychiatrist',
    specializations: ['Anxiety', 'Depression', 'Medication Management', 'Sleep Disorders'],
    approach: ['Integrative Psychiatry', 'Holistic Care', 'Evidence-Based'],
    languages: ['English'],
    availability: 'full',
    acceptsInsurance: true,
    virtualSessions: true,
    inPersonSessions: false,
    bio: 'Combining medication management with holistic wellness approaches for comprehensive mental health care.',
    experience: 15,
    rating: 4.9,
    reviewCount: 143
  }
];

const calculateMatchScore = (therapist: Therapist, userProfile: UserProfile): number => {
  let score = 0;
  
  // 1. Match based on user goals and therapist specializations (weighted heavily)
  const userGoalsLower = userProfile.goals.map(g => g.toLowerCase());
  const therapistSpecsLower = therapist.specializations.map(s => s.toLowerCase());
  
  let goalMatches = 0;
  userGoalsLower.forEach(goal => {
    if (therapistSpecsLower.some(spec => spec.includes(goal) || goal.includes(spec))) {
      goalMatches++;
    }
  });
  
  // Award points proportionally to number of matching goals
  if (goalMatches > 0) {
    score += Math.min(40, goalMatches * 15); // Cap at 40 points for goal matches
  }
  
  // 2. Experience level match (weight: 20 points)
  if (userProfile.experienceLevel) {
    if (userProfile.experienceLevel === 'beginner' && therapist.experience >= 8) {
      score += 20; // Experienced therapist for first-timers
    } else if (userProfile.experienceLevel === 'experienced' && therapist.experience >= 10) {
      score += 20; // Veteran therapist for experienced clients
    } else if (userProfile.experienceLevel === 'returning') {
      score += 15; // Any experienced therapist works
    }
  }
  
  // 3. Support preferences match (weight: 15 points)
  if (userProfile.supportPreferences?.includes('Professional Therapy')) {
    score += 15;
  }
  
  // 4. Availability (weight: 15 points)
  if (therapist.availability === 'accepting') {
    score += 15;
  } else if (therapist.availability === 'waitlist') {
    score += 8;
  }
  
  // 5. Therapist rating quality (weight: 10 points)
  if (therapist.rating >= 4.8) {
    score += 10;
  } else if (therapist.rating >= 4.5) {
    score += 7;
  } else {
    score += 4;
  }
  
  // Always cap at 100
  return Math.min(100, Math.round(score));
};

const TherapistMatcher: React.FC<TherapistMatcherProps> = ({ userProfile, onBack }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showVirtualOnly, setShowVirtualOnly] = useState(false);
  const [showAcceptingOnly, setShowAcceptingOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const therapistsWithScores = useMemo(() => {
    return SAMPLE_THERAPISTS.map(therapist => ({
      ...therapist,
      matchScore: calculateMatchScore(therapist, userProfile)
    })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [userProfile]);

  const filteredTherapists = useMemo(() => {
    return therapistsWithScores.filter(therapist => {
      if (showVirtualOnly && !therapist.virtualSessions) return false;
      if (showAcceptingOnly && therapist.availability !== 'accepting') return false;
      if (selectedFilters.length > 0) {
        return selectedFilters.some(filter => 
          therapist.specializations.some(spec => spec.toLowerCase().includes(filter.toLowerCase()))
        );
      }
      return true;
    });
  }, [therapistsWithScores, selectedFilters, showVirtualOnly, showAcceptingOnly]);

  const allSpecializations = Array.from(new Set(SAMPLE_THERAPISTS.flatMap(t => t.specializations)));

  const toggleFilter = (spec: string) => {
    setSelectedFilters(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-light text-white">Guiding Stars</h1>
          <p className="text-white/70 text-sm">Find therapists to guide your journey</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setShowVirtualOnly(!showVirtualOnly)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                showVirtualOnly ? 'bg-cyan-400 text-cyan-900 font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Virtual Only
            </button>
            <button
              onClick={() => setShowAcceptingOnly(!showAcceptingOnly)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                showAcceptingOnly ? 'bg-cyan-400 text-cyan-900 font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Accepting Patients
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {allSpecializations.slice(0, 8).map(spec => (
              <button
                key={spec}
                onClick={() => toggleFilter(spec)}
                className={`px-3 py-1.5 rounded-full text-xs transition ${
                  selectedFilters.includes(spec) 
                    ? 'bg-teal-400 text-teal-900 font-semibold' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-white/60 text-sm mb-4">
          Found {filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''}
        </p>

        {/* Therapist Cards */}
        <div className="space-y-4">
          {filteredTherapists.map((therapist) => (
            <div
              key={therapist.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/30 transition overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold text-white">{therapist.name}</h3>
                      {therapist.matchScore && therapist.matchScore >= 70 && (
                        <span className="px-2 py-1 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 text-xs font-bold rounded-full">
                          {therapist.matchScore}% Match
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm mb-2">{therapist.title}</p>
                    <div className="flex items-center gap-1 text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(therapist.rating) ? 'fill-current' : 'fill-none'}`}
                        />
                      ))}
                      <span className="text-white/70 text-sm ml-1">
                        {therapist.rating} ({therapist.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    therapist.availability === 'accepting' ? 'bg-green-500/20 text-green-300' :
                    therapist.availability === 'waitlist' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {therapist.availability === 'accepting' ? 'Accepting' : 
                     therapist.availability === 'waitlist' ? 'Waitlist' : 'Full'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {therapist.specializations.slice(0, 4).map(spec => (
                    <span key={spec} className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs">
                      {spec}
                    </span>
                  ))}
                </div>

                <p className="text-white/70 text-sm mb-3">
                  {expandedId === therapist.id ? therapist.bio : therapist.bio.slice(0, 120) + '...'}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-white/60 mb-3">
                  {therapist.experience && (
                    <span>📚 {therapist.experience} years experience</span>
                  )}
                  {therapist.virtualSessions && (
                    <span>💻 Virtual sessions</span>
                  )}
                  {therapist.inPersonSessions && therapist.location && (
                    <span>📍 {therapist.location.city} ({therapist.location.distance}mi)</span>
                  )}
                  {therapist.acceptsInsurance && (
                    <span>✓ Insurance accepted</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === therapist.id ? null : therapist.id)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    {expandedId === therapist.id ? 'Show Less' : 'Learn More'}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-lg font-semibold text-sm hover:opacity-90 transition">
                    Request Appointment
                  </button>
                </div>

                {expandedId === therapist.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
                    <div>
                      <span className="text-white/60">Approach: </span>
                      <span className="text-white">{therapist.approach.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Languages: </span>
                      <span className="text-white">{therapist.languages.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTherapists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg mb-2">No therapists found with current filters</p>
            <button
              onClick={() => {
                setSelectedFilters([]);
                setShowVirtualOnly(false);
                setShowAcceptingOnly(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistMatcher;
