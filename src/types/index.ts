export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export interface BotResponse {
  [key: string]: string;
}

export interface UnknownQuestion {
  id: string;
  question: string;
  text: string;
  timestamp: number;
  count: number;
  userID?: string;
}