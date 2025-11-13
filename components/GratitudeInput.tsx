import React, { useState } from 'react';

interface GratitudeInputProps {
  onSubmit: (word: string) => void;
  loading?: boolean;
}

const GratitudeInput: React.FC<GratitudeInputProps> = ({ onSubmit, loading }) => {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) {
      setError('Please enter a gratitude word.');
      return;
    }
    setError('');
    onSubmit(word.trim());
    setWord('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto animate-fade-in">
      <label className="text-white/80 text-lg font-light mb-2" htmlFor="gratitude-word">
        What are you grateful for right now?
      </label>
      <input
        id="gratitude-word"
        type="text"
        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg"
        placeholder="One word or phrase..."
        value={word}
        onChange={e => setWord(e.target.value)}
        disabled={loading}
        maxLength={32}
        autoFocus
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        type="submit"
        className="px-8 py-3 bg-cyan-400 text-cyan-900 rounded-full font-semibold text-lg hover:bg-cyan-300 transition disabled:opacity-60"
        disabled={loading || !word.trim()}
      >
        {loading ? 'Saving...' : 'Add Gratitude'}
      </button>
    </form>
  );
};

export default GratitudeInput;
