import mongoose, { Document } from 'mongoose';

export interface IDraft extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  lastUpdated: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DraftPayload {
  title: string;
  content: string;
}

export interface DraftResponse {
  id: string;
  title: string;
  lastUpdated: string;
  preview?: string;
}

export interface DraftListResponse {
  drafts: DraftResponse[];
  total: number;
  page: number;
  limit: number;
}