
import React from 'react';
import { WellnessProgram } from '../types';
import { StarIcon } from './Icons';

interface ProgramCompleteProps {
  program: WellnessProgram;
  onContinue: () => void;
}

const ProgramComplete: React.FC<ProgramCompleteProps> = ({ program, onContinue }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 animate-fade-in text-center flex flex-col items-center">
      <div className="w-24 h-24 mb-8 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-300 mx-auto animate-gentle-pulse">
        <StarIcon className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-light text-white">Journey Complete!</h1>
      <p className="text-white/70 mt-4 text-lg max-w-sm">
        You've successfully completed the <span className="font-semibold text-white">{program.title}</span> program.
      </p>
      <p className="text-white/70 mt-2 text-base">
        Take a moment to appreciate your commitment to your wellbeing.
      </p>
      <button
        onClick={onContinue}
        className="mt-12 w-full max-w-xs px-12 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition duration-300"
      >
        Continue
      </button>
    </div>
  );
};

export default ProgramComplete;
