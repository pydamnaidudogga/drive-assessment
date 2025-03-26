import api from './api';
import { Draft } from '../types/draft';

export const createDraft = async (title: string, content: string): Promise<Draft> => {
  const response = await api.post<Draft>('/drafts', { title, content });
  return response.data;
};

export const getDrafts = async (id: string): Promise<Draft> => {
  const response = await api.get<Draft>(`/drafts/${id}`);
  return response.data;
};

export const updateDraft = async (id: string, title: string, content: string): Promise<Draft> => {
  const response = await api.put<Draft>(`/drafts/${id}`, { title, content });
  return response.data;
};