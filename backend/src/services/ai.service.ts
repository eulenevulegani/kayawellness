import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { cacheService } from '../config/redis.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export const aiService = {
  async generatePersonalizedSession(userContext: {
    mood: string;
    goals: string[];
    sessionLength: string;
    recentReflections?: string[];
  }) {
    const cacheKey = `ai:session:${JSON.stringify(userContext)}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Create a personalized wellness session based on:
- Current mood: ${userContext.mood}
- Goals: ${userContext.goals.join(', ')}
- Session length: ${userContext.sessionLength}
${userContext.recentReflections ? `- Recent reflections: ${userContext.recentReflections.join('; ')}` : ''}

Generate a JSON response with:
{
  "affirmation": "A personalized affirmation",
  "breathwork": {
    "title": "Breathwork title",
    "pattern": {"inhale": 4, "hold": 4, "exhale": 4},
    "durationMinutes": 5
  },
  "meditation": {
    "title": "Meditation title",
    "script": "Full meditation script",
    "durationMinutes": 10
  },
  "soundscape": {
    "title": "Soundscape name",
    "description": "Description of ambient sounds"
  }
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }
      
      const sessionData = JSON.parse(jsonMatch[0]);
      
      // Cache for 1 hour
      await cacheService.set(cacheKey, sessionData, 3600);
      
      return sessionData;
    } catch (error) {
      logger.error('AI session generation error:', error);
      throw error;
    }
  },

  async generateSleepStory(theme?: string) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Create a calming sleep story${theme ? ` with the theme: ${theme}` : ''}.
The story should be:
- Slow-paced and soothing
- 5-7 minutes when read slowly
- Use gentle, descriptive language
- Focus on peaceful imagery
- Help the listener relax and drift to sleep

Return JSON:
{
  "title": "Story title",
  "story": "Full story text"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('AI sleep story generation error:', error);
      throw error;
    }
  },

  async generateMoodInsights(moodHistory: Array<{ mood: string; date: Date }>) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Analyze this mood history and provide insights:
${moodHistory.map(m => `${m.date.toISOString().split('T')[0]}: ${m.mood}`).join('\n')}

Provide a JSON response with:
{
  "patterns": ["Pattern 1", "Pattern 2"],
  "trends": "Overall trend description",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "encouragement": "Encouraging message"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('AI mood insights error:', error);
      throw error;
    }
  },

  async chatWithUser(messages: Array<{ role: string; content: string }>) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          maxOutputTokens: 1000,
        }
      });

      const result = await chat.sendMessage(messages[messages.length - 1].content);
      const response = await result.response;
      
      return {
        text: response.text(),
        isFinal: false
      };
    } catch (error) {
      logger.error('AI chat error:', error);
      throw error;
    }
  }
};
