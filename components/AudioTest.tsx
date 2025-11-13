import React, { useState, useRef } from 'react';
import { frequencyGenerator } from '../services/frequencyService';

const AudioTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTestingFreq, setIsTestingFreq] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testWebAudioAPI = async () => {
    addResult('Testing Web Audio API...');
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        addResult('❌ Web Audio API not supported');
        return;
      }
      addResult('✅ Web Audio API supported');

      const ctx = new AudioContext();
      addResult(`✅ AudioContext created, state: ${ctx.state}`);

      if (ctx.state === 'suspended') {
        await ctx.resume();
        addResult(`✅ AudioContext resumed, new state: ${ctx.state}`);
      }

      // Test simple beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = 440; // A note
      gain.gain.value = 0.1;
      
      osc.start();
      addResult('✅ Playing 440Hz test tone for 1 second...');
      
      setTimeout(() => {
        osc.stop();
        ctx.close();
        addResult('✅ Test tone complete');
      }, 1000);

    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const testFrequencyService = () => {
    addResult('Testing Frequency Service...');
    try {
      if (isTestingFreq) {
        frequencyGenerator.stop();
        setIsTestingFreq(false);
        addResult('✅ Frequency stopped');
      } else {
        frequencyGenerator.play({
          name: 'Test Frequency',
          baseFrequency: 432,
          waveType: 'sine',
          description: 'Test',
          benefits: []
        }, 0.1);
        setIsTestingFreq(true);
        addResult('✅ Playing 432Hz via Frequency Service');
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const testHTMLAudio = () => {
    addResult('Testing HTML5 Audio...');
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      // Test with a known working audio file
      audioRef.current.src = 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3';
      audioRef.current.volume = 0.3;
      
      audioRef.current.play()
        .then(() => addResult('✅ HTML5 Audio playing'))
        .catch(err => addResult(`❌ HTML5 Audio error: ${err.message}`));

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          addResult('✅ HTML5 Audio stopped');
        }
      }, 3000);

    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-white mb-8">🔊 Audio System Test</h1>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-2xl font-light text-white mb-4">Run Tests</h2>
          
          <button
            onClick={testWebAudioAPI}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-white py-3 px-6 rounded-lg transition-all"
          >
            Test Web Audio API (440Hz beep)
          </button>

          <button
            onClick={testFrequencyService}
            className="w-full bg-teal-500/20 hover:bg-teal-500/30 text-white py-3 px-6 rounded-lg transition-all"
          >
            {isTestingFreq ? 'Stop' : 'Test'} Frequency Service (432Hz)
          </button>

          <button
            onClick={testHTMLAudio}
            className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-white py-3 px-6 rounded-lg transition-all"
          >
            Test HTML5 Audio (rain sound)
          </button>

          <button
            onClick={clearResults}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-white py-3 px-6 rounded-lg transition-all"
          >
            Clear Results
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h2 className="text-2xl font-light text-white mb-4">Test Results</h2>
          <div className="bg-black/30 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {testResults.length === 0 ? (
              <p className="text-white/50">No tests run yet. Click a button above to start testing.</p>
            ) : (
              testResults.map((result, i) => (
                <div key={i} className="text-white/90 mb-2">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-500/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
          <h3 className="text-xl font-light text-yellow-300 mb-3">⚠️ Common Issues</h3>
          <ul className="text-white/80 space-y-2 text-sm">
            <li>• <strong>Autoplay Policy:</strong> Browsers block audio until user interaction. Click buttons to enable.</li>
            <li>• <strong>HTTPS Required:</strong> Some audio features require HTTPS in production.</li>
            <li>• <strong>Browser Support:</strong> Use Chrome, Firefox, or Edge for best results.</li>
            <li>• <strong>Volume:</strong> Check system volume and browser tab isn't muted.</li>
            <li>• <strong>AudioContext Suspended:</strong> Click anywhere on page first to resume.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioTest;
