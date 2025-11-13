import React from 'react';

interface PulsingOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'violet' | 'emerald' | 'rose' | 'cyan';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const SIZE_CLASSES = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
};

// Official KAYA orb design - teal with white center
const VARIANT_CLASSES = {
  gold: 'from-cyan-400 via-teal-400 to-cyan-500',
  violet: 'from-cyan-400 via-teal-400 to-cyan-500',
  emerald: 'from-cyan-400 via-teal-400 to-cyan-500',
  rose: 'from-cyan-400 via-teal-400 to-cyan-500',
  cyan: 'from-cyan-400 via-teal-400 to-cyan-500'
};

const GLOW_CLASSES = {
  gold: 'shadow-[0_0_80px_rgba(6,182,212,0.8),0_0_120px_rgba(20,184,166,0.6)]',
  violet: 'shadow-[0_0_80px_rgba(6,182,212,0.8),0_0_120px_rgba(20,184,166,0.6)]',
  emerald: 'shadow-[0_0_80px_rgba(6,182,212,0.8),0_0_120px_rgba(20,184,166,0.6)]',
  rose: 'shadow-[0_0_80px_rgba(6,182,212,0.8),0_0_120px_rgba(20,184,166,0.6)]',
  cyan: 'shadow-[0_0_80px_rgba(6,182,212,0.8),0_0_120px_rgba(20,184,166,0.6)]'
};

const INTENSITY_DURATION = {
  subtle: 'animate-orb-breathe',
  medium: 'animate-gentle-pulse',
  strong: 'animate-pulse'
};

const PulsingOrb: React.FC<PulsingOrbProps> = ({ 
  size = 'md', 
  variant = 'gold', 
  intensity = 'medium',
  className = '',
  children,
  onClick
}) => {
  const sizeClass = SIZE_CLASSES[size];
  const variantClass = VARIANT_CLASSES[variant];
  const glowClass = GLOW_CLASSES[variant];
  const animationClass = INTENSITY_DURATION[intensity];

  return (
    <div 
      className={`relative ${sizeClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Outer glow ring */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${variantClass} opacity-40 blur-2xl ${animationClass}`}></div>
      
      {/* Main orb - Official KAYA design */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${variantClass} ${glowClass} ${animationClass} flex items-center justify-center`}>
        {/* White center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5/12 h-5/12 rounded-full bg-white/90 blur-lg animate-core-pulse"></div>
        </div>
        
        {/* White center core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/4 h-1/4 rounded-full bg-white"></div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center w-full h-full text-cyan-900 font-semibold">
          {children}
        </div>
      </div>

      {/* Particle effect overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-particle-float"
            style={{
              left: `${30 + i * 20}%`,
              bottom: '10%',
              animationDelay: `${i * 1.3}s`,
              opacity: 0.6
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PulsingOrb;
