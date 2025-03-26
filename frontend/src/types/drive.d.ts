export interface DriveFile {
   
    webViewLink: string
    id: string
    name: string
    createdTime:string
    modifiedTime: string
  }
  
  export interface SaveToDrivePayload {
    title: string;
    content: string;
    mimeType?: 'text/plain' | 'application/vnd.google-apps.document';
  }
  
  export interface DriveFileListResponse {
    files: DriveFile[];
    nextPageToken?: string;
  }