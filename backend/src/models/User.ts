import mongoose, { Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/IUser';

const UserSchema = new mongoose.Schema<IUser>({
  firebaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  driveAccessToken: { type: String },
  driveRefreshToken: { type: String },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};

const User = mongoose.model<IUser & Document>('User', UserSchema);
export default User;