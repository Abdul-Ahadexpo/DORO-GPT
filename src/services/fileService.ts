import { UnknownQuestion, BotResponse } from '../types';

export class FileService {
  static downloadUnknownQuestions(questions: UnknownQuestion[]) {
    const data = questions.map(q => ({
      text: q.text,
      question: q.question,
      timestamp: q.timestamp,
      count: q.count,
      userID: q.userID || 'anonymous'
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unknown-questions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static downloadResponses(responses: BotResponse) {
    const blob = new Blob([JSON.stringify(responses, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bot-responses-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async uploadResponses(file: File): Promise<BotResponse> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const responses = JSON.parse(content);
          
          // Validate the format
          if (typeof responses !== 'object' || responses === null) {
            throw new Error('Invalid JSON format');
          }

          // Normalize all keys to lowercase
          const normalizedResponses: BotResponse = {};
          for (const [key, value] of Object.entries(responses)) {
            if (typeof value === 'string') {
              normalizedResponses[key.toLowerCase().trim()] = value;
            }
          }

          resolve(normalizedResponses);
        } catch (error) {
          reject(new Error('Invalid JSON file format'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}