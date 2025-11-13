import { UserProfile, SessionHistoryEntry, SleepStoryData, MeditationItem, BreathworkItem, SoundscapeItem, PersonalizedSessionData, Achievement, ChatMessage, ChatResponse } from '../types';
import contextService, { UserContext } from './contextService';
import apiClient, { handleApiError } from './api.client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Use free Gemini model (gemini-1.5-flash-latest has generous free tier)
// Alternative: gemini-1.5-pro-latest (more capable but lower rate limits)
const GEMINI_MODEL = 'gemini-1.5-flash-latest';

// Lazy-load Gemini client (only initialize when first needed)
let genAI: GoogleGenerativeAI | null = null;
let initAttempted = false;

const getGeminiClient = (): GoogleGenerativeAI | null => {
  if (initAttempted) return genAI;
  
  initAttempted = true;
  
  try {
    if (GEMINI_API_KEY && GEMINI_API_KEY.length > 20 && GEMINI_API_KEY !== 'your-api-key-here') {
      genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      console.log(`✅ Gemini AI initialized successfully using ${GEMINI_MODEL}`);
      return genAI;
    } else {
      console.warn('⚠️ No valid Gemini API key found, using fallback responses');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error);
    return null;
  }
};

// Fallback to mock responses if no client-side key
const useBackendAI = !GEMINI_API_KEY || GEMINI_API_KEY.length < 20;

// Mock image generation for meditation visuals (SVG gradients)
const mockVisuals = [
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#a855f7" /><stop offset="100%" stop-color="#3b0764" /></radialGradient></defs><rect width="100" height="100" fill="url(#g1)" /></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g2" cx="20%" cy="80%" r="60%"><stop offset="0%" stop-color="#22d3ee" /><stop offset="100%" stop-color="#0e7490" /></radialGradient></defs><rect width="100" height="100" fill="url(#g2)" /></svg>'),
  'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g3" cx="80%" cy="20%" r="70%"><stop offset="0%" stop-color="#f472b6" /><stop offset="100%" stop-color="#be185d" /></radialGradient></defs><rect width="100" height="100" fill="url(#g3)" /></svg>'),
];
let visualIndex = 0;

export const generateMeditationVisual = async (prompt: string): Promise<string> => {
    console.log("Generating meditation visual for prompt:", prompt);
    // Using SVG gradients for now - could integrate with image generation API later
    const visual = mockVisuals[visualIndex];
    visualIndex = (visualIndex + 1) % mockVisuals.length;
    return visual;
};

// Generate contextually aware chat response using user context
export const continueChatWithContext = async (
    history: ChatMessage[], 
    userContext?: UserContext
): Promise<ChatResponse> => {
    try {
        if (useBackendAI) {
            // Use backend AI service
            const response = await apiClient.post<ChatResponse>('/ai/chat', {
                history,
                userContext
            });
            return response.data;
        }
        
        // Use Gemini directly
        const client = getGeminiClient();
        if (!client) {
            throw new Error('Gemini API not configured');
        }
        
        const model = client.getGenerativeModel({ model: GEMINI_MODEL });
        const lastUserMessage = history.filter(m => m.author === 'user').pop()?.text || '';
        
        // Build context-aware prompt
        let contextNote = '';
        if (userContext) {
            contextNote = `\n\nContext about the user:
- Time of day: ${userContext.timeOfDay}
- ${userContext.nextEvent ? `Upcoming event: ${userContext.nextEvent.title}` : 'No upcoming events'}
- ${userContext.streakDays ? `Current streak: ${userContext.streakDays} days` : ''}`;
        }
        
        const conversationHistory = history.map(m => 
            `${m.author === 'user' ? 'User' : 'KAYA'}: ${m.text}`
        ).join('\n');
        
        const prompt = `You are KAYA, a compassionate AI wellness companion. Continue this conversation naturally.
${contextNote}

Previous conversation:
${conversationHistory}

Respond as KAYA with empathy. If the user has shared enough about their current state, indicate readiness to create a personalized session by ending with "[READY_FOR_SESSION]".`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const isFinal = text.includes('[READY_FOR_SESSION]');
        const cleanText = text.replace('[READY_FOR_SESSION]', '').trim();
        
        return { text: cleanText, isFinal };
    } catch (error) {
        console.error('Chat generation error:', error);
        throw new Error(handleApiError(error));
    }
};

// Backwards compatibility - calls continueChatWithContext without context
export const continueChat = async (history: ChatMessage[]): Promise<ChatResponse> => {
    return continueChatWithContext(history);
};


export const generatePersonalizedSession = async (
    conversationContext: string,
    userProfile: UserProfile,
    programContext?: { title: string; day: number; theme: string }
): Promise<PersonalizedSessionData> => {
    try {
        if (useBackendAI) {
            // Use backend AI service
            const response = await apiClient.post<PersonalizedSessionData>('/ai/generate-session', {
                context: conversationContext,
                userProfile,
                programContext
            });
            return response.data;
        }
        
        // Use Gemini directly
        const client = getGeminiClient();
        if (!client) {
            throw new Error('Gemini API not configured');
        }
        
        const model = client.getGenerativeModel({ model: GEMINI_MODEL });
        
        // Determine experience level for appropriate guidance
        const experienceLevel = userProfile.experienceLevel || 'beginner';
        const guidanceLevel = experienceLevel === 'beginner' ? 'detailed, gentle guidance with clear instructions' : 
                            experienceLevel === 'intermediate' ? 'moderate guidance with some independence' : 
                            'minimal guidance, allowing for self-directed practice';
        
        const prompt = `Create a personalized wellness session for ${userProfile.name} (Experience level: ${experienceLevel}).

Context: ${conversationContext}
Goals: ${userProfile.goals.join(', ')}
Session Length: ${userProfile.sessionLength}
${programContext ? `Program: ${programContext.title} - Day ${programContext.day}: ${programContext.theme}` : ''}

WELLNESS GUIDELINES (IMPORTANT):
1. Use gentle, inviting language:
   - Instead of "Relax" or "Clear your mind" → use "Allow yourself to...", "You might notice...", "If it feels comfortable..."
   - Never command - always invite
   - Include permission: "There's no right way to do this" or "Whatever you notice is okay"

2. Include simple explanations in meditation script:
   - Briefly explain WHY this technique helps wellbeing (1-2 sentences, simple language)
   - Example: "This breathing pattern helps activate your body's natural calming response" or "This practice can help bring a sense of calm"
   - Keep it accessible - we're about wellbeing, not medical treatment

3. Provide ${guidanceLevel}:
   - Beginners need: step-by-step instructions, frequent anchors, reassurance that mind-wandering is normal
   - Advanced practitioners need: space for self-discovery, fewer explicit instructions

4. Include safety and permission statements:
   - "You can pause or stop at any time"
   - "Notice without judgment - whatever arises is welcome"
   - "If any sensation feels uncomfortable, you can return to natural breathing"

Generate a JSON object with:
1. soundscape: { title: string, description: string }
2. steps: array of:
   - { type: 'affirmation', data: { text: string (use permissive language, not commanding) } }
   - { type: 'breathwork', data: { title: string, pattern: { inhale: number (start gentle, 4-6 seconds max for beginners), hold: number, exhale: number, holdAfterExhale?: number } } }
   - { type: 'meditation', data: { 
       title: string, 
       script: string (MUST include: 1) welcoming permission statement, 2) simple explanation about why this practice supports wellbeing, 3) gentle invitations not commands, 4) acknowledgment that mind-wandering is normal, 5) integration/closing),
       durationMinutes: number 
     } }

Make it personalized, compassionate, supportive, and contextually appropriate. Remember: we support wellbeing through mindfulness practices, not medical treatment.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Try to parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        // Fallback if parsing fails
        throw new Error('Failed to generate valid session');
    } catch (error) {
        console.error('Session generation error:', error);
        // Return wellbeing-focused fallback session
        const isBeginnerLevel = !userProfile.experienceLevel || userProfile.experienceLevel === 'beginner';
        
        return {
            soundscape: { 
                title: 'Gentle Rain', 
                description: 'Soft, natural rain sounds that may help you feel grounded and present.' 
            },
            steps: [
                { 
                    type: 'affirmation', 
                    data: { 
                        text: `${userProfile.name}, you might notice that you are present in this moment. Whatever you're feeling right now is okay.` 
                    } 
                },
                { 
                    type: 'breathwork', 
                    data: { 
                        title: 'Gentle Equal Breathing', 
                        pattern: { inhale: 4, hold: 0, exhale: 4 } // Gentle, no holding for beginners
                    } 
                },
                { 
                    type: 'meditation', 
                    data: { 
                        title: 'Mindful Presence', 
                        script: `Welcome, ${userProfile.name}. You can pause or stop at any time - there's no pressure here.

${isBeginnerLevel ? 'If you\'re new to this, know that it\'s completely normal for your mind to wander. That\'s not a mistake - it\'s just what minds do. Each time you notice, that\'s actually a moment of awareness.' : ''}

Let's take a few moments together. This breathing practice can help activate your body's natural calming response, bringing a sense of ease and peace.

If it feels comfortable, you might allow your eyes to close, or simply soften your gaze downward. You might notice your breath, without trying to change it. ${isBeginnerLevel ? 'There\'s no need to breathe in any special way.' : ''}

You might notice sensations in your body - perhaps where your body touches the chair or floor. You might notice sounds around you. Whatever you notice is welcome here.

${isBeginnerLevel ? 'If your mind wanders to thoughts, that\'s perfectly okay. You can gently, without judgment, return your attention to your breath or body, as many times as you need.' : 'When thoughts arise, you might simply acknowledge them and return to this moment.'}

There's no right way to do this. You're simply here, allowing yourself this time.

As we close, you might take a fuller breath if that feels good to you. And when you're ready, you can open your eyes, bringing this sense of presence with you into the rest of your day.`, 
                        durationMinutes: 3 
                    } 
                }
            ]
        };
    }
};

export const generateSleepStory = async (theme: string): Promise<SleepStoryData> => {
    try {
        if (useBackendAI) {
            const response = await apiClient.post<SleepStoryData>('/ai/sleep-story', { theme });
            return response.data;
        }
        
        const client = getGeminiClient();
        if (!client) throw new Error('Gemini API not configured');
        
        const model = client.getGenerativeModel({ model: GEMINI_MODEL });
        const prompt = `Write a calming, 3-minute sleep story about ${theme}. Use gentle, descriptive language. Focus on peaceful imagery and slow pacing.`;
        
        const result = await model.generateContent(prompt);
        const story = (await result.response).text();
        
        return {
            title: `The Silent Stream of ${theme}`,
            story: story
        };
    } catch (error) {
        console.error('Sleep story generation error:', error);
        return {
            title: `The Silent Stream of ${theme}`,
            story: "Imagine a gentle stream flowing through a quiet, moonlit forest under a sky full of stars. The water whispers over smooth, ancient stones, carrying away the worries of the day, leaving only peace behind. Each ripple reflects the gentle moonlight. You are safe here, you are calm, and it is time to rest."
        };
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    console.log("Generating speech for text:", text.substring(0, 40) + '...');
    // Text-to-speech would require additional API (Google Cloud TTS, Amazon Polly, etc.)
    // For now, returning null to indicate no audio available
    return null;
};

export const generateJournalPrompts = async (context: string): Promise<string[]> => {
    try {
        if (useBackendAI) {
            const response = await apiClient.post<{ prompts: string[] }>('/ai/journal-prompts', { context });
            return response.data.prompts;
        }
        
        const client = getGeminiClient();
        if (!client) throw new Error('Gemini API not configured');
        
        const model = client.getGenerativeModel({ model: GEMINI_MODEL });
        const prompt = `Generate 3 thoughtful journaling prompts for someone who is ${context}. Make them introspective and supportive.`;
        
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        
        // Parse prompts from response
        const prompts = text.split('\n').filter(line => line.trim().match(/^\d+[\.)]/)).map(line => 
            line.replace(/^\d+[\.)]?\s*/, '').trim()
        );
        
        return prompts.length >= 3 ? prompts.slice(0, 3) : [
            "What is one thing you can do to be kinder to yourself today?",
            "Describe a recent moment of peace, no matter how small.",
            "What is taking up most of your headspace right now?"
        ];
    } catch (error) {
        console.error('Journal prompts error:', error);
        return [
            "What is one thing you can do to be kinder to yourself today?",
            "Describe a recent moment of peace, no matter how small.",
            "What is taking up most of your headspace right now?"
        ];
    }
};

export const generateFollowUpPrompt = async (entry: string): Promise<string> => {
    try {
        if (useBackendAI) {
            const response = await apiClient.post<{ prompt: string }>('/ai/journal-followup', { entry });
            return response.data.prompt;
        }
        
        const client = getGeminiClient();
        if (!client) throw new Error('Gemini API not configured');
        
        const model = client.getGenerativeModel({ model: GEMINI_MODEL });
        const prompt = `The user wrote: "${entry}". Generate a brief, empathetic follow-up question to deepen their reflection.`;
        
        const result = await model.generateContent(prompt);
        return (await result.response).text();
    } catch (error) {
        console.error('Follow-up prompt error:', error);
        return "That's a powerful reflection. How did that make you feel in your body?";
    }
};

export const generateWeeklyInsight = async (history: SessionHistoryEntry[]): Promise<string> => {
    if (history.length < 2) {
        return "Keep journaling this week to unlock your first insight!";
    }
    
    try {
        if (useBackendAI) {
            const response = await apiClient.post<{ insight: string }>('/ai/weekly-insight', { history });
            return response.data.insight;
        }
        
        const client = getGeminiClient();
        if (!client) throw new Error('Gemini API not configured');
        
        const model = client.getGenerativeModel({ model: GEMINI_MODEL });
        const moodSummary = history.map(h => h.mood).join(', ');
        const prompt = `Based on these moods over the week: ${moodSummary}. Generate a brief, supportive insight about patterns or progress.`;
        
        const result = await model.generateContent(prompt);
        return (await result.response).text();
    } catch (error) {
        console.error('Weekly insight error:', error);
        return "It seems that finding moments of quiet has been a recurring theme for you this week. Continue to cherish these small pauses.";
    }
};

export const generateAchievement = async (mood: string, reflection: string): Promise<Omit<Achievement, 'date'>> => {
    try {
        if (useBackendAI) {
            const response = await apiClient.post<Omit<Achievement, 'date'>>('/ai/achievement', { mood, reflection });
            return response.data;
        }
        
        return {
            title: "Reflection Rockstar",
            description: "You took a moment to reflect on your feelings, a true act of self-awareness."
        };
    } catch (error) {
        console.error('Achievement generation error:', error);
        return {
            title: "Reflection Rockstar",
            description: "You took a moment to reflect on your feelings, a true act of self-awareness."
        };
    }
};

export const getMeditationsForMood = async (mood: string): Promise<MeditationItem[]> => {
    try {
        const response = await apiClient.get<MeditationItem[]>(`/content/meditations?mood=${mood}`);
        return response.data;
    } catch (error) {
        console.error('Meditations fetch error:', error);
        return [
            { title: `Peaceful Breath for ${mood}`, script: "Focus on your breath, letting go of all that doesn't serve you.", durationMinutes: 3 },
            { title: "Mindful Body Scan", script: "Gently bring your awareness to each part of your body, from your toes to your head.", durationMinutes: 5 },
            { title: "Loving Kindness", script: "Extend warmth and kindness to yourself and others.", durationMinutes: 4 },
        ];
    }
};

export const getBreathworkForMood = async (mood: string): Promise<BreathworkItem[]> => {
    try {
        const response = await apiClient.get<BreathworkItem[]>(`/content/breathwork?mood=${mood}`);
        return response.data;
    } catch (error) {
        console.error('Breathwork fetch error:', error);
        return [
            { title: `Calming 4-7-8 Breath`, pattern: { inhale: 4, hold: 7, exhale: 8 } },
            { title: "Equal Breathing", pattern: { inhale: 4, hold: 0, exhale: 4 } },
            { title: "Uplifting Three-Part Breath", pattern: { inhale: 3, hold: 0, exhale: 6 } },
        ];
    }
};

export const getSoundscapesForMood = async (mood: string): Promise<SoundscapeItem[]> => {
    try {
        const response = await apiClient.get<SoundscapeItem[]>(`/content/soundscapes?mood=${mood}`);
        return response.data;
    } catch (error) {
        console.error('Soundscapes fetch error:', error);
        return [
            { title: "Gentle Rain", description: "Soft raindrops on a window pane." },
            { title: "Crackling Fireplace", description: "The warm, comforting sound of a fire." },
            { title: "Distant Thunder", description: "The powerful yet soothing rumble of a storm." },
        ];
    }
};