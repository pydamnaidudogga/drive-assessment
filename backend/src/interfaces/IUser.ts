import { Document } from 'mongoose';

export interface IUser extends Document {
  firebaseId: string;
  email: string;
  name: string;
  driveAccessToken?: string;
  driveRefreshToken?: string;
  createdAt: Date;
  generateAuthToken(): string;
}

export interface DecodedToken {
  uid: string;
  email: string;
  name?: string;
}