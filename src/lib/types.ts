export interface Document {
  id: number;
  filename: string;
  mime_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface QAPair {
  id: number;
  document_id: number;
  question: string;
  answer: string;
  created_at: string;
}

export type HistoryItem = QAPair;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  isLoading?: boolean;
}
