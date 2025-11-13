import React, { useMemo } from 'react';
import { UserProfile, SessionHistoryEntry } from '../types';

interface PersonalGrowthTreeProps {
  userProfile: UserProfile;
  sessionHistory: SessionHistoryEntry[];
}

const PersonalGrowthTree: React.FC<PersonalGrowthTreeProps> = ({ userProfile, sessionHistory }) => {
  const journalCount = sessionHistory.filter(entry => entry.reflection?.trim()).length;
  const sessionCount = sessionHistory.length;
  const programsCount = userProfile.completedPrograms?.length || 0;

  const maxLeaves = 80;
  const maxRoots = 5;
  const maxBranches = 3;

  const numLeaves = Math.min(maxLeaves, sessionCount);
  const numRoots = Math.min(maxRoots, Math.floor(journalCount / 2));
  const numBranches = Math.min(maxBranches, programsCount);

  const RootPaths = [
    <path key="r1" d="M 50 100 Q 45 105, 40 110" />,
    <path key="r2" d="M 50 100 Q 55 105, 60 110" />,
    <path key="r3" d="M 50 100 Q 50 108, 50 115" />,
    <path key="r4" d="M 50 100 Q 40 108, 35 115" />,
    <path key="r5" d="M 50 100 Q 60 108, 65 115" />,
  ];

  const BranchPaths = [
    <path key="b1" d="M 50 60 Q 30 50, 20 30" />,
    <path key="b2" d="M 50 60 Q 70 50, 80 30" />,
    <path key="b3"d="M 50 40 Q 55 25, 65 15" />,
  ];
  
  const leafPositions = useMemo(() => {
    const positions = [];
    const branchPoints = [
      [{x:20,y:30},{x:30,y:50},{x:50,y:60}], // branch 1
      [{x:80,y:30},{x:70,y:50},{x:50,y:60}], // branch 2
      [{x:65,y:15},{x:55,y:25},{x:50,y:40}], // branch 3
      [{x:50,y:30},{x:50,y:50}], // trunk part
    ];

    for(let i = 0; i < numLeaves; i++) {
        const hash = (i * 37) % 100; // simple pseudo-random
        const branchIndex = hash % Math.min(numBranches + 1, branchPoints.length);
        const pointIndex = hash % branchPoints[branchIndex].length;
        
        const point = branchPoints[branchIndex][pointIndex];
        
        positions.push({
            cx: point.x + (hash % 10) - 5,
            cy: point.y + (hash % 10) - 5,
            transform: `rotate(${(hash % 60) - 30} ${point.x} ${point.y})`,
        });
    }
    return positions;
  }, [numLeaves, numBranches]);

  return (
    <svg viewBox="0 0 100 120" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
      <defs>
        <filter id="star-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="starGradient">
            <stop offset="0%" style={{stopColor: 'rgba(165, 243, 252, 1)', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: 'rgba(103, 232, 249, 0.9)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(34, 211, 238, 0.8)', stopOpacity: 1}} />
        </radialGradient>
        <radialGradient id="centerGradient">
            <stop offset="0%" style={{stopColor: 'rgba(250, 204, 21, 1)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(251, 146, 60, 0.9)', stopOpacity: 1}} />
        </radialGradient>
      </defs>
      
      {/* Orbital Rings (Reflections/Journals) */}
      <g 
        stroke="rgba(103, 232, 249, 0.2)" 
        strokeWidth="0.5"
        fill="none" 
        strokeDasharray="2,2"
        style={{ transition: 'opacity 0.5s ease-in-out' }}
      >
        {numRoots > 0 && <circle cx="50" cy="60" r="15" />}
        {numRoots > 1 && <circle cx="50" cy="60" r="25" />}
        {numRoots > 2 && <circle cx="50" cy="60" r="35" />}
      </g>

      {/* Center Sun/Core (represents user's center) */}
      <circle cx="50" cy="60" r="5" fill="url(#centerGradient)" filter="url(#star-glow)" opacity="0.9" />

      {/* Constellation Lines (Programs) */}
      <g 
        stroke="rgba(165, 243, 252, 0.3)" 
        strokeWidth="1" 
        fill="none" 
        strokeLinecap="round"
      >
         {BranchPaths.slice(0, numBranches).map(path => React.cloneElement(path, { 
           style: { transition: 'd 0.5s' },
           stroke: "rgba(165, 243, 252, 0.4)"
         }))}
      </g>
      
      {/* Stars (Sessions) */}
      <g fill="url(#starGradient)" filter="url(#star-glow)">
        {leafPositions.map((pos, i) => (
             <g key={i}>
               {/* Main star circle */}
               <circle 
                 cx={pos.cx} 
                 cy={pos.cy} 
                 r="1.5"
                 className="opacity-0 animate-fade-in animate-twinkle"
                 style={{ animationDelay: `${i * 20}ms`}}
               />
               {/* Star points */}
               <path
                 d={`M ${pos.cx} ${pos.cy - 2.5} L ${pos.cx} ${pos.cy + 2.5} M ${pos.cx - 2.5} ${pos.cy} L ${pos.cx + 2.5} ${pos.cy}`}
                 stroke="url(#starGradient)"
                 strokeWidth="0.5"
                 className="opacity-0 animate-fade-in"
                 style={{ animationDelay: `${i * 20 + 100}ms`}}
               />
             </g>
        ))}
      </g>
       <style>{`
        @keyframes fade-in {
          to { opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-twinkle {
          animation: fade-in 0.5s ease-out forwards, twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
};

export default PersonalGrowthTree;