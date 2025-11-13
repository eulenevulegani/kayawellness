import React, { useState } from 'react';
import { ShareIcon } from './Icons';

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
        <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in h-full flex flex-col justify-center text-center">
            <header className="mb-12">
                <h1 className="text-3xl font-light text-white">A Moment of Intention</h1>
                <p className="text-white/70 mt-2">Take this in at your own pace. You might read it silently, say it aloud, or simply let it resonate.</p>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center space-y-6">
                <p className="text-xs text-white/50 max-w-md">
                    There's no pressure to believe this fully right now. Sometimes affirmations work by creating gentle possibilities.
                </p>
                <blockquote className="max-w-xl">
                    <p className="text-4xl md:text-5xl font-medium text-white italic leading-relaxed animate-gentle-pulse">
                        "{affirmation}"
                    </p>
                </blockquote>
            </main>

            <footer className="mt-12 space-y-4">
                 <button 
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 mx-auto px-5 py-2 bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors text-sm"
                    >
                    <ShareIcon className="w-4 h-4"/>
                    {copied ? 'Copied!' : 'Share'}
                </button>
                <button
                    onClick={onContinue}
                    className="w-full max-w-xs mx-auto px-12 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-opacity-90 transform hover:scale-105 transition duration-300"
                >
                    Continue to Session
                </button>
            </footer>
        </div>
    );
}

export default Affirmation;
