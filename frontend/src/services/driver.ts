import api from './api';

interface DriveFile {
  id: string;
  name: string;
  createdTime?: string;
  modifiedTime?: string;
  url?: string;
}

export const saveToDrive = async (title: string, content: string): Promise<DriveFile> => {
  const response = await api.post<DriveFile>('/drive/save', { title, content });
  return response.data;
};

export const listDriveFiles = async (): Promise<DriveFile[]> => {
  const response = await api.get<DriveFile[]>('/drive/documents');
  return response.data;
};