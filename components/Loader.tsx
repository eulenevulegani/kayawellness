
import React from 'react';

const Loader: React.FC<{ message?: string }> = ({ message = "KAYA is preparing your session..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-400/20 border-b-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
      </div>
      <p className="text-white/80 animate-pulse font-medium">{message}</p>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Loader;
