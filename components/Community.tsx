
import React from 'react';
import { GratitudeEntry } from '../types';
import { ArrowLeftIcon, TreeIcon } from './Icons';

interface CommunityProps {
  entries: GratitudeEntry[];
  onClose: () => void;
}

// A simple hashing function to generate a consistent-ish random number for positioning
const simpleHash = (s: string): number => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const Leaf: React.FC<{ entry: GratitudeEntry, index: number }> = ({ entry, index }) => {
    const hash = simpleHash(entry.word + entry.date);
    const top = 20 + (hash % 70); // Position between 20% and 90% from the top
    const left = 10 + (hash % 80); // Position between 10% and 90% from the left
    const rotation = (hash % 60) - 30; // Rotate between -30 and 30 deg
    const delay = (index % 20) * 100; // Stagger animation
    const scale = 0.8 + ((hash % 5) / 10); // Vary size slightly

    return (
        <div 
            className="absolute px-3 py-1.5 bg-cyan-400/20 backdrop-blur-sm border border-cyan-300/40 text-cyan-100 text-sm rounded-full animate-shimmer shadow-lg shadow-cyan-500/20"
            style={{
                top: `${top}%`,
                left: `${left}%`,
                transform: `rotate(${rotation}deg) scale(${scale})`,
                animationDelay: `${delay}ms`,
                boxShadow: `0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 10px rgba(165, 243, 252, 0.2)`
            }}
        >
            ✨ {entry.word}
        </div>
    )
}


const Community: React.FC<CommunityProps> = ({ entries, onClose }) => {
  return (
    <>
    <div className="w-full max-w-5xl mx-auto p-4 animate-fade-in text-white h-[90vh] flex flex-col">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-light text-white flex items-center gap-3">✨ Constellation of Gratitude</h2>
        <button onClick={onClose} className="p-2 -m-2 text-white/60 hover:text-white transition">
          <ArrowLeftIcon className="w-6 h-6" />
          <span className="sr-only">Back</span>
        </button>
      </header>
      
      <div className="flex-grow relative overflow-hidden rounded-lg bg-gradient-to-b from-cyan-950/30 to-black/50 border border-white/10">
          {/* Central Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
          {/* Stars */}
          {entries.length > 0 ? (
              entries.map((entry, index) => <Leaf key={`${entry.date}-${index}`} entry={entry} index={index}/>)
          ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-center text-white/70 max-w-xs leading-relaxed">
                      Your constellation awaits. <br/> Complete a session and add your first star of gratitude to illuminate the cosmos.
                  </p>
              </div>
          )}
      </div>
       <p className="text-center text-xs text-white/50 mt-4">
         Each star represents gratitude shared anonymously by our cosmic community—yours and others together, forming something beautiful.
       </p>
    </div>
    <style>{`
        @keyframes shimmer {
            0%, 100% { opacity: 0.7; transform: scale(1) rotate(var(--rotation, 0deg)); }
            50% { opacity: 1; transform: scale(1.05) rotate(var(--rotation, 0deg)); }
        }
        .animate-shimmer {
            animation: shimmer 5s ease-in-out infinite;
        }
    `}</style>
    </>
  );
};

export default Community;
