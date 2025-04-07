import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa interface cho Song
export interface ISong extends Document {
  title: string;
  albumId?: mongoose.Types.ObjectId;
  genreId?: mongoose.Types.ObjectId;
  lyric: string;
  playCount: number;
  duration: string;
  releaseDate: Date;
  adminId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const songSchema: Schema<ISong> = new Schema(
  {
    title: { type: String, required: true },
    albumId: { type: mongoose.Types.ObjectId, required: true, ref: 'Album' },
    genreId: { type: mongoose.Types.ObjectId, required: true, ref: 'Genre' },
    lyric: { type: String, required: true },
    playCount: { type: Number, default: 0 },
    duration: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    adminId: { type: mongoose.Types.ObjectId, required: true, ref: 'Admin' },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const Song = mongoose.model<ISong>('Song', songSchema);
export default Song;
