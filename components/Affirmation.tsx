import React, { useState } from 'react';
import { ShareIcon } from './Icons';
import KayaLogo from './KayaLogo';

interface AffirmationProps {
  affirmation: string;
  userName: string;
  onContinue: () => void;
}

const Affirmation: React.FC<AffirmationProps> = ({ affirmation, userName, onContinue }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: `Kaya Affirmation for ${userName}`,
            text: `My personal affirmation from Kaya today: "${affirmation}"`,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback to copy
            navigator.clipboard.writeText(shareData.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-gray-900 to-black animate-fade-in p-4">
            {/* Kaya branding */}
                        <div className="flex items-center gap-2 mb-6 select-none">
                                {/* Official KAYA orb logo with text, as on landing page */}
                                <span className="flex items-center gap-2">
                                    <span className="block"><KayaLogo size={40} animated={true} className="w-10 h-10" /></span>
                                    <span className="text-2xl font-bold tracking-widest text-cyan-300 drop-shadow">KAYA</span>
                                </span>
                        </div>
            <header className="mb-6 text-center">
                <h1 className="text-2xl font-semibold text-white tracking-wide mb-1">A Moment of Intention</h1>
                <p className="text-white/60 text-sm max-w-lg mx-auto">Take this in at your own pace. Read it silently, say it aloud, or simply let it resonate.</p>
            </header>
            <main className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
                <blockquote className="relative bg-gradient-to-br from-cyan-900/60 to-teal-800/60 border border-cyan-400/20 rounded-2xl shadow-xl px-6 py-8 md:px-10 md:py-10 mb-8 w-full text-center">
                    <p className="text-xl md:text-2xl font-medium text-white italic leading-snug tracking-wide drop-shadow-lg">
                        “{affirmation}”
                    </p>
                </blockquote>
            </main>
            <footer className="flex flex-col items-center gap-4 mt-4 w-full max-w-xs mx-auto">
                <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-cyan-400/90 text-cyan-900 font-semibold rounded-full shadow hover:bg-cyan-300 transition-colors text-base w-full"
                >
                    <ShareIcon className="w-5 h-5"/>
                    {copied ? 'Copied!' : 'Share'}
                </button>
                <button
                    onClick={onContinue}
                    className="px-8 py-3 bg-white text-cyan-900 rounded-full font-bold text-base shadow hover:bg-cyan-100 transition w-full"
                >
                    Continue to Session
                </button>
            </footer>
        </div>
    );
}

export default Affirmation;
