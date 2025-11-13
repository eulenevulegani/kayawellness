
import React, { useState } from 'react';
import { BookOpenIcon, StarIcon, TreeIcon } from './Icons';
import { SessionHistoryEntry, GratitudeEntry } from '../types';

interface PostSessionScreenProps {
  onAddGratitude: (word: string) => void;
  onDone: () => void;
  gratitudeEntries: GratitudeEntry[];
  onSaveReflection: (reflectionText: string) => void;
}

const PostSessionScreen: React.FC<PostSessionScreenProps> = ({ onAddGratitude, onDone, gratitudeEntries, onSaveReflection }) => {
  const [gratitudeWord, setGratitudeWord] = useState('');
  const [reflection, setReflection] = useState('');
  const [view, setView] = useState<'main' | 'gratitude' | 'reflection' | 'gratitudeConfirmation'>('main');
  const [showRecentGratitude, setShowRecentGratitude] = useState<GratitudeEntry[] | null>(null);

  const handleGratitudeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = gratitudeWord.trim();
    if (word) {
      onAddGratitude(word);
      const newEntry = { word, date: new Date().toISOString() };
      
      // Ensure gratitudeEntries is an array before filtering
      const safeEntries = Array.isArray(gratitudeEntries) ? gratitudeEntries : [];
      const otherEntries = safeEntries.filter(entry => entry.word.toLowerCase() !== word.toLowerCase()).slice(0, 50);
      const randomEntries: GratitudeEntry[] = [];
      for (let i = 0; i < 2; i++) {
          if (otherEntries.length > 0) {
              const randomIndex = Math.floor(Math.random() * otherEntries.length);
              randomEntries.push(otherEntries.splice(randomIndex, 1)[0]);
          }
      }
      setShowRecentGratitude([newEntry, ...randomEntries]);
      setView('gratitudeConfirmation');
      setGratitudeWord('');
    }
  };

  const handleReflectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reflection.trim()) {
        onSaveReflection(reflection.trim());
        setView('main');
        setReflection('');
    }
  };


  const renderMain = () => (
    <>
      <h1 className="text-4xl font-light text-white mb-4">Session Complete</h1>
      <p className="text-white/70 mb-8">Take a moment to honor the time you've given yourself.</p>
      <div className="w-full space-y-4">
        <button onClick={() => setView('gratitude')} className="w-full flex items-center gap-3 px-6 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition text-left">
          <TreeIcon className="w-6 h-6 text-green-300 flex-shrink-0" />
          <span>Add to the Gratitude Tree</span>
        </button>
        <button onClick={() => setView('reflection')} className="w-full flex items-center gap-3 px-6 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition text-left">
          <BookOpenIcon className="w-6 h-6 text-blue-300 flex-shrink-0" />
          <span>Reflect & Unlock Achievement</span>
        </button>
      </div>
       <button
          onClick={onDone}
          className="mt-10 w-full max-w-xs px-10 py-3 bg-white text-cyan-900 rounded-full font-semibold hover:bg-opacity-90 transform hover:scale-105 transition"
        >
          Done
        </button>
    </>
  );

  const renderGratitude = () => (
      <>
        <h2 className="text-2xl font-light text-white mb-4">What are you grateful for?</h2>
        <p className="text-white/70 mb-6">Share one anonymous word to help our tree grow.</p>
        <form onSubmit={handleGratitudeSubmit} className="w-full">
            <input 
                type="text"
                value={gratitudeWord}
                onChange={(e) => setGratitudeWord(e.target.value.split(' ')[0])} // only one word
                placeholder="Gratitude"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
            <button type="submit" className="mt-4 w-full py-3 bg-white text-cyan-900 rounded-full font-semibold hover:bg-opacity-90 transition">Add Leaf</button>
        </form>
         <button onClick={() => setView('main')} className="text-sm text-white/60 hover:text-white mt-4">Cancel</button>
      </>
  )

    const renderReflection = () => (
      <>
        <h2 className="text-2xl font-light text-white mb-4">How do you feel now?</h2>
        <p className="text-white/70 mb-6">Capture your thoughts to save them and unlock an achievement.</p>
        <form onSubmit={handleReflectionSubmit} className="w-full">
            <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your reflection here..."
                className="w-full h-32 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
            <button type="submit" className="mt-4 w-full py-3 bg-white text-cyan-900 rounded-full font-semibold hover:bg-opacity-90 transition">Save Reflection</button>
        </form>
         <button onClick={() => setView('main')} className="text-sm text-white/60 hover:text-white mt-4">Cancel</button>
      </>
  )
  
  const renderGratitudeConfirmation = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-light text-white mb-4">You and others feel gratitude.</h2>
        <p className="text-white/70 mb-6">Your leaf has been added to the tree.</p>
        <div className="flex flex-wrap justify-center gap-3 my-4">
            {showRecentGratitude?.map((entry, index) => (
                <div key={index} className={`px-4 py-2 rounded-full animate-fade-in ${index === 0 ? 'bg-green-300/30 text-green-100 border border-green-300/50' : 'bg-white/10 text-white/80'}`}>
                    {entry.word}
                </div>
            ))}
        </div>
        <button onClick={() => { setView('main'); setShowRecentGratitude(null); }} className="text-sm text-white/60 hover:text-white mt-4">Continue</button>
    </div>
)


  return (
    <div className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 animate-fade-in text-center flex flex-col items-center">
        {view === 'main' && renderMain()}
        {view === 'gratitude' && renderGratitude()}
        {view === 'reflection' && renderReflection()}
        {view === 'gratitudeConfirmation' && renderGratitudeConfirmation()}
    </div>
  );
};

export default PostSessionScreen;