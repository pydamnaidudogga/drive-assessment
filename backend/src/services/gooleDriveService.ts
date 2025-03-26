import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Readable } from 'stream';
import { drive_v3 } from 'googleapis/build/src/apis/drive/v3';

interface DriveFile {
  id: string;
  name: string;
  webViewLink?: string;
}

export class GoogleDriveService {
  private drive: drive_v3.Drive;
  private oauth2Client: OAuth2Client;
  private lettersFolderId: string | null = null;
  constructor() {
    this.drive = google.drive('v3');
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }
  async ensureLettersFolderExists(): Promise<string> {
    if (this.lettersFolderId) return this.lettersFolderId;
   
    try {
      // Search for existing Letters folder
      const response = await this.drive.files.list({
        auth: this.oauth2Client,
        key: process.env.GOOGLE_API_KEY,
        q: "name='Letters' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'files(id)',
        spaces: 'drive'
      });

      if (response.data.files?.length) {
        this.lettersFolderId = response.data.files[0].id!;
        return this.lettersFolderId;
      }

      // Create new folder if it doesn't exist
      const folder = await this.drive.files.create({
        requestBody: {
          
          name: 'Letters',
          mimeType: 'application/vnd.google-apps.folder',
          description: 'Contains all letter documents created by the app'
        },
        auth: this.oauth2Client,
      });

      this.lettersFolderId = folder.data.id!;
      return this.lettersFolderId;
    } catch (error) {
      console.error('Error ensuring Letters folder exists:', error);
      throw new Error('Failed to setup Letters folder');
    }
  }

  async saveToDrive(userToken: string, title: string, content: string): Promise<DriveFile> {
    try {
      this.oauth2Client.setCredentials({ access_token: userToken });
      const folderId = await this.ensureLettersFolderExists();
      const bufferStream = new Readable();
      bufferStream.push(content);
      bufferStream.push(null); // Signal end of stream

      const fileMetadata = {
        name: `${title}.txt`,
        mimeType: 'text/plain',
        parents: [folderId] // Save in Letters folder
      };

      const media = {
        mimeType: 'text/plain',
        body: bufferStream
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink',
        auth: this.oauth2Client
      });

      if (!response.data) {
        throw new Error('No data received from Google Drive API');
      }

      return {
        id: response.data.id as string,
        name: response.data.name as string,
        webViewLink: response.data.webViewLink as string
      };
    } catch (error: unknown) {
      console.error('Error saving to Drive:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to save file to Google Drive'
      );
    }
  }

  async listDocuments(userToken: string): Promise<drive_v3.Schema$File[]> {
    try {
      this.oauth2Client.setCredentials({ access_token: userToken });
      const folderId = await this.ensureLettersFolderExists();
      const response = await this.drive.files.list({
        auth: this.oauth2Client,
        // Add API key to request params
        key: process.env.GOOGLE_API_KEY,
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id,name,createdTime,modifiedTime,webViewLink)',
        orderBy: 'modifiedTime desc'
      });
      console.log(response)

      return response.data.files || [];
    } catch (error: unknown) {
      console.error('Error listing documents:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to list Google Drive documents'
      );
      
    }
  }
}

export default new GoogleDriveService();