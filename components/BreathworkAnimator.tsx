import React, { useEffect, useMemo, useState } from 'react';
import { BreathworkItem } from '../types';

interface BreathworkAnimatorProps {
  breathwork: BreathworkItem;
  variant?: 'standard' | 'compact';
}

const BreathworkAnimator: React.FC<BreathworkAnimatorProps> = ({ breathwork, variant = 'standard' }) => {
  // Normalize pattern and durations (seconds)
  const pattern = breathwork?.pattern || { inhale: 4, hold: 4, exhale: 4 };
  const inhale = pattern.inhale || 4;
  const hold = pattern.hold || 0;
  const exhale = pattern.exhale || 4;
  const holdAfter = pattern.holdAfterExhale || 0;

  const stages = useMemo(() => {
    const s: { name: string; durationMs: number }[] = [];
    s.push({ name: 'inhale', durationMs: inhale * 1000 });
    if (hold && hold > 0) s.push({ name: 'hold', durationMs: hold * 1000 });
    s.push({ name: 'exhale', durationMs: exhale * 1000 });
    if (holdAfter && holdAfter > 0) s.push({ name: 'holdAfterExhale', durationMs: holdAfter * 1000 });
    return s;
  }, [inhale, hold, exhale, holdAfter]);

  const [stageIndex, setStageIndex] = useState(0);
  const [countdown, setCountdown] = useState(Math.ceil((stages[0]?.durationMs || 4000) / 1000));

  // Advance stage on timer and update countdown
  useEffect(() => {
    if (!stages || stages.length === 0) return;

    const current = stages[stageIndex];
    setCountdown(Math.ceil(current.durationMs / 1000));

    // Interval for countdown every second
    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return Math.ceil(current.durationMs / 1000);
        return prev - 1;
      });
    }, 1000);

    // Move to next stage after full duration
    const t = setTimeout(() => {
      setStageIndex((i) => (i + 1) % stages.length);
    }, current.durationMs);

    return () => {
      clearInterval(tick);
      clearTimeout(t);
    };
  }, [stageIndex, stages]);

  const current = stages[stageIndex] || stages[0];

  // Visual sizing
  const sizes = variant === 'standard'
    ? { outer: 'w-64 h-64', main: 'w-44 h-44', core: 'w-12 h-12', inset8: 'inset-8', inset16: 'inset-16' }
    : { outer: 'w-44 h-44', main: 'w-28 h-28', core: 'w-8 h-8', inset8: 'inset-6', inset16: 'inset-12' };


  // Animation: smoothly animate orb scale over the stage duration
  const [orbScale, setOrbScale] = useState(1);
  useEffect(() => {
    let start = performance.now();
    let frame: number;
    const duration = current?.durationMs || 1200;
    const isInhale = current?.name === 'inhale';
    const isExhale = current?.name === 'exhale';
    const isHold = current?.name === 'hold' || current?.name === 'holdAfterExhale';
    const startScale = isInhale ? 1 : isExhale ? 1.18 : orbScale;
    const endScale = isInhale ? 1.18 : isExhale ? 1 : orbScale;

    function animate(now: number) {
      const elapsed = Math.min(now - start, duration);
      const progress = Math.max(0, Math.min(1, elapsed / duration));
      if (isHold) {
        setOrbScale(orbScale); // Hold keeps scale
      } else {
        setOrbScale(startScale + (endScale - startScale) * progress);
      }
      if (elapsed < duration && !isHold) {
        frame = requestAnimationFrame(animate);
      } else if (!isHold) {
        setOrbScale(endScale);
      }
    }
    setOrbScale(startScale);
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, [stageIndex]);

  // Breathing guidance text
  const getBreathText = () => {
    switch (current?.name) {
      case 'inhale':
        return 'Breathe in deeply...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out completely...';
      case 'holdAfterExhale':
        return 'Hold...';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center space-y-6 relative w-full px-4">
        {/* Guidance text (kept minimal for all entry points) */}
        <div className="max-w-md w-full text-center">
          <p className="text-xs sm:text-sm text-white/60 mb-2">💡 <span className="font-medium">Why this helps:</span> Controlled breathing calms the nervous system.</p>
        </div>

        {/* Orb container */}
        <div className={`relative ${sizes.outer} flex items-center justify-center`} key={stageIndex}>
          {/* Outer soft glow */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 opacity-30 ${variant === 'standard' ? 'blur-[60px]' : 'blur-[36px]'}`}
            style={{ transform: `scale(${orbScale})`, transition: 'none' }}
          />

          {/* Middle ring */}
          <div
            className={`${sizes.inset8} absolute rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 opacity-45 ${variant === 'standard' ? 'blur-[36px]' : 'blur-[18px]'}`}
            style={{ transform: `scale(${orbScale})`, transition: 'none' }}
          />

          {/* Thin accent ring */}
          <div
            className={`${sizes.inset16} absolute rounded-full border-2 border-blue-400/60`}
            style={{ transform: `scale(${orbScale})`, transition: 'none', boxShadow: orbScale > 1 ? '0 0 40px rgba(59,130,246,0.7)' : '0 0 20px rgba(59,130,246,0.25)' }}
          />

          {/* Main orb */}
          <div
            className={`${sizes.main} rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 flex items-center justify-center relative`}
            style={{ transform: `scale(${orbScale})`, transition: 'none', boxShadow: orbScale > 1 ? '0 0 80px rgba(6,182,212,0.9)' : '0 0 36px rgba(6,182,212,0.35)' }}
          >
            {/* Small white core to match test session */}
            <div className={`${sizes.core} rounded-full bg-white`} style={{ boxShadow: '0 0 30px rgba(255,255,255,0.9)' }} />
          </div>
        </div>

        {/* Stage progress indicators */}
        <div className="flex gap-3">
          {stages.map((s, i) => (
            <div key={s.name + i} className={`h-1 rounded-full ${i === stageIndex ? 'w-12 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'w-8 bg-white/20'}`} />
          ))}
        </div>

        {/* Breathing guidance below orb */}
        <div className="mt-8">
          <p className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2">{getBreathText()}</p>
          <p className="text-sm text-white/50 max-w-md px-4">Follow the orb as it expands and contracts</p>
        </div>
      </div>
    </>
  );
};

export default BreathworkAnimator;