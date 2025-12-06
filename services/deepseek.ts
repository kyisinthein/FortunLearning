import axios from 'axios';
import Constants from 'expo-constants';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || (Constants?.expoConfig as any)?.extra?.DEEPSEEK_API_KEY;

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class DeepSeekService {
  private static async makeRequest(messages: DeepSeekMessage[]): Promise<string> {
    if (!API_KEY) {
      throw new Error('Missing DeepSeek API key');
    }
    try {
      const response = await axios.post<DeepSeekResponse>(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const detail = status === 401 ? 'Unauthorized: invalid or missing API key' : `HTTP ${status ?? 'error'}`;
        throw new Error(`DeepSeek request failed: ${detail}`);
      }
      throw new Error('DeepSeek request failed');
    }
  }

  static async interpretBaziChart(chartData: any, name?: string): Promise<string> {
    const systemPrompt = `You are a wise and knowledgeable Bazi (Four Pillars of Destiny) master. 
    Provide insightful, educational, and positive interpretations of Bazi charts. 
    Focus on personality traits, strengths, potential challenges, and life guidance. 
    Keep explanations clear and accessible for beginners while being authentic to traditional Bazi wisdom.
    Write in plain text only. Do not use any Markdown formatting (no **, *, #, lists).`;

    const nameLine = name ? `The person's name is: ${name}.` : '';
    const userPrompt = `Please interpret this Bazi chart data: ${JSON.stringify(chartData)}. 
    Provide a comprehensive but easy-to-understand analysis covering:
    1. Overall personality and character traits
    2. Natural strengths and talents
    3. Areas for personal growth
    4. General life guidance and advice
    
    Keep the tone positive, educational, and encouraging. ${nameLine}`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return await this.makeRequest(messages);
  }

  static async getDailyInsight(chartData: any, currentDate: string, name?: string): Promise<string> {
    const systemPrompt = `You are a Bazi fortune teller providing daily insights based on traditional Chinese astrology.
    Write in plain text only. Do not use any Markdown formatting (no **, *, #, lists).`;
    
    const nameLine = name ? `The person's name is: ${name}.` : '';
    const userPrompt = `Based on this Bazi chart: ${JSON.stringify(chartData)} and today's date: ${currentDate}, 
    provide a brief daily insight focusing on:
    1. Today's energy and opportunities
    2. What to be mindful of
    3. A positive affirmation or advice
    
    Keep it concise, positive, and actionable. ${nameLine}`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return await this.makeRequest(messages);
  }

  static async explainBaziConcept(concept: string): Promise<string> {
    const systemPrompt = `You are a Bazi teacher explaining traditional Chinese astrology concepts in simple, educational terms.
    Write in plain text only. Do not use any Markdown formatting (no **, *, #, lists).`;
    
    const userPrompt = `Please explain the Bazi concept of "${concept}" in simple terms that a beginner can understand. 
    Include its significance and how it affects a person's life.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return await this.makeRequest(messages);
  }
}
