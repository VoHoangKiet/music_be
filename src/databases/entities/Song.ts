import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa interface cho Song
export interface ISong extends Document {
  title: string;
  genre: mongoose.Types.ObjectId;
  lyric: string;
  playCount: number;
  duration: string;
  releaseDate: Date;
  secureUrl: string;
  admin?: mongoose.Types.ObjectId;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

const songSchema: Schema<ISong> = new Schema(
  {
    title: { type: String, required: true },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
    lyric: { type: String, required: true },
    playCount: { type: Number, default: 0 },
    duration: { type: String, required: true },
    secureUrl: { type: String, required: true },
    thumbnail: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const Song = mongoose.model<ISong>('Song', songSchema);
export default Song;
