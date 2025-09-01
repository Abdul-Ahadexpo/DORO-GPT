import { database } from '../config/firebase';
import { ref, push, onValue, set, get, serverTimestamp } from 'firebase/database';
import { Message, BotResponse, UnknownQuestion } from '../types';

export class ChatService {
  private messagesRef = ref(database, 'messages');
  private responsesRef = ref(database, 'responses');
  private unknownQuestionsRef = ref(database, 'unknown_questions');

  async initializeDefaultResponses() {
    const snapshot = await get(this.responsesRef);
    if (!snapshot.exists()) {
      const defaultResponses: BotResponse = {
        'hello': 'Hello! I\'m Doro GPT. How can I help you today? 😊',
        'hi': 'Hi there! What can I do for you?',
        'how are you': 'I\'m doing great! Thanks for asking. How are you?',
        'what is your name': 'I\'m Doro GPT, your learning chatbot assistant!',
        'help': 'I\'m here to help! Ask me anything and I\'ll do my best to answer.',
        'thank you': 'You\'re welcome! Is there anything else I can help you with?',
        'thanks': 'Happy to help! 😊',
        'bye': 'Goodbye! Have a wonderful day! 👋',
        'goodbye': 'See you later! Take care! 👋'
      };
      await set(this.responsesRef, defaultResponses);
    }
  }

  async sendMessage(text: string, sender: 'user' | 'bot'): Promise<string> {
    const message: Omit<Message, 'id'> = {
      text,
      sender,
      timestamp: Date.now()
    };

    const newMessageRef = await push(this.messagesRef, message);
    return newMessageRef.key!;
  }

  async getBotResponse(userMessage: string): Promise<string> {
    const normalizedMessage = userMessage.toLowerCase().trim();
    
    // Get responses from Firebase
    const snapshot = await get(this.responsesRef);
    const responses: BotResponse = snapshot.val() || {};

    // Check for exact match first
    if (responses[normalizedMessage]) {
      return responses[normalizedMessage];
    }

    // Check for partial matches
    for (const key in responses) {
      if (normalizedMessage.includes(key) || key.includes(normalizedMessage)) {
        return responses[key];
      }
    }

    // Store unknown question
    await this.storeUnknownQuestion(userMessage);
    
    return "I don't know yet 😅. Admin will teach me soon.";
  }

  private async storeUnknownQuestion(question: string) {
    const normalizedQuestion = question.toLowerCase().trim();
    const questionKey = btoa(normalizedQuestion).replace(/[^a-zA-Z0-9]/g, '');
    const unknownRef = ref(database, `unknown_questions/${questionKey}`);
    
    const snapshot = await get(unknownRef);
    const existing = snapshot.val();

    const unknownQuestion: UnknownQuestion = {
      id: normalizedQuestion,
      question,
      text: question,
      timestamp: existing?.timestamp || Date.now(),
      count: (existing?.count || 0) + 1,
      userID: 'anonymous'
    };

    await set(unknownRef, unknownQuestion);
  }

  onMessagesChange(callback: (messages: Message[]) => void) {
    return onValue(this.messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.entries(data).map(([id, message]: [string, any]) => ({
          id,
          ...message
        }));
        messages.sort((a, b) => a.timestamp - b.timestamp);
        callback(messages);
      } else {
        callback([]);
      }
    });
  }

  onUnknownQuestionsChange(callback: (questions: UnknownQuestion[]) => void) {
    return onValue(this.unknownQuestionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const questions = Object.values(data) as UnknownQuestion[];
        questions.sort((a, b) => b.count - a.count);
        callback(questions);
      } else {
        callback([]);
      }
    });
  }

  onResponsesChange(callback: (responses: BotResponse) => void) {
    return onValue(this.responsesRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });
  }

  async addResponse(question: string, response: string) {
    const normalizedQuestion = question.toLowerCase().trim();
    await set(ref(database, `responses/${normalizedQuestion}`), response);
  }

  async deleteResponse(question: string) {
    const normalizedQuestion = question.toLowerCase().trim();
    await set(ref(database, `responses/${normalizedQuestion}`), null);
  }

  async deleteUnknownQuestion(questionId: string) {
    const key = btoa(questionId).replace(/[^a-zA-Z0-9]/g, '');
    await set(ref(database, `unknown_questions/${key}`), null);
  }

  async updateResponse(oldQuestion: string, newQuestion: string, newResponse: string) {
    // Delete old response if question changed
    if (oldQuestion !== newQuestion) {
      await this.deleteResponse(oldQuestion);
    }
    // Add new response
    await this.addResponse(newQuestion, newResponse);
  }

  async bulkAddResponses(responses: BotResponse) {
    const updates: { [key: string]: string } = {};
    
    for (const [question, response] of Object.entries(responses)) {
      const normalizedQuestion = question.toLowerCase().trim();
      updates[normalizedQuestion] = response;
    }

    await set(this.responsesRef, { ...await this.getCurrentResponses(), ...updates });
  }

  private async getCurrentResponses(): Promise<BotResponse> {
    const snapshot = await get(this.responsesRef);
    return snapshot.val() || {};
  }

  async clearAllMessages() {
    await set(this.messagesRef, null);
  }
}

export const chatService = new ChatService();