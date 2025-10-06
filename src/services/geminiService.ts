import { WebSearchService } from './webSearchService';

export class GeminiService {
  private static readonly API_KEY = 'AIzaSyCFytxjsgQ12GNWZiWwoIZcgaCUi1hN0OI';
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  // SenTorial website knowledge base
  private static readonly SENTORIAL_KNOWLEDGE = `
SenTorial Website Information:
Main Website: https://sentorial.vercel.app/

Key Pages & Features:
- Custom Pre-order: https://sentorial.vercel.app/custom-preorder (Order custom candles)
- Candle Customizer: https://sentorial.vercel.app/candle-customizer (Design your own candles)
- Reviews: https://sentorial.vercel.app/reviews (Customer testimonials and feedback)
- Profile: https://sentorial.vercel.app/profile (User account management)

SSenTorial also offers premium candles because it has a special collaboration with Candarial, a dedicated premium candle company. Through this partnership, SenTorial features Candarial's high-quality candles, which include:

- Custom handmade candles

- Personalized scent combinations

- High-quality wax and materials

- Unique designs and customization options

- Professional candle-making services

-Premium Candle Selection: Featuring scents and designs curated by Candarial.

-High-Quality Materials: Utilizing the professional-grade wax and materials Candarial is known for.

-Unique Gift Options: Allowing SenTorial's customers to grab a premium, high-end candle alongside their anime gear and keychains.

Navigation Help: To create a perfect custom candle:
- Visit the main site to browse products
- Press on the "Custom Candles" button on the navbar
- Use the customizer to design your perfect candle
- Check reviews to see what customers say
- Pre-order custom candles for special occasions
- Manage your orders through your profile

Always provide the relevant links when users ask about SenTorial services!
`;

  static async generateResponse(userMessage: string, conversationHistory: string[] = []): Promise<string | null> {
    try {
      console.log('🤖 Calling Gemini AI for:', userMessage);

      // Search site content for additional context
      const siteContent = await WebSearchService.searchSiteContent(userMessage);
      let additionalContext = '';
      
      if (siteContent) {
        additionalContext = `\n\nAdditional context from SenTorial website: ${siteContent}`;
        console.log('🌐 Found relevant site content');
      }

      // Build context from recent conversation
      let context = '';
      if (conversationHistory.length > 0) {
        context = 'Recent conversation:\n' + conversationHistory.slice(-6).join('\n') + '\n\n';
      }

      // Create the prompt
      const prompt = `${context}You are SenTorial-CHAT, a friendly and helpful AI assistant created by Abdul Ahad for SenTorial. SenTorial is an online shopping site that mainly sells Anime items, Keychains, and Beyblades. SenTorial has collaborated with Candarial, a premium candle company, and now sells Candarial's premium candles.  You can use markdown formatting in your responses (**bold**, *italic*, ~~strikethrough~~, \`code\`, ## headers, etc.). Also, responses with our main site's link if someone wants a product or wants to know what we have, and do not add '.' dot after giving a link in your responses.


${this.SENTORIAL_KNOWLEDGE}${additionalContext}

Respond naturally and conversationally to: "${userMessage}"

Keep your response:
- Conversational and friendly
- Helpful and informative
- Under 300 words
- Natural, like talking to a friend
- Use markdown formatting when appropriate for emphasis
- If you have relevant information from the SenTorial website, incorporate it naturally
- Always provide relevant SenTorial links when discussing services or features
- Help users navigate the website and understand the services offered`;

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
          maxOutputTokens: 300,
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
