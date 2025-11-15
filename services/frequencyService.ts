/**
 * Sound Frequency Service
 * Therapeutic sound frequencies mapped to specific wellness concerns
 * Based on sound healing principles and binaural beat therapy
 */

export interface FrequencyProfile {
  name: string;
  baseFrequency: number; // Hz
  binauralBeat?: number; // Hz difference for binaural beats
  waveType: 'sine' | 'triangle' | 'square' | 'sawtooth';
  description: string;
  benefits: string[];
}

export interface SoundscapeConfig {
  concern: string;
  frequencies: FrequencyProfile[];
  ambientLayers?: {
    type: 'nature' | 'white-noise' | 'brown-noise' | 'pink-noise';
    volume: number; // 0-1
  }[];
  duration: number; // minutes
}

/**
 * Therapeutic Frequencies Database
 * Based on Solfeggio frequencies, Schumann resonance, and binaural beat research
 */
export const THERAPEUTIC_FREQUENCIES: Record<string, FrequencyProfile[]> = {
  // Anxiety & Stress Relief
  anxiety: [
    {
      name: 'Alpha Waves',
      baseFrequency: 10, // 8-13 Hz Alpha range
      binauralBeat: 10,
      waveType: 'sine',
      description: 'Promotes relaxation and reduces anxiety',
      benefits: ['Reduces cortisol', 'Calms nervous system', 'Promotes present moment awareness']
    },
    {
      name: 'Schumann Resonance',
      baseFrequency: 7.83, // Earth's natural frequency
      waveType: 'sine',
      description: 'Grounding frequency that synchronizes with Earth',
      benefits: ['Grounding', 'Stress reduction', 'Improved focus']
    },
    {
      name: '432 Hz - Natural Harmony',
      baseFrequency: 432,
      waveType: 'sine',
      description: 'Natural tuning frequency, deeply calming',
      benefits: ['Reduces anxiety', 'Heart coherence', 'Mental clarity']
    }
  ],

  // Sleep & Insomnia
  sleep: [
    {
      name: 'Delta Waves',
      baseFrequency: 2, // 0.5-4 Hz Delta range
      binauralBeat: 2,
      waveType: 'sine',
      description: 'Deep sleep brainwave frequency',
      benefits: ['Induces deep sleep', 'Physical restoration', 'Healing']
    },
    {
      name: 'Theta Waves',
      baseFrequency: 6, // 4-8 Hz Theta range
      binauralBeat: 6,
      waveType: 'sine',
      description: 'Light sleep and deep meditation',
      benefits: ['Promotes drowsiness', 'REM sleep', 'Dream states']
    },
    {
      name: '174 Hz - Pain Relief',
      baseFrequency: 174,
      waveType: 'sine',
      description: 'Solfeggio frequency for physical comfort',
      benefits: ['Physical relaxation', 'Pain reduction', 'Security']
    }
  ],

  // Focus & Concentration
  focus: [
    {
      name: 'Beta Waves',
      baseFrequency: 18, // 13-30 Hz Beta range
      binauralBeat: 18,
      waveType: 'sine',
      description: 'Alert, focused mental state',
      benefits: ['Enhanced focus', 'Mental clarity', 'Active thinking']
    },
    {
      name: 'Gamma Waves',
      baseFrequency: 40, // 30-100 Hz Gamma range
      binauralBeat: 40,
      waveType: 'sine',
      description: 'Peak cognitive performance',
      benefits: ['Peak focus', 'Information processing', 'Learning']
    },
    {
      name: '963 Hz - Crown Chakra',
      baseFrequency: 963,
      waveType: 'sine',
      description: 'Awakening intuition and consciousness',
      benefits: ['Mental clarity', 'Spiritual connection', 'Higher consciousness']
    }
  ],

  // Depression & Mood Enhancement
  depression: [
    {
      name: '528 Hz - Love Frequency',
      baseFrequency: 528,
      waveType: 'sine',
      description: 'DNA repair and transformation frequency',
      benefits: ['Mood elevation', 'Emotional healing', 'Positive energy']
    },
    {
      name: 'Alpha-Theta Bridge',
      baseFrequency: 10,
      binauralBeat: 8,
      waveType: 'sine',
      description: 'Emotional processing and release',
      benefits: ['Emotional balance', 'Creativity', 'Inner peace']
    },
    {
      name: '396 Hz - Liberation',
      baseFrequency: 396,
      waveType: 'sine',
      description: 'Liberating guilt and fear',
      benefits: ['Releases negative emotions', 'Grounding', 'Confidence']
    }
  ],

  // Meditation & Mindfulness
  meditation: [
    {
      name: 'Theta Waves',
      baseFrequency: 6,
      binauralBeat: 6,
      waveType: 'sine',
      description: 'Deep meditation state',
      benefits: ['Deep meditation', 'Intuition', 'Subconscious access']
    },
    {
      name: '852 Hz - Third Eye',
      baseFrequency: 852,
      waveType: 'sine',
      description: 'Spiritual awakening and intuition',
      benefits: ['Intuition', 'Inner wisdom', 'Spiritual insight']
    },
    {
      name: 'Om Frequency',
      baseFrequency: 136.1, // Cosmic Om
      waveType: 'sine',
      description: 'Universal sound of creation',
      benefits: ['Deep meditation', 'Spiritual connection', 'Universal harmony']
    }
  ],

  // Pain & Physical Healing
  pain: [
    {
      name: '174 Hz - Foundation',
      baseFrequency: 174,
      waveType: 'sine',
      description: 'Physical foundation and pain relief',
      benefits: ['Pain reduction', 'Physical comfort', 'Grounding']
    },
    {
      name: '285 Hz - Tissue Healing',
      baseFrequency: 285,
      waveType: 'sine',
      description: 'Cellular regeneration',
      benefits: ['Tissue repair', 'Energy field restoration', 'Physical healing']
    },
    {
      name: 'Delta Waves',
      baseFrequency: 2,
      binauralBeat: 2,
      waveType: 'sine',
      description: 'Deep healing and restoration',
      benefits: ['Physical healing', 'Deep relaxation', 'Pain management']
    }
  ],

  // Energy & Vitality
  energy: [
    {
      name: 'Beta Waves',
      baseFrequency: 20,
      binauralBeat: 20,
      waveType: 'sine',
      description: 'Alert, energized state',
      benefits: ['Increased energy', 'Alertness', 'Motivation']
    },
    {
      name: '741 Hz - Expression',
      baseFrequency: 741,
      waveType: 'sine',
      description: 'Awakening intuition and expression',
      benefits: ['Mental energy', 'Self-expression', 'Problem solving']
    },
    {
      name: 'Gamma Waves',
      baseFrequency: 40,
      binauralBeat: 40,
      waveType: 'sine',
      description: 'Peak performance state',
      benefits: ['Peak energy', 'Cognitive enhancement', 'Vitality']
    }
  ],

  // Heart & Emotional Healing
  heartHealing: [
    {
      name: '639 Hz - Connection',
      baseFrequency: 639,
      waveType: 'sine',
      description: 'Heart chakra and relationships',
      benefits: ['Emotional healing', 'Compassion', 'Connection']
    },
    {
      name: '528 Hz - Love',
      baseFrequency: 528,
      waveType: 'sine',
      description: 'Miracle frequency for transformation',
      benefits: ['Love', 'Compassion', 'DNA repair']
    },
    {
      name: 'Alpha Waves',
      baseFrequency: 10,
      binauralBeat: 10,
      waveType: 'sine',
      description: 'Emotional balance',
      benefits: ['Emotional stability', 'Self-love', 'Inner peace']
    }
  ]
};

/**
 * Map user goals/concerns to frequency profiles
 */
export function getFrequenciesForConcern(concern: string): FrequencyProfile[] {
  const concernMap: Record<string, string> = {
    'manage stress': 'anxiety',
    'manage anxiety': 'anxiety',
    'improve sleep': 'sleep',
    'increase focus': 'focus',
    'overcome depression': 'depression',
    'build resilience': 'heartHealing',
    'manage relationships': 'heartHealing',
    'work-life balance': 'anxiety',
    'practice gratitude': 'meditation',
    'build self-esteem': 'heartHealing',
    'process anxiety': 'anxiety'
  };

  const concernKey = concernMap[concern.toLowerCase()] || 'meditation';
  return THERAPEUTIC_FREQUENCIES[concernKey] || THERAPEUTIC_FREQUENCIES.meditation;
}

/**
 * Generate soundscape configuration based on user profile
 */
export function generateSoundscapeConfig(
  concerns: string[],
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night',
  duration: number = 10
): SoundscapeConfig {
  // Primary concern determines base frequencies
  const primaryConcern = concerns[0] || 'meditation';
  const frequencies = getFrequenciesForConcern(primaryConcern);

  // Time of day influences ambient layers
  let ambientLayers: SoundscapeConfig['ambientLayers'] = [];

  switch (timeOfDay) {
    case 'morning':
      ambientLayers = [
        { type: 'nature', volume: 0.3 }, // Birds, morning sounds
        { type: 'white-noise', volume: 0.1 } // Gentle clarity
      ];
      break;
    case 'afternoon':
      ambientLayers = [
        { type: 'pink-noise', volume: 0.2 }, // Balanced, calming
        { type: 'nature', volume: 0.2 } // Subtle nature sounds
      ];
      break;
    case 'evening':
      ambientLayers = [
        { type: 'brown-noise', volume: 0.3 }, // Deep, relaxing
        { type: 'nature', volume: 0.2 } // Evening crickets, gentle wind
      ];
      break;
    case 'night':
      ambientLayers = [
        { type: 'brown-noise', volume: 0.4 }, // Deep sleep support
        { type: 'nature', volume: 0.1 } // Very subtle night sounds
      ];
      break;
  }

  return {
    concern: primaryConcern,
    frequencies,
    ambientLayers,
    duration
  };
}

/**
 * Web Audio API implementation for generating therapeutic frequencies
 */
export class FrequencyGenerator {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Play a frequency profile
   */
  play(profile: FrequencyProfile, volume: number = 0.3): void {
    if (!this.audioContext) return;

    // create gain node for volume control
    const gain = this.audioContext.createGain();
    gain.gain.value = 0.0; // start silent for fade-in
    gain.connect(this.audioContext.destination);
    this.gainNodes.push(gain);

    // If binauralBeat is provided and > 0, create two oscillators panned left/right
    if (profile.binauralBeat && profile.binauralBeat > 0) {
      const leftOsc = this.audioContext.createOscillator();
      const rightOsc = this.audioContext.createOscillator();

      // center frequency split across two channels
      const diff = profile.binauralBeat / 2;
      leftOsc.frequency.value = Math.max(0.1, profile.baseFrequency - diff);
      rightOsc.frequency.value = Math.max(0.1, profile.baseFrequency + diff);

      leftOsc.type = profile.waveType as OscillatorType;
      rightOsc.type = profile.waveType as OscillatorType;

      // create channel splitter via StereoPanner for simple lateralization
      const leftPan = this.audioContext.createStereoPanner();
      leftPan.pan.value = -0.8;
      const rightPan = this.audioContext.createStereoPanner();
      rightPan.pan.value = 0.8;

      leftOsc.connect(leftPan);
      rightOsc.connect(rightPan);
      leftPan.connect(gain);
      rightPan.connect(gain);

      leftOsc.start();
      rightOsc.start();

      this.oscillators.push(leftOsc as OscillatorNode, rightOsc as OscillatorNode);
    } else {
      // single oscillator
      const osc = this.audioContext.createOscillator();
      osc.frequency.value = Math.max(0.1, profile.baseFrequency);
      osc.type = profile.waveType as OscillatorType;
      osc.connect(gain);
      osc.start();
      this.oscillators.push(osc as OscillatorNode);
    }

    // Fade-in
    try {
      const now = this.audioContext.currentTime;
      gain.gain.linearRampToValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 1.0);
    } catch (e) {
      // ignore
      gain.gain.value = volume;
    }

    this.isPlaying = true;
  }

  /**
   * Stop all frequencies
   */
  stop(): void {
    if (!this.audioContext) return;

    // Fade out
    this.gainNodes.forEach(gain => {
      gain.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 2);
    });

    // Stop oscillators after fade
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      this.oscillators = [];
      this.gainNodes = [];
      this.isPlaying = false;
    }, 2100);
  }

  /**
   * Play multiple frequencies simultaneously (soundscape)
   */
  playSoundscape(config: SoundscapeConfig): void {
    if (!this.audioContext) return;

    // Ensure context is running (resume on user gesture)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }

    // Stop any existing soundscape first
    this.stop();

    // Play ambient layers (noise generators)
    if (config.ambientLayers && config.ambientLayers.length > 0) {
      config.ambientLayers.forEach(layer => {
        const gain = this.audioContext!.createGain();
        gain.gain.value = 0.0;
        gain.connect(this.audioContext!.destination);
        this.gainNodes.push(gain);

        // Create white noise buffer
        const bufferSize = this.audioContext!.sampleRate * 2; // 2 seconds buffer
        const buffer = this.audioContext!.createBuffer(1, bufferSize, this.audioContext!.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const src = this.audioContext!.createBufferSource();
        src.buffer = buffer;
        src.loop = true;

        // apply simple filter to approximate pink/brown noise
        const filter = this.audioContext!.createBiquadFilter();
        if (layer.type === 'pink-noise') {
          filter.type = 'lowpass';
          filter.frequency.value = 1200;
        } else if (layer.type === 'brown-noise') {
          filter.type = 'lowpass';
          filter.frequency.value = 800;
        } else {
          filter.type = 'bandpass';
          filter.frequency.value = 1000;
        }

        src.connect(filter);
        filter.connect(gain);
        src.start();
        // keep reference so we can stop later
        (this.oscillators as any).push(src);

        // Fade-in to target volume
        const now = this.audioContext!.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(layer.volume, now + 1.0);
      });
    }

    // Play each configured frequency with subtle balancing
    const baseVolume = 0.08;
    config.frequencies.forEach((f, i) => {
      // spread volume across layers
      const vol = baseVolume * (1 + (config.frequencies.length - i) * 0.5);
      this.play(f, Math.min(vol, 0.45));
    });

    this.isPlaying = true;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const frequencyGenerator = new FrequencyGenerator();
export default frequencyGenerator;
