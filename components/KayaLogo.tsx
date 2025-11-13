import React from 'react';

interface KayaLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * KAYA Official Logo Component
 * Smooth gradient sphere with KAYA text
 */
const KayaLogo: React.FC<KayaLogoProps> = ({ 
  size = 48, 
  className = '',
  animated = true 
}) => {
  // Calculate text size proportionally
  const textSize = Math.round(size * 0.14); // Larger text for better visibility
  const letterSpacing = Math.round(size * 0.04); // More spacing
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KAYA Logo"
    >
      <defs>
        {/* Main sphere gradient - cyan to teal to blue */}
        <radialGradient id={`sphereGradient-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="1"/>
          <stop offset="30%" stopColor="#22d3ee" stopOpacity="1"/>
          <stop offset="55%" stopColor="#14b8a6" stopOpacity="1"/>
          <stop offset="80%" stopColor="#0d9488" stopOpacity="1"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="1"/>
        </radialGradient>
        
        {/* Soft outer glow */}
        <radialGradient id={`outerGlow-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#22d3ee" stopOpacity="0"/>
          <stop offset="95%" stopColor="#22d3ee" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
        </radialGradient>
        
        {/* Subtle highlight overlay */}
        <radialGradient id={`highlight-${size}`} cx="50%" cy="35%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25"/>
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      {/* Outer soft glow */}
      <circle cx="100" cy="100" r="85" fill={`url(#outerGlow-${size})`}>
        {animated && (
          <animate 
            attributeName="opacity" 
            values="0.8;0.5;0.8" 
            dur="4s" 
            repeatCount="indefinite"
          />
        )}
      </circle>
      
      {/* Main sphere */}
      <circle cx="100" cy="100" r="75" fill={`url(#sphereGradient-${size})`}/>
      
      {/* Subtle highlight */}
      <circle cx="100" cy="100" r="75" fill={`url(#highlight-${size})`}/>
      
      {/* KAYA text */}
      <text 
        x="100" 
        y="108" 
        fontFamily="'Helvetica Neue', Arial, sans-serif" 
        fontSize={textSize} 
        fontWeight="300" 
        letterSpacing={letterSpacing} 
        fill="white" 
        textAnchor="middle" 
        opacity="0.95"
      >
        KAYA
      </text>
    </svg>
  );
};

export default KayaLogo;
