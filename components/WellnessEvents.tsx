import React, { useState, useMemo } from 'react';
import { WellnessEvent } from '../types';
import { ArrowLeftIcon } from './Icons';

interface WellnessEventsProps {
  onBack: () => void;
}

// Sample events data - in production, this would come from an API
const SAMPLE_EVENTS: WellnessEvent[] = [
  {
    id: '1',
    title: 'Guided Meditation for Beginners',
    category: 'meditation',
    description: 'Learn the fundamentals of meditation in a supportive group setting. Perfect for those new to mindfulness practice.',
    date: '2025-11-15',
    time: '10:00 AM',
    duration: 60,
    location: {
      type: 'in-person',
      venue: 'Mindful Living Center',
      address: '123 Wellness St',
      city: 'Seattle',
      state: 'WA',
      distance: 2.3
    },
    cost: 0,
    organizer: 'Mindful Living Center',
    capacity: 20,
    spotsRemaining: 8,
    tags: ['beginner-friendly', 'meditation', 'mindfulness']
  },
  {
    id: '2',
    title: 'Stress Management Workshop',
    category: 'workshop',
    description: 'Interactive workshop covering evidence-based techniques for managing stress in daily life. Includes practical exercises you can use immediately.',
    date: '2025-11-18',
    time: '6:00 PM',
    duration: 120,
    location: {
      type: 'virtual',
      meetingLink: 'https://zoom.us/meeting'
    },
    cost: 25,
    organizer: 'Wellness Institute',
    capacity: 50,
    spotsRemaining: 15,
    tags: ['stress', 'coping-skills', 'interactive']
  },
  {
    id: '3',
    title: 'Morning Yoga Flow',
    category: 'yoga',
    description: 'Start your day with energizing vinyasa flow. All levels welcome. Bring your own mat.',
    date: '2025-11-12',
    time: '7:00 AM',
    duration: 75,
    location: {
      type: 'in-person',
      venue: 'Sunrise Yoga Studio',
      address: '456 Harmony Ave',
      city: 'Portland',
      state: 'OR',
      distance: 4.7
    },
    cost: 15,
    organizer: 'Sunrise Yoga Studio',
    tags: ['morning', 'yoga', 'all-levels']
  },
  {
    id: '4',
    title: 'Anxiety Support Group',
    category: 'support-group',
    description: 'Safe space to share experiences and coping strategies with others who understand. Facilitated by a licensed therapist.',
    date: '2025-11-14',
    time: '7:00 PM',
    duration: 90,
    location: {
      type: 'hybrid',
      venue: 'Community Wellness Center',
      address: '789 Hope Blvd',
      city: 'San Francisco',
      state: 'CA',
      distance: 1.8,
      meetingLink: 'https://zoom.us/meeting'
    },
    cost: 0,
    organizer: 'Community Wellness Center',
    capacity: 15,
    spotsRemaining: 5,
    tags: ['anxiety', 'support', 'peer-led']
  },
  {
    id: '5',
    title: 'Weekend Wellness Retreat',
    category: 'retreat',
    description: 'Immersive 2-day retreat featuring yoga, meditation, nature walks, and nourishing meals. Disconnect to reconnect.',
    date: '2025-11-23',
    time: '9:00 AM',
    duration: 2880, // 2 days
    location: {
      type: 'in-person',
      venue: 'Mountain Peace Retreat',
      address: '999 Tranquil Trail',
      city: 'Boulder',
      state: 'CO',
      distance: 15.2
    },
    cost: 350,
    organizer: 'Mountain Peace Retreat',
    capacity: 30,
    spotsRemaining: 12,
    tags: ['retreat', 'immersive', 'yoga', 'meditation']
  },
  {
    id: '6',
    title: 'Building Resilience: Expert Panel',
    category: 'webinar',
    description: 'Join mental health experts discussing practical strategies for building emotional resilience. Q&A included.',
    date: '2025-11-20',
    time: '12:00 PM',
    duration: 60,
    location: {
      type: 'virtual',
      meetingLink: 'https://zoom.us/webinar'
    },
    cost: 0,
    organizer: 'Mental Health Alliance',
    capacity: 500,
    spotsRemaining: 287,
    tags: ['resilience', 'expert', 'free']
  },
  {
    id: '7',
    title: 'HIIT for Mental Health',
    category: 'fitness',
    description: 'High-intensity interval training designed to boost mood and reduce stress. Endorphins guaranteed!',
    date: '2025-11-16',
    time: '5:30 PM',
    duration: 45,
    location: {
      type: 'in-person',
      venue: 'FitMind Gym',
      address: '321 Energy Lane',
      city: 'Seattle',
      state: 'WA',
      distance: 3.1
    },
    cost: 10,
    organizer: 'FitMind Gym',
    capacity: 25,
    spotsRemaining: 10,
    tags: ['fitness', 'mood-boost', 'high-energy']
  },
  {
    id: '8',
    title: 'Sleep Hygiene Masterclass',
    category: 'workshop',
    description: 'Learn science-backed strategies for better sleep. Topics include sleep environment, routines, and relaxation techniques.',
    date: '2025-11-19',
    time: '8:00 PM',
    duration: 90,
    location: {
      type: 'virtual',
      meetingLink: 'https://zoom.us/meeting'
    },
    cost: 20,
    organizer: 'Sleep Science Institute',
    capacity: 100,
    spotsRemaining: 45,
    tags: ['sleep', 'science-based', 'practical']
  }
];

const CATEGORY_LABELS: Record<WellnessEvent['category'], string> = {
  'workshop': 'Workshop',
  'meditation': 'Meditation',
  'yoga': 'Yoga',
  'support-group': 'Support Group',
  'retreat': 'Retreat',
  'webinar': 'Webinar',
  'fitness': 'Fitness'
};

const WellnessEvents: React.FC<WellnessEventsProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocationType, setSelectedLocationType] = useState<string>('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return SAMPLE_EVENTS.filter(event => {
      if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
      if (selectedLocationType !== 'all' && event.location.type !== selectedLocationType) return false;
      if (showFreeOnly && event.cost > 0) return false;
      return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedCategory, selectedLocationType, showFreeOnly]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-light text-white">Event Horizon</h1>
          <p className="text-white/70 text-sm">Join wellness events and community gatherings</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10">
          <div className="mb-4">
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
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    selectedCategory === key ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLocationType('all')}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                selectedLocationType === 'all' ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              All Locations
            </button>
            <button
              onClick={() => setSelectedLocationType('virtual')}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                selectedLocationType === 'virtual' ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              💻 Virtual
            </button>
            <button
              onClick={() => setSelectedLocationType('in-person')}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                selectedLocationType === 'in-person' ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              📍 In-Person
            </button>
            <button
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                showFreeOnly ? 'bg-green-400 text-green-900 font-semibold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Free Only
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-white/60 text-sm mb-4">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
        </p>

        {/* Event Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/30 transition overflow-hidden"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{event.title}</h3>
                    <span className="inline-block px-2 py-1 bg-white/10 text-white/80 rounded text-xs">
                      {CATEGORY_LABELS[event.category]}
                    </span>
                  </div>
                  {event.cost === 0 ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold">
                      FREE
                    </span>
                  ) : (
                    <span className="text-white font-semibold">${event.cost}</span>
                  )}
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
                  <span>📅 {formatDate(event.date)}</span>
                  <span>⏰ {event.time}</span>
                  <span>⏱️ {formatDuration(event.duration)}</span>
                </div>

                {/* Location */}
                <div className="text-sm text-white/70 mb-3">
                  {event.location.type === 'virtual' ? (
                    <span>💻 Virtual Event</span>
                  ) : event.location.type === 'hybrid' ? (
                    <span>🌐 Hybrid (In-Person & Virtual)</span>
                  ) : (
                    <span>
                      📍 {event.location.venue}, {event.location.city} ({event.location.distance}mi)
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm mb-3">
                  {expandedId === event.id ? event.description : event.description.slice(0, 100) + '...'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {event.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/5 text-white/60 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Spots & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-white/60">
                    {event.spotsRemaining && event.capacity && (
                      <>
                        {event.spotsRemaining} of {event.capacity} spots left
                      </>
                    )}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                      className="px-3 py-1.5 bg-white/10 text-white text-xs rounded hover:bg-white/20 transition"
                    >
                      {expandedId === event.id ? 'Less' : 'Details'}
                    </button>
                    <button className="px-4 py-1.5 bg-white text-black rounded font-semibold text-xs hover:bg-white/90 transition">
                      Register
                    </button>
                  </div>
                </div>

                {/* Extended Details */}
                {expandedId === event.id && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-sm">
                    <div>
                      <span className="text-white/60">Organizer: </span>
                      <span className="text-white">{event.organizer}</span>
                    </div>
                    {event.location.address && (
                      <div>
                        <span className="text-white/60">Address: </span>
                        <span className="text-white">{event.location.address}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg mb-2">No events found with current filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLocationType('all');
                setShowFreeOnly(false);
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

export default WellnessEvents;
