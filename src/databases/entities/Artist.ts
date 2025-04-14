import mongoose, { Document, Schema } from 'mongoose';

export interface IMusicalArtist extends Document {
  name: string;
  avatar: string;
  genre?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const musicalArtistSchema: Schema<IMusicalArtist> = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    genre: { type: mongoose.Types.ObjectId, required: true, ref: 'Genre' },
  },
  {
    timestamps: true,
  }
);

// Tạo model từ schema
const MusicalArtist = mongoose.model<IMusicalArtist>(
  'MusicalArtist',
  musicalArtistSchema
);
export default MusicalArtist;
