
export interface Fileset {
  id: string;
  name: string;
  description?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

export interface SearchMatch {
  content: {
    text: string;
  };
  metadata: {
    path: string;
  };
}

export interface SearchResponse {
  matches: SearchMatch[];
}

export interface AiResponse {
  choices: Array<{
    output: string;
  }>;
}

export interface FilesetSearchResponse {
  fileSets: Fileset[];
}
