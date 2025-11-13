import React, { useEffect, useState } from 'react';

/**
 * Viral Micro-Moment: Stars bloom on each breath
 * Creates instant visual gratification that hooks users
 */
interface BreathStarsProps {
  isInhale: boolean;
  isActive: boolean;
}

const BreathStars: React.FC<BreathStarsProps> = ({ isInhale, isActive }) => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    if (isActive && isInhale) {
      // Generate stars on inhale
      const newStars = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.3,
      }));
      setStars(prev => [...prev, ...newStars]);

      // Clean up old stars
      setTimeout(() => {
        setStars(prev => prev.filter(star => !newStars.find(s => s.id === star.id)));
      }, 2000);
    }
  }, [isInhale, isActive]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-star-bloom"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BreathStars;
