import mongoose, { Document } from 'mongoose';
import { IDraft } from '../interfaces/IDraft';

const DraftSchema = new mongoose.Schema<IDraft>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Document' },
  content: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

const Draft = mongoose.model<IDraft & Document>('Draft', DraftSchema);
export default Draft;