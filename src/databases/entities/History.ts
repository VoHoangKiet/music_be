import mongoose, { Document, Schema } from 'mongoose';

export interface IHistory extends Document {
  user: mongoose.Types.ObjectId;
  song: mongoose.Types.ObjectId;
  createdAt: Date;
}

const historySchema: Schema<IHistory> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
  createdAt: { type: Date, default: Date.now },
});

const History = mongoose.model<IHistory>('History', historySchema);

export default History;
