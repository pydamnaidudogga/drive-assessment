import { Request, Response } from 'express';
import GoogleDriveService from '../services/gooleDriveService';
import User from '../models/User';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    driveAccessToken?: string;
    driveRefreshToken?: string;
  };
}

export const saveToDrive = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user || !user.driveAccessToken) {
      res.status(401).json({ message: 'Google Drive access not configured' });
      return;
    }

    const result = await GoogleDriveService.saveToDrive(user.driveAccessToken, title, content);
    console.log(result,'drive result')
    res.json({
      message: 'Document saved to Google Drive successfully',
      file: result
    });
  } catch (error: unknown) {
    console.error('Error saving to Drive:', error);
    
    if (error instanceof Error && error.message.includes('Invalid Credentials') || error instanceof Error && error.message.includes('Failed to setup Letters folder')) {
      // Token expired, need to refresh
      try {
        await refreshAccessToken(req.user?._id);
        // Retry the operation
        return saveToDrive(req, res);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        res.status(401).json({ message: 'Authentication expired. Please re-authenticate with Google.' });
        return;
      }
    }

    res.status(500).json({ 
      message: 'Failed to save document to Google Drive',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const listDriveFiles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user || !user.driveAccessToken) {
      res.status(401).json({ message: 'Google Drive access not configured' });
      return;
    }

    const files = await GoogleDriveService.listDocuments(user.driveAccessToken);
    
    res.json( files );
  } catch (error: unknown) {
    console.error('Error listing Drive files:', error);
    
    if (error instanceof Error && error.message.includes('Invalid Credentials') || error instanceof Error && error.message.includes('Failed to setup Letters folder')) {
      try {
        await refreshAccessToken(req.user?._id);
        return listDriveFiles(req, res);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        res.status(401).json({ message: 'Authentication expired. Please re-authenticate with Google.' });
        return;
      }
    }

    res.status(500).json({ 
      message: 'Failed to list Drive documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const authorizeDrive = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    await User.findByIdAndUpdate(req.user?._id, {
      driveAccessToken: tokens.access_token,
      driveRefreshToken: tokens.refresh_token
    });

    res.json({ 
      message: 'Google Drive authorization successful',
      expiresIn: tokens.expiry_date
    });
  } catch (error: unknown) {
    console.error('Drive authorization error:', error);
    res.status(400).json({ 
      message: 'Google Drive authorization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

async function refreshAccessToken(userId?: string): Promise<void> {
  if (!userId) throw new Error('User ID required');
  
  const user = await User.findById(userId);
  if (!user || !user.driveRefreshToken) throw new Error('No refresh token available');

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: user.driveRefreshToken
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  
  await User.findByIdAndUpdate(userId, {
    driveAccessToken: credentials.access_token,
    ...(credentials.refresh_token ? { driveRefreshToken: credentials.refresh_token } : {})
  });
}

export const checkAccess = async (req: any, res: Response): Promise<void> => {
try {
    const hasAccess = !!req.user?.driveAccessToken;
   res.json({ hasAccess, authorized: hasAccess });
} catch (error) {
    console.log(error)
    res.status(400).json({ 
        message: 'Google Drive authorization failed',
        error: 'Unknown in checkAccess at driveController'
      });
}
}

export const getAccess = async (req: any, res: Response): Promise<void> => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
      
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive.metadata.readonly',
                 'https://www.googleapis.com/auth/drive.readonly'],
        state: req.user?._id.toString(),
        include_granted_scopes: true
      });
      
      res.json({ url });
    }

    export const callBackFunction = async (req: any, res: Response): Promise<void> => {
        try {
            const { code, state } = req.query;
            const oauth2Client = new google.auth.OAuth2(
              process.env.GOOGLE_CLIENT_ID,
              process.env.GOOGLE_CLIENT_SECRET,
              process.env.GOOGLE_REDIRECT_URI
            );
            
            const { tokens } = await oauth2Client.getToken(code as string);
            
            await User.findByIdAndUpdate(state, {
              driveAccessToken: tokens.access_token,
              driveRefreshToken: tokens.refresh_token
            });
            
            res.send('<script>window.close()</script>');
          } catch (error) {
            res.status(400).send('Authorization failed');
          }
        }