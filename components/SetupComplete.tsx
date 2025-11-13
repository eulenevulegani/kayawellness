
import React from 'react';
import { LotusIcon } from './Icons';

interface SetupCompleteProps {
  userName: string;
  onContinue: () => void;
}

const SetupComplete: React.FC<SetupCompleteProps> = ({ userName, onContinue }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in text-center flex flex-col items-center justify-center h-full">
      <div className="w-24 h-24 mb-8 bg-white/10 rounded-full flex items-center justify-center text-white/80 mx-auto animate-gentle-pulse">
        <LotusIcon className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-light text-white">All set, {userName}!</h1>
      <p className="text-white/70 mt-4 text-lg max-w-sm">
        Your personal wellness space is ready. KAYA will now tailor experiences just for you.
      </p>
      <button
        onClick={onContinue}
        className="mt-12 w-full max-w-xs px-12 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition duration-300"
      >
        Let's Begin
      </button>
    </div>
  );
};

export default SetupComplete;
