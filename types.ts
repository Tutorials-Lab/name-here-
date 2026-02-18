
export type ActiveTab = 'chat' | 'images' | 'speech';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface AudioTrack {
  id: string;
  text: string;
  voice: string;
  timestamp: number;
  blob?: Blob;
}

export enum AppStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error'
}
