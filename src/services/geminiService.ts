export class GeminiService {
  private static readonly API_KEY = 'AIzaSyCFytxjsgQ12GNWZiWwoIZcgaCUi1hN0OI';
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  static async generateResponse(userMessage: string, conversationHistory: string[] = []): Promise<string | null> {
    try {
      console.log('🤖 Calling Gemini AI for:', userMessage);

      // Build context from recent conversation
      let context = '';
      if (conversationHistory.length > 0) {
        context = 'Recent conversation:\n' + conversationHistory.slice(-6).join('\n') + '\n\n';
      }

      // Create the prompt
      const prompt = `${context}You are SenTorial-CHAT, a friendly and helpful AI assistant. Respond naturally and conversationally to: "${userMessage}"

Keep your response:
- Conversational and friendly
- Helpful and informative
- Under 200 words
- Natural, like talking to a friend`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.API_KEY,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.error('❌ Gemini API error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return null;
      }

      const data = await response.json();
      console.log('✅ Gemini API response:', data);

      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        const aiResponse = data.candidates[0].content.parts[0].text.trim();
        console.log('🎯 Generated response:', aiResponse);
        return aiResponse;
      }

      console.warn('⚠️ Unexpected Gemini response format:', data);
      return null;

    } catch (error) {
      console.error('❌ Gemini AI error:', error);
      return null;
    }
  }

  static getSmartFallback(userMessage: string): string {
    const message = userMessage.toLowerCase().trim();
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      const greetings = [
        "Hello! How can I help you today? 😊",
        "Hi there! What's on your mind?",
        "Hey! Great to see you here!",
        "Hello! I'm here and ready to chat!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Question responses
    if (message.includes('?') || message.startsWith('what') || message.startsWith('how') || message.startsWith('why')) {
      const questionResponses = [
        "That's an interesting question! I'd love to help you explore that topic. 🤔",
        "Great question! Let me think about that for you.",
        "I find that topic fascinating! What specifically interests you about it?",
        "That's something worth discussing! What's your take on it?"
      ];
      return questionResponses[Math.floor(Math.random() * questionResponses.length)];
    }

    // General conversation
    const generalResponses = [
      "That's interesting! Tell me more about what you're thinking. 💭",
      "I appreciate you sharing that with me! What else is on your mind?",
      "Thanks for chatting with me! I enjoy our conversations. 😊",
      "That's a great point! I'd love to hear more of your thoughts.",
      "Interesting perspective! What made you think about that?",
      "I'm here to chat about whatever interests you! 🌟"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }
}