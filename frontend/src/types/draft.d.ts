export interface Draft {
    _id: string;
    userId: string;
    title: string;
    content: string;
    lastUpdated: string | Date;
    createdAt?: string | Date;
  }
  
  export interface DraftPayload {
    title: string;
    content: string;
  }
  
  export interface DraftApiResponse {
    drafts: Draft[];
    count?: number;
  }